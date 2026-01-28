package types

import (
	"time"

	"gorm.io/datatypes"
)

type UpdateShopInfoPayload struct {
	ShopName         *string `json:"shop_name"`
	ShopSlug         *string `json:"shop_slug"`
	ShopDescription  *string `json:"shop_description"`
	ShopLogoURL      *string `json:"shop_logo_url"`
	ShopBannerURL    *string `json:"shop_banner_url"`
	ShopAnnouncement *string `json:"shop_announcement"`
}

type UpdateBankAccountPayload struct {
	BankName          *string `json:"bank_name"`
	BankAccountName   *string `json:"bank_account_name"`
	BankAccountNumber *string `json:"bank_account_number"`
	BankBranch        *string `json:"bank_branch"`
}

type UpdateBusinessInfoPayload struct {
	BusinessName    *string `json:"business_name"`
	BusinessType    *string `json:"business_type"`
	BusinessLicense *string `json:"business_license"`
	TaxID           *string `json:"tax_id"`

	ContactName     *string `json:"contact_name"`
	ContactEmail    *string `json:"contact_email"`
	ContactPhone    *string `json:"contact_phone"`
	ContactWhatsapp *string `json:"contact_whatsapp"`

	Address    *string `json:"address"`
	District   *string `json:"district"`
	City       *string `json:"city"`
	Province   *string `json:"province"`
	PostalCode *string `json:"postal_code"`
}

type UploadSellerDocumentPayload struct {
	DocumentType   string     `json:"document_type"`
	DocumentNumber *string    `json:"document_number,omitempty"`
	FileURL        string     `json:"file_url"`
	FileName       string     `json:"file_name"`
	FileSize       *int       `json:"file_size,omitempty"`
	ExpiresAt      *time.Time `json:"expires_at,omitempty"`
}

// --------------------
// Seller Products (MVP)
// --------------------

type CreateSellerProductPayload struct {
	Name             string         `json:"name"`
	Slug             *string        `json:"slug,omitempty"`
	SKU              *string        `json:"sku,omitempty"`
	Description      *string        `json:"description,omitempty"`
	ShortDescription *string        `json:"short_description,omitempty"`
	CategoryID       *string        `json:"category_id,omitempty"`
	CategoryName     *string        `json:"category_name,omitempty"`
	Price            float64        `json:"price"`
	ComparePrice     *float64       `json:"compare_price,omitempty"`
	CostPrice        *float64       `json:"cost_price,omitempty"`
	TrackInventory   *bool          `json:"track_inventory,omitempty"`
	Quantity         *int           `json:"quantity,omitempty"`
	WeightGrams      *int           `json:"weight_grams,omitempty"`
	LengthCm         *float64       `json:"length_cm,omitempty"`
	WidthCm          *float64       `json:"width_cm,omitempty"`
	HeightCm         *float64       `json:"height_cm,omitempty"`
	Images           datatypes.JSON `json:"images,omitempty" swaggertype:"object"` // expects JSON array/object
	PrimaryImageURL  *string        `json:"primary_image_url,omitempty"`
	Tags             []string       `json:"tags,omitempty"`
}

type UpdateSellerProductPayload struct {
	Name             *string        `json:"name,omitempty"`
	Slug             *string        `json:"slug,omitempty"`
	SKU              *string        `json:"sku,omitempty"`
	Description      *string        `json:"description,omitempty"`
	ShortDescription *string        `json:"short_description,omitempty"`
	CategoryID       *string        `json:"category_id,omitempty"`
	CategoryName     *string        `json:"category_name,omitempty"`
	Price            *float64       `json:"price,omitempty"`
	ComparePrice     *float64       `json:"compare_price,omitempty"`
	CostPrice        *float64       `json:"cost_price,omitempty"`
	TrackInventory   *bool          `json:"track_inventory,omitempty"`
	Quantity         *int           `json:"quantity,omitempty"`
	WeightGrams      *int           `json:"weight_grams,omitempty"`
	LengthCm         *float64       `json:"length_cm,omitempty"`
	WidthCm          *float64       `json:"width_cm,omitempty"`
	HeightCm         *float64       `json:"height_cm,omitempty"`
	Images           *datatypes.JSON `json:"images,omitempty" swaggertype:"object"`
	PrimaryImageURL  *string        `json:"primary_image_url,omitempty"`
	Tags             *[]string      `json:"tags,omitempty"`
	Status           *string        `json:"status,omitempty"` // draft/active/inactive...
}

// --------------------
// Seller Product Variants
// --------------------

type CreateProductVariantPayload struct {
	Name         string   `json:"name"`
	SKU          *string  `json:"sku,omitempty"`
	Option1Name  *string  `json:"option1_name,omitempty"`
	Option1Value *string  `json:"option1_value,omitempty"`
	Option2Name  *string  `json:"option2_name,omitempty"`
	Option2Value *string  `json:"option2_value,omitempty"`
	Option3Name  *string  `json:"option3_name,omitempty"`
	Option3Value *string  `json:"option3_value,omitempty"`
	Price        float64  `json:"price"`
	ComparePrice *float64 `json:"compare_price,omitempty"`
	CostPrice    *float64 `json:"cost_price,omitempty"`
	Quantity     *int     `json:"quantity,omitempty"`
	WeightGrams  *int     `json:"weight_grams,omitempty"`
	ImageURL     *string  `json:"image_url,omitempty"`
	IsActive     *bool    `json:"is_active,omitempty"`
	SortOrder    *int     `json:"sort_order,omitempty"`
}

type UpdateProductVariantPayload struct {
	Name         *string  `json:"name,omitempty"`
	SKU          *string  `json:"sku,omitempty"`
	Option1Name  *string  `json:"option1_name,omitempty"`
	Option1Value *string  `json:"option1_value,omitempty"`
	Option2Name  *string  `json:"option2_name,omitempty"`
	Option2Value *string  `json:"option2_value,omitempty"`
	Option3Name  *string  `json:"option3_name,omitempty"`
	Option3Value *string  `json:"option3_value,omitempty"`
	Price        *float64 `json:"price,omitempty"`
	ComparePrice *float64 `json:"compare_price,omitempty"`
	CostPrice    *float64 `json:"cost_price,omitempty"`
	Quantity     *int     `json:"quantity,omitempty"`
	WeightGrams  *int     `json:"weight_grams,omitempty"`
	ImageURL     *string  `json:"image_url,omitempty"`
	IsActive     *bool    `json:"is_active,omitempty"`
	SortOrder    *int     `json:"sort_order,omitempty"`
}

// --------------------
// Seller Orders filters (query params)
// --------------------

type ListSellerOrdersParams struct {
	Status string `json:"status,omitempty"`
	From   string `json:"from,omitempty"`
	To     string `json:"to,omitempty"`
	Query  string `json:"q,omitempty"`
	Page   int    `json:"page,omitempty"`
	Limit  int    `json:"limit,omitempty"`
}

// --------------------
// Seller Finance & Payouts
// --------------------

type RequestWithdrawalPayload struct {
	Amount float64  `json:"amount"`
	Notes  *string  `json:"notes,omitempty"`
}

type UpdatePayoutSchedulePayload struct {
	Frequency       *string   `json:"frequency,omitempty"`
	DayOfWeek       *int      `json:"day_of_week,omitempty"`
	DayOfMonth      *int      `json:"day_of_month,omitempty"`
	MinPayoutAmount *float64  `json:"min_payout_amount,omitempty"`
	IsActive        *bool     `json:"is_active,omitempty"`
}
