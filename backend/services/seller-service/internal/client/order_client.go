package client

import (
	"context"
	"time"
)

// OrderServiceClient is a thin HTTP client for the order-service.
// For now it returns mock data so we can wire the flow safely
// while the real order-service is being implemented.
type OrderServiceClient struct {
	baseURL string
}

func NewOrderServiceClient(baseURL string) *OrderServiceClient {
	return &OrderServiceClient{baseURL: baseURL}
}

// -------- Shared DTOs (keep in sync with seller-dashboard) --------

type OrderListItem struct {
	ID           string  `json:"id"`
	OrderNumber  string  `json:"order_number"`
	Status       string  `json:"status"`
	CreatedAt    string  `json:"created_at"`
	BuyerName    string  `json:"buyer_name"`
	TotalAmount  float64 `json:"total_amount"`
	ShippingCity string  `json:"shipping_city"`
}

type ListOrdersResponse struct {
	Orders []OrderListItem `json:"orders"`
	Page   int             `json:"page"`
	Limit  int             `json:"limit"`
	Total  int64           `json:"total"`
}

type OrderItem struct {
	ID          string  `json:"id"`
	ProductID   string  `json:"product_id"`
	Name        string  `json:"name"`
	Variant     string  `json:"variant,omitempty"`
	Quantity    int     `json:"quantity"`
	UnitPrice   float64 `json:"unit_price"`
	Subtotal    float64 `json:"subtotal"`
	ImageURL    string  `json:"image_url,omitempty"`
}

type OrderDetail struct {
	ID                    string      `json:"id"`
	OrderNumber           string      `json:"order_number"`
	Status                string      `json:"status"`
	CreatedAt             string      `json:"created_at"`
	BuyerName             string      `json:"buyer_name"`
	BuyerPhone            string      `json:"buyer_phone"`
	ShippingAddress       string      `json:"shipping_address"`
	ShippingCity          string      `json:"shipping_city"`
	ShippingPostalCode    string      `json:"shipping_postal_code"`
	Subtotal              float64     `json:"subtotal"`
	ShippingCost          float64     `json:"shipping_cost"`
	TaxAmount             float64     `json:"tax_amount"`
	DiscountAmount        float64     `json:"discount_amount"`
	TotalAmount           float64     `json:"total_amount"`
	TrackingNumber        string      `json:"tracking_number,omitempty"`
	EstimatedDeliveryDate string      `json:"estimated_delivery_date,omitempty"`
	Items                 []OrderItem `json:"items"`
}

// -------- MOCK IMPLEMENTATIONS --------

func (c *OrderServiceClient) ListOrders(
	ctx context.Context,
	sellerID string,
	query map[string]string,
) (ListOrdersResponse, error) {
	now := time.Now().Format(time.RFC3339)

	items := []OrderListItem{
		{
			ID:           "order-1",
			OrderNumber:  "INV-20260127-0001",
			Status:       "pending",
			CreatedAt:    now,
			BuyerName:    "John Doe",
			TotalAmount:  155000,
			ShippingCity: "Jakarta",
		},
		{
			ID:           "order-2",
			OrderNumber:  "INV-20260126-0002",
			Status:       "ready_to_ship",
			CreatedAt:    now,
			BuyerName:    "Jane Smith",
			TotalAmount:  230000,
			ShippingCity: "Bandung",
		},
		{
			ID:           "order-3",
			OrderNumber:  "INV-20260125-0003",
			Status:       "shipped",
			CreatedAt:    now,
			BuyerName:    "Andi",
			TotalAmount:  99000,
			ShippingCity: "Surabaya",
		},
	}

	// Simple status filter in-memory (for demo only)
	if status, ok := query["status"]; ok && status != "" {
		filtered := make([]OrderListItem, 0, len(items))
		for _, o := range items {
			if o.Status == status {
				filtered = append(filtered, o)
			}
		}
		items = filtered
	}

	return ListOrdersResponse{
		Orders: items,
		Page:   1,
		Limit:  len(items),
		Total:  int64(len(items)),
	}, nil
}

func (c *OrderServiceClient) GetOrder(
	ctx context.Context,
	sellerID, orderID string,
) (OrderDetail, error) {
	now := time.Now().Format(time.RFC3339)

	return OrderDetail{
		ID:                  "order-1",
		OrderNumber:         "INV-20260127-0001",
		Status:              "pending",
		CreatedAt:           now,
		BuyerName:           "John Doe",
		BuyerPhone:          "+62 812 3456 7890",
		ShippingAddress:     "Jl. Contoh No. 123, Kelurahan Contoh",
		ShippingCity:        "Jakarta",
		ShippingPostalCode:  "12345",
		Subtotal:            140000,
		ShippingCost:        15000,
		TaxAmount:           0,
		DiscountAmount:      0,
		TotalAmount:         155000,
		TrackingNumber:      "",
		EstimatedDeliveryDate: "",
		Items: []OrderItem{
			{
				ID:        "item-1",
				ProductID: "prod-1",
				Name:      "Kaos Laku Merah",
				Variant:   "Size M",
				Quantity:  1,
				UnitPrice: 75000,
				Subtotal:  75000,
			},
			{
				ID:        "item-2",
				ProductID: "prod-2",
				Name:      "Celana Laku Hitam",
				Variant:   "Size 32",
				Quantity:  1,
				UnitPrice: 65000,
				Subtotal:  65000,
			},
		},
	}, nil
}

func (c *OrderServiceClient) ConfirmOrder(
	ctx context.Context,
	sellerID, orderID string,
) error {
	// TODO: call real order-service POST /orders/{id}/confirm
	return nil
}

func (c *OrderServiceClient) ShipOrder(
	ctx context.Context,
	sellerID, orderID string,
) error {
	// TODO: call real order-service POST /orders/{id}/ship
	return nil
}

func (c *OrderServiceClient) UpdateTracking(
	ctx context.Context,
	sellerID, orderID, trackingNumber string,
) error {
	// TODO: call real order-service PATCH /orders/{id}/tracking
	return nil
}

