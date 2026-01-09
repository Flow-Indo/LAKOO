package service

import (
	"context"
	"log"

	"github.com/Flow-Indo/LAKOO/backend/services/order-service/internal/repository"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/models"

	"github.com/Flow-Indo/LAKOO/backend/services/order-service/types"
	"github.com/Flow-Indo/LAKOO/backend/services/order-service/utils"
	"github.com/Flow-Indo/LAKOO/backend/shared/kafka"
	sharedTypes "github.com/Flow-Indo/LAKOO/backend/shared/types"
)

type OrderService struct {
	orderRepository *repository.OrderRepository
	producer        *kafka.KafkaProducer
}

func NewService(orderRepository *repository.OrderRepository) *OrderService {
	return &OrderService{
		orderRepository: orderRepository,
		producer: kafka.NewProducer(
			[]string{"localhost:9092", "localhost:9093"},
			"order_event",
		),
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

func (service *OrderService) CreateOrder(createOrderPayload types.CreateOrderPayload, ctx context.Context) error {
	jsonPayload, err := utils.PayloadToMap(createOrderPayload)
	if err != nil {
		return err
	}

	if err := service.orderRepository.CreateOrder(jsonPayload); err != nil {
		return err
	}

	if err := service.producer.PublishMessage(ctx, []byte("testing"), []byte("Created Order")); err != nil {
		log.Printf("Could not publish message in Create Order, %v", err)
	}

	return nil
}

func (service *OrderService) parseToOrderResponse(orders []models.Order) []types.OrderResponse {
	var orderResponses []types.OrderResponse

	for _, order := range orders {
		orderResponses = append(orderResponses, types.OrderResponse{
			ID:                    order.ID,
			OrderNumber:           order.OrderNumber,
			UserID:                order.UserID,
			GroupSessionID:        order.GroupSessionID,
			Status:                order.Status,
			Subtotal:              order.Subtotal,
			ShippingCost:          order.ShippingCost,
			TaxAmount:             order.TaxAmount,
			DiscountAmount:        order.DiscountAmount,
			TotalAmount:           order.TotalAmount,
			ShippingName:          order.ShippingName,
			ShippingPhone:         order.ShippingPhone,
			ShippingProvince:      order.ShippingProvince,
			ShippingCity:          order.ShippingCity,
			ShippingDistrict:      order.ShippingDistrict,
			ShippingPostalCode:    order.ShippingPostalCode,
			ShippingAddress:       order.ShippingAddress,
			ShippingNotes:         order.ShippingNotes,
			EstimatedDeliveryDate: order.EstimatedDeliveryDate,
			PaidAt:                order.PaidAt,
			ShippedAt:             order.ShippedAt,
			DeliveredAt:           order.DeliveredAt,
			CancelledAt:           order.CancelledAt,
			CreatedAt:             order.CreatedAt,
			UpdatedAt:             order.UpdatedAt,
			OrderItems:            service.toOrderItemResponses(order.OrderItems),
			User:                  service.toUserResponse(order.User),
		})
	}

	return orderResponses
}

func (service *OrderService) toOrderItemResponses(orderItems []models.OrderItem) []types.OrderItemResponse {
	responses := make([]types.OrderItemResponse, len(orderItems))
	for i, item := range orderItems {
		responses[i] = types.OrderItemResponse{
			ID:          item.ID,
			OrderID:     item.OrderID,
			ProductID:   item.ProductID,
			VariantID:   item.VariantID,
			FactoryID:   item.FactoryID,
			SKU:         item.SKU,
			ProductName: item.ProductName,
			VariantName: item.VariantName,
			Quantity:    item.Quantity,
			UnitPrice:   item.UnitPrice,
			Subtotal:    item.Subtotal,
			CreatedAt:   item.CreatedAt,
			Product: types.ProductResponse{
				ID:              item.Product.ID,
				Name:            item.Product.Name,
				PrimaryImageURL: item.Product.PrimaryImageURL,
			},
			Factory: types.FactoryResponse{
				ID:          item.Factory.ID,
				FactoryName: item.Factory.FactoryName,
			},

			ProductSnapshot: service.parseProductSnapshot(item.ProductSnapshot),
		}
	}

	return responses
}

// just in case if user model can be more than these fields
func (service *OrderService) toUserResponse(user models.User) types.UserResponse {
	userResponse := types.UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
	}

	return userResponse
}

func (s *OrderService) parseProductSnapshot(snapshot sharedTypes.JSONB) types.ProductSnapshot {

	return types.ProductSnapshot{
		Factory: types.ProductSnapshotFactory{
			ID:          utils.GetStringFromJSONB(snapshot, "factory.id"),
			City:        utils.GetStringFromJSONB(snapshot, "factory.city"),
			FactoryName: utils.GetStringFromJSONB(snapshot, "factory.factory_name"),
		},
		Product: types.ProductSnapshotProduct{
			ID:              utils.GetStringFromJSONB(snapshot, "product.id"),
			SKU:             utils.GetStringFromJSONB(snapshot, "product.sku"),
			Name:            utils.GetStringFromJSONB(snapshot, "product.name"),
			WidthCM:         utils.GetIntFromJSONB(snapshot, "product.width_cm"),
			HeightCM:        utils.GetIntFromJSONB(snapshot, "product.height_cm"),
			LengthCM:        utils.GetIntFromJSONB(snapshot, "product.length_cm"),
			BasePrice:       utils.GetIntFromJSONB(snapshot, "product.base_price"),
			FactoryID:       utils.GetStringFromJSONB(snapshot, "product.factory_id"),
			Description:     utils.GetStringFromJSONB(snapshot, "product.description"),
			WeightGrams:     utils.GetIntFromJSONB(snapshot, "product.weight_grams"),
			PrimaryImageURL: utils.GetStringFromJSONB(snapshot, "product.primary_image_url"),
		},
		Category: types.ProductSnapshotCategory{
			ID:   utils.GetStringFromJSONB(snapshot, "category.id"),
			Name: utils.GetStringFromJSONB(snapshot, "category.name"),
			Slug: utils.GetStringFromJSONB(snapshot, "category.slug"),
		},
	}
}
