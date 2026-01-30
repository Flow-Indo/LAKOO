package models

import (
	"time"

	"github.com/google/uuid"
)

type CartItem struct {
	ID       uuid.UUID    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	CartID   uuid.UUID    `gorm:"type:uuid;not null;index;column:cart_id" json:"cart_id"`
	ItemType CartItemType `gorm:"type:varchar(20);not null;default:'brand_product';column:item_type" json:"item_type"`

	// Product references (from Product Service)
	ProductID *uuid.UUID `gorm:"type:uuid;index;column:product_id" json:"product_id"`
	VariantID *uuid.UUID `gorm:"type:uuid;index;column:variant_id" json:"variant_id"`

	// Brand reference (from Brand Service)
	BrandID        *uuid.UUID `gorm:"type:uuid;index;column:brand_id" json:"brand_id"`
	BrandProductID *uuid.UUID `gorm:"type:uuid;column:brand_product_id" json:"brand_product_id"`

	// Seller reference (from Seller Service)
	SellerProductID *uuid.UUID `gorm:"type:uuid;column:seller_product_id" json:"seller_product_id"`
	SellerID        *uuid.UUID `gorm:"type:uuid;index;column:seller_id" json:"seller_id"`

	// Quantity
	Quantity int `gorm:"not null;default:1" json:"quantity"`

	// ==========================================================================
	// PRICE SNAPSHOT (captured at add-to-cart time)
	// ==========================================================================
	SnapshotProductName  string   `gorm:"type:varchar(255);not null;column:snapshot_product_name" json:"snapshot_product_name"`
	SnapshotVariantName  *string  `gorm:"type:varchar(255);column:snapshot_variant_name" json:"snapshot_variant_name"`
	SnapshotSKU          *string  `gorm:"type:varchar(100);column:snapshot_sku" json:"snapshot_sku"`
	SnapshotImageURL     *string  `gorm:"type:text;column:snapshot_image_url" json:"snapshot_image_url"`
	SnapshotUnitPrice    float64  `gorm:"type:decimal(15,2);not null;column:snapshot_unit_price" json:"snapshot_unit_price"`
	SnapshotComparePrice *float64 `gorm:"type:decimal(15,2);column:snapshot_compare_price" json:"snapshot_compare_price"`
	SnapshotBrandName    *string  `gorm:"type:varchar(255);column:snapshot_brand_name" json:"snapshot_brand_name"`
	SnapshotSellerName   *string  `gorm:"type:varchar(255);column:snapshot_seller_name" json:"snapshot_seller_name"`

	// ==========================================================================
	// Current price (refreshed periodically and at checkout)
	// ==========================================================================
	CurrentUnitPrice   float64   `gorm:"type:decimal(15,2);not null;column:current_unit_price" json:"current_unit_price"`
	PriceChanged       bool      `gorm:"not null;default:false;column:price_changed" json:"price_changed"`
	PriceLastCheckedAt time.Time `gorm:"not null;column:price_last_checked_at" json:"price_last_checked_at"`

	// Availability status
	IsAvailable         bool    `gorm:"not null;default:true;column:is_available" json:"is_available"`
	AvailabilityMessage *string `gorm:"type:varchar(255);column:availability_message" json:"availability_message"`

	// Timestamps
	AddedAt   time.Time `gorm:"not null;column:added_at" json:"added_at"`
	UpdatedAt time.Time `gorm:"not null;column:updated_at" json:"updated_at"`

	// Relations
	Cart Cart `gorm:"foreignKey:CartID;constraint:OnDelete:CASCADE" json:"-"`
}

func (CartItem) TableName() string {
	return "cart_item"
}

type Cart struct {
	ID        uuid.UUID  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID    *uuid.UUID `gorm:"type:uuid;uniqueIndex;column:user_id" json:"user_id"`
	SessionID *string    `gorm:"type:varchar(100);index;column:session_id" json:"session_id"`
	Status    CartStatus `gorm:"type:varchar(20);not null;default:'active';index" json:"status"`
	Currency  string     `gorm:"type:varchar(3);not null;default:'IDR'" json:"currency"`

	// Cached totals
	ItemCount int     `gorm:"not null;default:0;column:item_count" json:"item_count"`
	Subtotal  float64 `gorm:"type:decimal(15,2);not null;default:0" json:"subtotal"`

	// Discount tracking
	CouponCode     *string    `gorm:"type:varchar(50);column:coupon_code" json:"coupon_code"`
	CouponID       *uuid.UUID `gorm:"type:uuid;column:coupon_id" json:"coupon_id"`
	DiscountAmount float64    `gorm:"type:decimal(15,2);not null;default:0;column:discount_amount" json:"discount_amount"`

	// Expiration
	ExpiresAt      *time.Time `gorm:"index;column:expires_at" json:"expires_at"`
	LastActivityAt time.Time  `gorm:"not null;column:last_activity_at" json:"last_activity_at"`
	CreatedAt      time.Time  `gorm:"not null;column:created_at" json:"created_at"`
	UpdatedAt      time.Time  `gorm:"not null;column:updated_at" json:"updated_at"`

	Items []CartItem `gorm:"foreignKey:CartID;constraint:OnDelete:CASCADE" json:"items,omitempty"`
}

func (Cart) TableName() string {
	return "cart"
}

type CartStatus string

const (
	CartStatusActive    CartStatus = "active"
	CartStatusMerged    CartStatus = "merged"    // Guest cart merged with user cart
	CartStatusConverted CartStatus = "converted" // Converted to order
	CartStatusAbandoned CartStatus = "abandoned"
	CartStatusExpired   CartStatus = "expired"
)

type CartItemType string

const (
	BrandProduct  CartItemType = "brand_product"  // From LAKOO brands (warehouse)
	SellerProduct CartItemType = "seller_product" // From third-party sellers
)
