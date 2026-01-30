package models

import (
	"time"

	"github.com/shopspring/decimal"
)

// OrderSource indicates where the order items come from
type OrderSource string

const (
	OrderSourceBrand       OrderSource = "brand"         // From LAKOO brands (warehouse)
	OrderSourceSeller      OrderSource = "seller"        // From third-party sellers
	OrderSourceLiveCommerce OrderSource = "live_commerce" // From live streaming
)

type OrderItemType string

const (
	OrderItemTypeBrandProduct  OrderItemType = "brand_product"
	OrderItemTypeSellerProduct OrderItemType = "seller_product"
)

type OrderStatus string

const (
	OrderStatusPending          OrderStatus = "pending"
	OrderStatusAwaitingPayment  OrderStatus = "awaiting_payment"
	OrderStatusPaid             OrderStatus = "paid"
	OrderStatusConfirmed        OrderStatus = "confirmed"
	OrderStatusProcessing       OrderStatus = "processing"
	OrderStatusReadyToShip      OrderStatus = "ready_to_ship"
	OrderStatusShipped          OrderStatus = "shipped"
	OrderStatusInTransit        OrderStatus = "in_transit"
	OrderStatusOutForDelivery   OrderStatus = "out_for_delivery"
	OrderStatusDelivered        OrderStatus = "delivered"
	OrderStatusCompleted        OrderStatus = "completed"
	OrderStatusCancelled        OrderStatus = "cancelled"
	OrderStatusRefunded         OrderStatus = "refunded"
	OrderStatusPartiallyRefunded OrderStatus = "partially_refunded"
)

type Order struct {
	ID          string      `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	OrderNumber string      `gorm:"type:varchar(50);uniqueIndex;not null;column:order_number" json:"order_number"`
	UserID      string      `gorm:"type:uuid;not null;column:user_id" json:"user_id"`
	OrderSource OrderSource `gorm:"type:varchar(20);not null;default:'brand';column:order_source" json:"order_source"`

	// Source references (mutually exclusive based on orderSource)
	BrandID  *string `gorm:"type:uuid;index;column:brand_id" json:"brand_id"`
	SellerID *string `gorm:"type:uuid;index;column:seller_id" json:"seller_id"`

	// Amounts
	Subtotal       decimal.Decimal `gorm:"type:decimal(15,2);not null" json:"subtotal"`
	DiscountAmount decimal.Decimal `gorm:"type:decimal(15,2);not null;default:0;column:discount_amount" json:"discount_amount"`
	ShippingCost   decimal.Decimal `gorm:"type:decimal(15,2);not null;default:0;column:shipping_cost" json:"shipping_cost"`
	TaxAmount      decimal.Decimal `gorm:"type:decimal(15,2);not null;default:0;column:tax_amount" json:"tax_amount"`
	TotalAmount    decimal.Decimal `gorm:"type:decimal(15,2);not null;column:total_amount" json:"total_amount"`
	Currency       string          `gorm:"type:varchar(3);not null;default:'IDR'" json:"currency"`

	// Coupon/Promotion
	CouponID   *string `gorm:"type:uuid;column:coupon_id" json:"coupon_id"`
	CouponCode *string `gorm:"type:varchar(50);column:coupon_code" json:"coupon_code"`

	// ==========================================================================
	// SHIPPING ADDRESS SNAPSHOT (frozen at order time)
	// ==========================================================================
	ShippingAddressID  *string          `gorm:"type:uuid;column:shipping_address_id" json:"shipping_address_id"`
	ShippingRecipient  string           `gorm:"type:varchar(255);not null;column:shipping_recipient" json:"shipping_recipient"`
	ShippingPhone      string           `gorm:"type:varchar(20);not null;column:shipping_phone" json:"shipping_phone"`
	ShippingStreet     string           `gorm:"type:text;not null;column:shipping_street" json:"shipping_street"`
	ShippingDistrict   *string          `gorm:"type:varchar(100);column:shipping_district" json:"shipping_district"`
	ShippingCity       string           `gorm:"type:varchar(100);not null;column:shipping_city" json:"shipping_city"`
	ShippingProvince   string           `gorm:"type:varchar(100);not null;column:shipping_province" json:"shipping_province"`
	ShippingPostalCode string           `gorm:"type:varchar(10);not null;column:shipping_postal_code" json:"shipping_postal_code"`
	ShippingCountry    string           `gorm:"type:varchar(100);not null;default:'Indonesia';column:shipping_country" json:"shipping_country"`
	ShippingLatitude   *decimal.Decimal `gorm:"type:decimal(10,8);column:shipping_latitude" json:"shipping_latitude"`
	ShippingLongitude  *decimal.Decimal `gorm:"type:decimal(11,8);column:shipping_longitude" json:"shipping_longitude"`

	// ==========================================================================
	// USER SNAPSHOT (frozen at order time)
	// ==========================================================================
	CustomerEmail *string `gorm:"type:varchar(255);column:customer_email" json:"customer_email"`
	CustomerPhone string  `gorm:"type:varchar(20);not null;column:customer_phone" json:"customer_phone"`
	CustomerName  string  `gorm:"type:varchar(255);not null;column:customer_name" json:"customer_name"`

	// Shipping details
	ShippingMethod    *string    `gorm:"type:varchar(100);column:shipping_method" json:"shipping_method"`
	ShippingCourier   *string    `gorm:"type:varchar(50);column:shipping_courier" json:"shipping_courier"`
	EstimatedDelivery *time.Time `gorm:"column:estimated_delivery" json:"estimated_delivery"`

	// Status
	Status OrderStatus `gorm:"type:varchar(20);not null;default:'pending';index" json:"status"`

	// Notes
	CustomerNotes *string `gorm:"type:text;column:customer_notes" json:"customer_notes"`
	InternalNotes *string `gorm:"type:text;column:internal_notes" json:"internal_notes"`

	// Timestamps
	PaidAt      *time.Time `gorm:"column:paid_at" json:"paid_at"`
	ConfirmedAt *time.Time `gorm:"column:confirmed_at" json:"confirmed_at"`
	ProcessedAt *time.Time `gorm:"column:processed_at" json:"processed_at"`
	ShippedAt   *time.Time `gorm:"column:shipped_at" json:"shipped_at"`
	DeliveredAt *time.Time `gorm:"column:delivered_at" json:"delivered_at"`
	CompletedAt *time.Time `gorm:"column:completed_at" json:"completed_at"`
	CancelledAt *time.Time `gorm:"column:cancelled_at" json:"cancelled_at"`
	CancelReason      *string `gorm:"type:varchar(500);column:cancel_reason" json:"cancel_reason"`
	CancelledBy       *string `gorm:"type:varchar(50);column:cancelled_by" json:"cancelled_by"`

	// Live commerce attribution
	LiveSessionID *string `gorm:"type:uuid;column:live_session_id" json:"live_session_id"`

	// Idempotency
	IdempotencyKey *string `gorm:"type:varchar(100);uniqueIndex;column:idempotency_key" json:"idempotency_key"`

	// Audit
	CreatedBy *string   `gorm:"type:uuid;column:created_by" json:"created_by"`
	UpdatedBy *string   `gorm:"type:uuid;column:updated_by" json:"updated_by"`
	CreatedAt time.Time `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt time.Time `gorm:"not null;column:updated_at" json:"updated_at"`
	DeletedAt *time.Time `gorm:"index;column:deleted_at" json:"deleted_at"`

	// Relations
	Items []OrderItem `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"items"`
}

