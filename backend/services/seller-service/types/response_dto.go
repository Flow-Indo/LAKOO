package types

import "time"

type SellerProfileResponseDTO struct {
	ID     string `json:"id"`
	UserID string `json:"user_id"`

	SellerCode string `json:"seller_code"`

	ShopName         string  `json:"shop_name"`
	ShopSlug         string  `json:"shop_slug"`
	ShopDescription  *string `json:"shop_description"`
	ShopLogoURL      *string `json:"shop_logo_url"`
	ShopBannerURL    *string `json:"shop_banner_url"`
	ShopAnnouncement *string `json:"shop_announcement"`

	BusinessName    *string `json:"business_name"`
	BusinessType    string  `json:"business_type"`
	BusinessLicense *string `json:"business_license"`
	TaxID           *string `json:"tax_id"`

	ContactName     string  `json:"contact_name"`
	ContactEmail    string  `json:"contact_email"`
	ContactPhone    string  `json:"contact_phone"`
	ContactWhatsapp *string `json:"contact_whatsapp"`

	Address    *string `json:"address"`
	District   *string `json:"district"`
	City       *string `json:"city"`
	Province   *string `json:"province"`
	PostalCode *string `json:"postal_code"`

	Status             string `json:"status"`
	VerificationStatus string `json:"verification_status"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type VerificationStatusResponseDTO struct {
	SellerID           string     `json:"seller_id"`
	VerificationStatus string     `json:"verification_status"`
	VerifiedAt         *time.Time `json:"verified_at"`
	VerifiedBy         *string    `json:"verified_by"`
}

type SellerBankResponseDTO struct {
	SellerID          string    `json:"seller_id"`
	SellerCode        string    `json:"seller_code"`
	BankName          *string   `json:"bank_name"`
	BankAccountName   *string   `json:"bank_account_name"`
	BankAccountNumber *string   `json:"bank_account_number"`
	BankBranch        *string   `json:"bank_branch"`
	UpdatedAt         time.Time `json:"updated_at"`
}

type SellerStatsOverviewResponseDTO struct {
	SellerID      string   `json:"seller_id"`
	TotalProducts int      `json:"total_products"`
	TotalOrders   int      `json:"total_orders"`
	TotalRevenue  float64  `json:"total_revenue"`
	AvgRating     *float64 `json:"avg_rating"`
	ReviewCount   int      `json:"review_count"`
	ResponseRate  *float64 `json:"response_rate"`
	ResponseTime  *int     `json:"response_time"`
	IsFeatured    bool     `json:"is_featured"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type SellerDocumentResponseDTO struct {
	ID             string     `json:"id"`
	SellerID        string     `json:"seller_id"`
	DocumentType    string     `json:"document_type"`
	DocumentNumber  *string    `json:"document_number,omitempty"`
	FileURL         string     `json:"file_url"`
	FileName        string     `json:"file_name"`
	FileSize        *int       `json:"file_size,omitempty"`
	Status          string     `json:"status"`
	VerifiedAt      *time.Time `json:"verified_at"`
	VerifiedBy      *string    `json:"verified_by"`
	RejectedAt      *time.Time `json:"rejected_at"`
	RejectionReason *string    `json:"rejection_reason"`
	ExpiresAt       *time.Time `json:"expires_at"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       time.Time  `json:"updated_at"`
}

// --------------------
// Seller Products (MVP)
// --------------------

type SellerProductResponseDTO struct {
	ID               string      `json:"id"`
	SellerID         string      `json:"seller_id"`
	SKU              *string     `json:"sku,omitempty"`
	Name             string      `json:"name"`
	Slug             string      `json:"slug"`
	Description      *string     `json:"description,omitempty"`
	ShortDescription *string     `json:"short_description,omitempty"`
	CategoryID       *string     `json:"category_id,omitempty"`
	CategoryName     *string     `json:"category_name,omitempty"`
	Price            float64     `json:"price"`
	ComparePrice     *float64    `json:"compare_price,omitempty"`
	CostPrice        *float64    `json:"cost_price,omitempty"`
	TrackInventory   bool        `json:"track_inventory"`
	Quantity         int         `json:"quantity"`
	Images           interface{} `json:"images"`
	PrimaryImageURL  *string     `json:"primary_image_url,omitempty"`
	HasVariants      bool        `json:"has_variants"`
	Status           string      `json:"status"`
	PublishedAt      *time.Time  `json:"published_at"`
	Tags             []string    `json:"tags"`

	// Shipping
	WeightGrams     *int     `json:"weight_grams,omitempty"`
	LengthCm        *float64 `json:"length_cm,omitempty"`
	WidthCm         *float64 `json:"width_cm,omitempty"`
	HeightCm        *float64 `json:"height_cm,omitempty"`

	// Performance
	ViewCount   int `json:"view_count"`
	SoldCount   int `json:"sold_count"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ListSellerProductsResponseDTO struct {
	Products []SellerProductResponseDTO `json:"products"`
	Total    int64                      `json:"total"`
	Page     int                        `json:"page"`
	Limit    int                        `json:"limit"`
}

// --------------------
// Seller Analytics (MVP)
// --------------------

type TopProductDTO struct {
	ID              string  `json:"id"`
	Name            string  `json:"name"`
	PrimaryImageURL *string `json:"primary_image_url,omitempty"`
	SoldCount       int     `json:"sold_count"`
}

type SellerAnalyticsOverviewResponseDTO struct {
	SellerID       string         `json:"seller_id"`
	TotalOrders    int            `json:"total_orders"`
	TotalRevenue   float64        `json:"total_revenue"`
	TotalProducts  int            `json:"total_products"`
	TopProducts    []TopProductDTO `json:"top_products"`
}

type TopSellingProductsResponseDTO struct {
	Products []TopProductDTO `json:"products"`
}

// --------------------
// Seller Product Variants
// --------------------

type ProductVariantResponseDTO struct {
	ID           string     `json:"id"`
	ProductID    string     `json:"product_id"`
	SKU          *string    `json:"sku,omitempty"`
	Name         string     `json:"name"`
	Option1Name  *string    `json:"option1_name,omitempty"`
	Option1Value *string    `json:"option1_value,omitempty"`
	Option2Name  *string    `json:"option2_name,omitempty"`
	Option2Value *string    `json:"option2_value,omitempty"`
	Option3Name  *string    `json:"option3_name,omitempty"`
	Option3Value *string    `json:"option3_value,omitempty"`
	Price        float64    `json:"price"`
	ComparePrice *float64   `json:"compare_price,omitempty"`
	CostPrice    *float64   `json:"cost_price,omitempty"`
	Quantity     int        `json:"quantity"`
	WeightGrams  *int       `json:"weight_grams,omitempty"`
	ImageURL     *string    `json:"image_url,omitempty"`
	IsActive     bool       `json:"is_active"`
	SortOrder    int        `json:"sort_order"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

type ListProductVariantsResponseDTO struct {
	Variants []ProductVariantResponseDTO `json:"variants"`
}

// --------------------
// Seller Orders (via order-service)
// --------------------

type OrderListItemResponseDTO struct {
	ID           string    `json:"id"`
	OrderNumber  string    `json:"order_number"`
	Status       string    `json:"status"`
	CreatedAt    time.Time `json:"created_at"`
	BuyerName    string    `json:"buyer_name"`
	TotalAmount  float64   `json:"total_amount"`
	ShippingCity string    `json:"shipping_city"`
}

type ListSellerOrdersResponseDTO struct {
	Orders []OrderListItemResponseDTO `json:"orders"`
	Page   int                        `json:"page"`
	Limit  int                        `json:"limit"`
	Total  int64                      `json:"total"`
}

type OrderItemDetailDTO struct {
	ID        string  `json:"id"`
	ProductID string  `json:"product_id"`
	Name      string  `json:"name"`
	Variant   string  `json:"variant,omitempty"`
	Quantity  int     `json:"quantity"`
	UnitPrice float64 `json:"unit_price"`
	Subtotal  float64 `json:"subtotal"`
	ImageURL  string  `json:"image_url,omitempty"`
}

type OrderDetailResponseDTO struct {
	ID                 string             `json:"id"`
	OrderNumber        string             `json:"order_number"`
	Status             string             `json:"status"`
	CreatedAt          time.Time          `json:"created_at"`
	BuyerName          string             `json:"buyer_name"`
	BuyerPhone         string             `json:"buyer_phone"`
	ShippingAddress    string             `json:"shipping_address"`
	ShippingCity       string             `json:"shipping_city"`
	ShippingPostalCode string             `json:"shipping_postal_code"`
	Subtotal           float64            `json:"subtotal"`
	ShippingCost       float64            `json:"shipping_cost"`
	TaxAmount          float64            `json:"tax_amount"`
	DiscountAmount     float64            `json:"discount_amount"`
	TotalAmount        float64            `json:"total_amount"`
	TrackingNumber     string             `json:"tracking_number,omitempty"`
	EstimatedDelivery  string             `json:"estimated_delivery_date,omitempty"`
	Items              []OrderItemDetailDTO `json:"items"`
}

// --------------------
// Seller Finance & Payouts
// --------------------

type SellerBalanceResponseDTO struct {
	TotalRevenue   float64 `json:"total_revenue"`
	TotalPaidOut   float64 `json:"total_paid_out"`
	PendingPayouts float64 `json:"pending_payouts"`
	AvailableBalance float64 `json:"available_balance"`
}

type SellerPayoutItemResponseDTO struct {
	ID          string    `json:"id"`
	PayoutID    string    `json:"payout_id"`
	OrderID     string    `json:"order_id"`
	OrderNumber string    `json:"order_number"`
	OrderDate   time.Time `json:"order_date"`
	GrossAmount float64   `json:"gross_amount"`
	Commission  float64   `json:"commission"`
	NetAmount   float64   `json:"net_amount"`
}

type SellerPayoutResponseDTO struct {
	ID       string    `json:"id"`
	SellerID string    `json:"seller_id"`
	PayoutNumber string `json:"payout_number"`

	PeriodStart time.Time `json:"period_start"`
	PeriodEnd   time.Time `json:"period_end"`

	GrossAmount     float64 `json:"gross_amount"`
	CommissionAmount float64 `json:"commission_amount"`
	AdjustmentAmount float64 `json:"adjustment_amount"`
	NetAmount       float64 `json:"net_amount"`

	OrderCount int `json:"order_count"`
	ItemCount  int `json:"item_count"`

	BankName          string  `json:"bank_name"`
	BankAccountName   string  `json:"bank_account_name"`
	BankAccountNumber string  `json:"bank_account_number"`

	Status string `json:"status"`

	ApprovedAt  *time.Time `json:"approved_at,omitempty"`
	ProcessedAt *time.Time `json:"processed_at,omitempty"`
	PaidAt      *time.Time `json:"paid_at,omitempty"`

	RejectedAt      *time.Time `json:"rejected_at,omitempty"`
	RejectionReason *string    `json:"rejection_reason,omitempty"`

	TransferReference *string `json:"transfer_reference,omitempty"`
	TransferProofURL  *string `json:"transfer_proof_url,omitempty"`

	Notes *string `json:"notes,omitempty"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Items []SellerPayoutItemResponseDTO `json:"items,omitempty"`
}

type ListSellerPayoutsResponseDTO struct {
	Payouts []SellerPayoutResponseDTO `json:"payouts"`
	Total   int64                      `json:"total"`
	Page    int                        `json:"page"`
	Limit   int                        `json:"limit"`
}

type PayoutScheduleResponseDTO struct {
	ID              string     `json:"id"`
	SellerID        string     `json:"seller_id"`
	Frequency       string     `json:"frequency"`
	DayOfWeek       *int       `json:"day_of_week,omitempty"`
	DayOfMonth      *int       `json:"day_of_month,omitempty"`
	MinPayoutAmount float64    `json:"min_payout_amount"`
	IsActive        bool       `json:"is_active"`
	NextPayoutDate  *time.Time `json:"next_payout_date,omitempty"`
	LastPayoutDate  *time.Time `json:"last_payout_date,omitempty"`
}
