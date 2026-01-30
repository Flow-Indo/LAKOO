package service

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/Flow-Indo/LAKOO/backend/services/order-service/clients"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/config"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/internal/repository"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/models"

	"github.com/Flow-Indo/LAKOO/backend/services/order-service/types"
	"github.com/Flow-Indo/LAKOO/backend/shared/go/kafka"
	"github.com/Flow-Indo/LAKOO/backend/shared/go/utils"
	"github.com/google/uuid"
	"github.com/shopspring/decimal"
)

type OrderService struct {
	orderRepository *repository.OrderRepository
	producer        *kafka.KafkaProducer
	cartClient      *clients.CartClient
}

func NewService(orderRepository *repository.OrderRepository) *OrderService {
	brokers := strings.Split(config.Envs.KAFKA_BROKERS, ",")
	if len(brokers) == 0 || brokers[0] == "" {
		brokers = []string{"localhost:9092"} // local dev fallback
	}
	return &OrderService{
		orderRepository: orderRepository,
		producer: kafka.NewProducer(
			brokers,
			"order_event",
		),
		cartClient: clients.NewCartClient(),
	}
}

func (service *OrderService) GetOrders(filterPaylod types.OrderFilterPayload) ([]types.OrderResponse, error) {
	jsonPayload, err := utils.PayloadToMap(filterPaylod)
	if err != nil {
		return []types.OrderResponse{}, err
	}

	orders, err := service.orderRepository.GetOrders(jsonPayload)
	if err != nil {
		return []types.OrderResponse{}, err
	}

	return service.parseToOrderResponse(orders), nil
}

