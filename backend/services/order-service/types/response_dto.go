package types

import (
	"time"

	"github.com/shopspring/decimal"
)

type OrderResponse struct {
	ID                    string          `json:"id"`
	OrderNumber           string          `json:"order_number"`
	UserID                string          `json:"user_id"`
	GroupSessionID        *string         `json:"group_session_id"`
	Status                string          `json:"status"`
	Subtotal              decimal.Decimal `json:"subtotal"`
	ShippingCost          decimal.Decimal `json:"shipping_cost"`
	TaxAmount             decimal.Decimal `json:"tax_amount"`
	DiscountAmount        decimal.Decimal `json:"discount_amount"`
	TotalAmount           decimal.Decimal `json:"total_amount"`
	ShippingName          string          `json:"shipping_name"`
	ShippingPhone         string          `json:"shipping_phone"`
	ShippingProvince      string          `json:"shipping_province"`
	ShippingCity          string          `json:"shipping_city"`
	ShippingDistrict      string          `json:"shipping_district"`
	ShippingPostalCode    string          `json:"shipping_postal_code"`
	ShippingAddress       string          `json:"shipping_address"`
	ShippingNotes         *string         `json:"shipping_notes"`
	EstimatedDeliveryDate *time.Time      `json:"estimated_delivery_date"`
	PaidAt                *time.Time      `json:"paid_at"`
	ShippedAt             *time.Time      `json:"shipped_at"`
	DeliveredAt           *time.Time      `json:"delivered_at"`
	CancelledAt           *time.Time      `json:"cancelled_at"`
	CreatedAt             time.Time       `json:"created_at"`
	UpdatedAt             time.Time       `json:"updated_at"`

	OrderItems []OrderItemResponse `json:"order_items"`
	User       UserResponse        `json:"users"`
}

type OrderItemResponse struct {
	ID              string          `json:"id"`
	OrderID         string          `json:"order_id"`
	ProductID       string          `json:"product_id"`
	VariantID       *string         `json:"variant_id"`
	FactoryID       string          `json:"factory_id"`
	SKU             string          `json:"sku"`
	ProductName     string          `json:"product_name"`
	VariantName     *string         `json:"variant_name"`
	Quantity        int             `json:"quantity"`
	UnitPrice       decimal.Decimal `json:"unit_price"`
	Subtotal        decimal.Decimal `json:"subtotal"`
	ProductSnapshot ProductSnapshot `json:"product_snapshot"`
	CreatedAt       time.Time       `json:"created_at"`

	Product ProductResponse `json:"products"`
	Factory FactoryResponse `json:"factories"`
}

type ProductResponse struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	PrimaryImageURL string `json:"primary_image_url"`
}

type FactoryResponse struct {
	ID          string `json:"id"`
	FactoryName string `json:"factory_name"`
}

type UserResponse struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}