func (Order) TableName() string {
	return "order"
}

type OrderItem struct {
	ID      string        `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	OrderID string        `gorm:"type:uuid;not null;index;column:order_id" json:"order_id"`
	ItemType OrderItemType `gorm:"type:varchar(20);not null;default:'brand_product';column:item_type" json:"item_type"`

	// Product references (from Product Service)
	ProductID *string `gorm:"type:uuid;index;column:product_id" json:"product_id"`
	VariantID *string `gorm:"type:uuid;column:variant_id" json:"variant_id"`

	// Brand reference (from Brand Service)
	BrandID        *string `gorm:"type:uuid;column:brand_id" json:"brand_id"`
	BrandProductID *string `gorm:"type:uuid;column:brand_product_id" json:"brand_product_id"`

	// Seller reference (from Seller Service)
	SellerProductID *string `gorm:"type:uuid;column:seller_product_id" json:"seller_product_id"`
	SellerID        *string `gorm:"type:uuid;column:seller_id" json:"seller_id"`

	// ==========================================================================
	// PRODUCT SNAPSHOT (frozen at order time - NEVER changes)
	// ==========================================================================
	SnapshotProductName string  `gorm:"type:varchar(255);not null;column:snapshot_product_name" json:"snapshot_product_name"`
	SnapshotVariantName *string `gorm:"type:varchar(255);column:snapshot_variant_name" json:"snapshot_variant_name"`
	SnapshotSKU         *string `gorm:"type:varchar(100);column:snapshot_sku" json:"snapshot_sku"`
	SnapshotImageURL    *string `gorm:"type:text;column:snapshot_image_url" json:"snapshot_image_url"`
	SnapshotBrandName   *string `gorm:"type:varchar(255);column:snapshot_brand_name" json:"snapshot_brand_name"`
	SnapshotSellerName  *string `gorm:"type:varchar(255);column:snapshot_seller_name" json:"snapshot_seller_name"`

	// Pricing
	UnitPrice      decimal.Decimal `gorm:"type:decimal(15,2);not null;column:unit_price" json:"unit_price"`
	Quantity       int             `gorm:"not null" json:"quantity"`
	Subtotal       decimal.Decimal `gorm:"type:decimal(15,2);not null" json:"subtotal"`
	DiscountAmount decimal.Decimal `gorm:"type:decimal(15,2);not null;default:0;column:discount_amount" json:"discount_amount"`
	TotalAmount    decimal.Decimal `gorm:"type:decimal(15,2);not null;column:total_amount" json:"total_amount"`

	// Fulfillment
	FulfilledQuantity int `gorm:"not null;default:0;column:fulfilled_quantity" json:"fulfilled_quantity"`
	ReturnedQuantity  int `gorm:"not null;default:0;column:returned_quantity" json:"returned_quantity"`

	// Timestamps
	CreatedAt time.Time `gorm:"not null;column:created_at" json:"created_at"`

	Order Order `gorm:"foreignKey:OrderID;constraint:OnDelete:CASCADE" json:"-"`
}

func (OrderItem) TableName() string {
	return "order_item"
}