func (service *OrderService) CreateOrder(createOrderPayload types.CreateOrderPayload, ctx context.Context) (*models.Order, error) {
	// Validate basic UUID format early
	if _, err := uuid.Parse(createOrderPayload.UserID); err != nil {
		return nil, fmt.Errorf("invalid userId: %w", err)
	}

	// Fetch cart snapshot for pricing + product snapshot fields
	cart, err := service.cartClient.GetCart(createOrderPayload.UserID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	order := &models.Order{
		OrderNumber:    fmt.Sprintf("ORD-%d", now.UnixNano()),
		UserID:         createOrderPayload.UserID,
		OrderSource:    models.OrderSourceBrand,
		Subtotal:       decimal.NewFromInt(0),
		ShippingCost:   decimal.NewFromInt(0),
		TaxAmount:      decimal.NewFromInt(0),
		DiscountAmount: decimal.NewFromInt(0),
		TotalAmount:    decimal.NewFromInt(0),
		Currency:       "IDR",

		ShippingRecipient:  createOrderPayload.ShippingAddress.Name,
		ShippingPhone:      createOrderPayload.ShippingAddress.Phone,
		ShippingStreet:     createOrderPayload.ShippingAddress.Address,
		ShippingDistrict:   &createOrderPayload.ShippingAddress.District,
		ShippingCity:       createOrderPayload.ShippingAddress.City,
		ShippingProvince:   createOrderPayload.ShippingAddress.Province,
		ShippingPostalCode: createOrderPayload.ShippingAddress.PostalCode,
		ShippingCountry:    "Indonesia",

		CustomerPhone: createOrderPayload.ShippingAddress.Phone,
		CustomerName:  createOrderPayload.ShippingAddress.Name,

		Status:    models.OrderStatusPending,
		CreatedAt: now,
		UpdatedAt: now,
	}

	// Ensure required not-null field is present
	if order.ShippingPostalCode == "" {
		order.ShippingPostalCode = "00000"
	}

	// Build order items from cart snapshot (fallback to request items if cart is empty)
	var items []models.OrderItem
	var subtotal decimal.Decimal

	for _, cartItem := range cart.Items {
		productID := cartItem.ProductID
		unitPrice := decimal.NewFromFloat(cartItem.CurrentUnitPrice)
		lineSubtotal := unitPrice.Mul(decimal.NewFromInt(int64(cartItem.Quantity)))

		itemType := models.OrderItemTypeBrandProduct
		if cartItem.ItemType == "seller_product" {
			itemType = models.OrderItemTypeSellerProduct
			order.OrderSource = models.OrderSourceSeller
		}

		items = append(items, models.OrderItem{
			ItemType:  itemType,
			ProductID: &productID,
			VariantID: nil,
			BrandID:   cartItem.BrandID,
			SellerID:  cartItem.SellerID,

			SnapshotProductName: cartItem.SnapshotProductName,
			SnapshotVariantName: cartItem.SnapshotVariantName,
			SnapshotSKU:         cartItem.SnapshotSKU,
			SnapshotImageURL:    cartItem.SnapshotImageURL,
			SnapshotBrandName:   cartItem.SnapshotBrandName,
			SnapshotSellerName:  cartItem.SnapshotSellerName,

			UnitPrice:   unitPrice,
			Quantity:    cartItem.Quantity,
			Subtotal:    lineSubtotal,
			TotalAmount: lineSubtotal,
			CreatedAt:   now,
		})

		subtotal = subtotal.Add(lineSubtotal)
	}

	order.Items = items
	order.Subtotal = subtotal
	order.TotalAmount = subtotal

	if err := service.orderRepository.CreateOrder(ctx, order); err != nil {
		return nil, err
	}

	// IMPORTANT (MVP): clear cart after successful order creation.
	// If this fails, we log but do not fail the order (can be retried).
	if err := service.cartClient.ClearCart(createOrderPayload.UserID); err != nil {
		log.Printf("Warning: failed to clear cart for user %s: %v", createOrderPayload.UserID, err)
	}

	if err := service.producer.PublishMessage(ctx, []byte("testing"), []byte("Created Order")); err != nil {
		log.Printf("Could not publish message in Create Order, %v", err)
	}

	return order, nil
}

func (service *OrderService) parseToOrderResponse(orders []models.Order) []types.OrderResponse {
	var orderResponses []types.OrderResponse

	for _, order := range orders {
		// Map shipping district - use empty string if nil
		shippingDistrict := ""
		if order.ShippingDistrict != nil {
			shippingDistrict = *order.ShippingDistrict
		}

		// Map customer notes
		customerNotes := ""
		if order.CustomerNotes != nil {
			customerNotes = *order.CustomerNotes
		}

		orderResponses = append(orderResponses, types.OrderResponse{
			ID:                    order.ID,
			OrderNumber:           order.OrderNumber,
			UserID:                order.UserID,
			GroupSessionID:        order.LiveSessionID,
			Status:                string(order.Status),
			Subtotal:              order.Subtotal,
			ShippingCost:          order.ShippingCost,
			TaxAmount:             order.TaxAmount,
			DiscountAmount:        order.DiscountAmount,
			TotalAmount:           order.TotalAmount,
			ShippingName:          order.ShippingRecipient,
			ShippingPhone:         order.ShippingPhone,
			ShippingProvince:      order.ShippingProvince,
			ShippingCity:          order.ShippingCity,
			ShippingDistrict:      shippingDistrict,
			ShippingPostalCode:    order.ShippingPostalCode,
			ShippingAddress:       order.ShippingStreet,
			ShippingNotes:         &customerNotes,
			EstimatedDeliveryDate: order.EstimatedDelivery,
			PaidAt:                order.PaidAt,
			ShippedAt:             order.ShippedAt,
			DeliveredAt:           order.DeliveredAt,
			CancelledAt:           order.CancelledAt,
			CreatedAt:             order.CreatedAt,
			UpdatedAt:             order.UpdatedAt,
			OrderItems:            service.toOrderItemResponses(order.Items),
			User:                  types.UserResponse{}, // User data should be fetched from auth service if needed
		})
	}

	return orderResponses
}

func (service *OrderService) toOrderItemResponses(orderItems []models.OrderItem) []types.OrderItemResponse {
	responses := make([]types.OrderItemResponse, len(orderItems))
	for i, item := range orderItems {
		// Map nullable fields
		productID := ""
		if item.ProductID != nil {
			productID = *item.ProductID
		}

		sku := ""
		if item.SnapshotSKU != nil {
			sku = *item.SnapshotSKU
		}

		// Map seller/brand IDs to factory ID for backwards compatibility
		factoryID := ""
		if item.BrandID != nil {
			factoryID = *item.BrandID
		} else if item.SellerID != nil {
			factoryID = *item.SellerID
		}

		responses[i] = types.OrderItemResponse{
			ID:          item.ID,
			OrderID:     item.OrderID,
			ProductID:   productID,
			VariantID:   item.VariantID,
			FactoryID:   factoryID,
			SKU:         sku,
			ProductName: item.SnapshotProductName,
			VariantName: item.SnapshotVariantName,
			Quantity:    item.Quantity,
			UnitPrice:   item.UnitPrice,
			Subtotal:    item.Subtotal,
			CreatedAt:   item.CreatedAt,
			// Product and Factory relations don't exist in the new model
			// These should be fetched from respective services if needed
			Product: types.ProductResponse{},
			Factory: types.FactoryResponse{},
			// Product snapshot is now embedded in the model fields
			ProductSnapshot: types.ProductSnapshot{},
		}
	}

	return responses
}

// Note: User model doesn't exist in order-service
// User data should be fetched from auth-service via HTTP client if needed
