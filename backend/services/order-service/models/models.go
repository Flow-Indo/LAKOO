// models/order.go
package models

import (
	"time"

	"github.com/Flow-Indo/LAKOO/backend/shared/types"
	"github.com/shopspring/decimal"
)

type Order struct {
	ID                    string          `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	OrderNumber           string          `gorm:"uniqueIndex;not null" json:"order_number"`
	UserID                string          `gorm:"type:uuid;not null" json:"user_id"`
	GroupSessionID        *string         `gorm:"type:uuid;null" json:"group_session_id"`
	Status                string          `gorm:"type:varchar(50);not null" json:"status"`
	Subtotal              decimal.Decimal `gorm:"type:decimal(10, 2)" json:"subtotal"`
	ShippingCost          decimal.Decimal `gorm:"type:bigint;not null" json:"shipping_cost"`
	TaxAmount             decimal.Decimal `gorm:"type:bigint;not null" json:"tax_amount"`
	DiscountAmount        decimal.Decimal `gorm:"type:bigint;not null" json:"discount_amount"`
	TotalAmount           decimal.Decimal `gorm:"type:bigint;not null" json:"total_amount"`
	ShippingName          string          `gorm:"type:varchar(255);not null" json:"shipping_name"`
	ShippingPhone         string          `gorm:"type:varchar(20);not null" json:"shipping_phone"`
	ShippingProvince      string          `gorm:"type:varchar(100);not null" json:"shipping_province"`
	ShippingCity          string          `gorm:"type:varchar(100);not null" json:"shipping_city"`
	ShippingDistrict      string          `gorm:"type:varchar(100);not null" json:"shipping_district"`
	ShippingPostalCode    string          `gorm:"type:varchar(10);not null" json:"shipping_postal_code"`
	ShippingAddress       string          `gorm:"type:text;not null" json:"shipping_address"`
	ShippingNotes         *string         `gorm:"type:text;null" json:"shipping_notes"`
	EstimatedDeliveryDate *time.Time      `gorm:"null" json:"estimated_delivery_date"`
	PaidAt                *time.Time      `gorm:"null" json:"paid_at"`
	ShippedAt             *time.Time      `gorm:"null" json:"shipped_at"`
	DeliveredAt           *time.Time      `gorm:"null" json:"delivered_at"`
	CancelledAt           *time.Time      `gorm:"null" json:"cancelled_at"`
	CreatedAt             time.Time       `gorm:"not null" json:"created_at"`
	UpdatedAt             time.Time       `gorm:"not null" json:"updated_at"`

	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"order_items"`
	User       User        `gorm:"foreignKey:UserID" json:"users"`
}

type OrderItem struct {
	ID              string          `gorm:"type:uuid;primaryKey;default:uuid_generate_v4()" json:"id"`
	OrderID         string          `gorm:"type:uuid;not null" json:"order_id"`
	ProductID       string          `gorm:"type:uuid;not null" json:"product_id"`
	VariantID       *string         `gorm:"type:uuid;null" json:"variant_id"`
	FactoryID       string          `gorm:"type:uuid;not null" json:"factory_id"`
	SKU             string          `gorm:"type:varchar(100);not null" json:"sku"`
	ProductName     string          `gorm:"type:varchar(255);not null" json:"product_name"`
	VariantName     *string         `gorm:"type:varchar(255);null" json:"variant_name"`
	Quantity        int             `gorm:"not null" json:"quantity"`
	UnitPrice       decimal.Decimal `gorm:"type:bigint;not null" json:"unit_price"`
	Subtotal        decimal.Decimal `gorm:"type:bigint;not null" json:"subtotal"`
	ProductSnapshot types.JSONB     `gorm:"type:jsonb" json:"product_snapshot"`
	CreatedAt       time.Time       `gorm:"not null" json:"created_at"`

	Order   Order   `gorm:"foreignKey:OrderID" json:"-"`
	Product Product `gorm:"foreignKey:ProductID" json:"products"`
	Factory Factory `gorm:"foreignKey:FactoryID" json:"factories"`
}

type Product struct {
	ID              string `gorm:"type:uuid;primaryKey" json:"id"`
	Name            string `gorm:"not null" json:"name"`
	PrimaryImageURL string `gorm:"type:text" json:"primary_image_url"`
}

type Factory struct {
	ID          string `gorm:"type:uuid;primaryKey" json:"id"`
	FactoryName string `gorm:"not null" json:"factory_name"`
}

type User struct {
	ID        string `gorm:"type:uuid;primaryKey" json:"id"`
	FirstName string `gorm:"not null" json:"first_name"`
	LastName  string `gorm:"not null" json:"last_name"`
	Email     string `gorm:"uniqueIndex;not null" json:"email"`
}
