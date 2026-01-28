package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type Seller struct {
	ID     string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	UserID string `gorm:"type:uuid;unique;not null" json:"user_id"`

	SellerCode string `gorm:"type:varchar(50);unique;not null" json:"seller_code"`

	ShopName         string  `gorm:"type:varchar(255);not null" json:"shop_name"`
	ShopSlug         string  `gorm:"type:varchar(255);unique;not null" json:"shop_slug"`
	ShopDescription  *string `gorm:"type:text" json:"shop_description"`
	ShopLogoURL      *string `gorm:"type:text" json:"shop_logo_url"`
	ShopBannerURL    *string `gorm:"type:text" json:"shop_banner_url"`
	ShopAnnouncement *string `gorm:"type:varchar(500)" json:"shop_announcement"`

	BusinessName    *string `gorm:"type:varchar(255)" json:"business_name"`
	BusinessType    string  `gorm:"type:business_type;not null;default:'individual'" json:"business_type"`
	BusinessLicense *string `gorm:"type:varchar(100)" json:"business_license"`
	TaxID           *string `gorm:"type:varchar(100)" json:"tax_id"`

	ContactName     string  `gorm:"type:varchar(255);not null" json:"contact_name"`
	ContactEmail    string  `gorm:"type:varchar(255);not null" json:"contact_email"`
	ContactPhone    string  `gorm:"type:varchar(20);not null" json:"contact_phone"`
	ContactWhatsapp *string `gorm:"type:varchar(20)" json:"contact_whatsapp"`

	Address    *string `gorm:"type:text" json:"address"`
	District   *string `gorm:"type:varchar(100)" json:"district"`
	City       *string `gorm:"type:varchar(100)" json:"city"`
	Province   *string `gorm:"type:varchar(100)" json:"province"`
	PostalCode *string `gorm:"type:varchar(10)" json:"postal_code"`

	BankName          *string `gorm:"type:varchar(100)" json:"bank_name"`
	BankAccountName   *string `gorm:"type:varchar(255)" json:"bank_account_name"`
	BankAccountNumber *string `gorm:"type:varchar(50)" json:"bank_account_number"`
	BankBranch        *string `gorm:"type:varchar(100)" json:"bank_branch"`

	CommissionRate float64 `gorm:"type:numeric(5,2);not null;default:0.00" json:"commission_rate"`

	TotalProducts int     `gorm:"not null;default:0" json:"total_products"`
	TotalOrders   int     `gorm:"not null;default:0" json:"total_orders"`
	TotalRevenue  float64 `gorm:"type:numeric(15,2);not null;default:0" json:"total_revenue"`

	AvgRating   *float64 `gorm:"type:numeric(3,2)" json:"avg_rating"`
	ReviewCount int      `gorm:"not null;default:0" json:"review_count"`

	ResponseRate *float64 `gorm:"type:numeric(5,2)" json:"response_rate"`
	ResponseTime *int     `gorm:"type:integer" json:"response_time"`

	Badges pq.StringArray `gorm:"type:text[]" json:"badges"`

	IsFeatured bool `gorm:"not null;default:false" json:"is_featured"`

	VerificationStatus string     `gorm:"type:verification_status;not null;default:'pending'" json:"verification_status"`
	VerifiedAt         *time.Time `gorm:"type:timestamptz" json:"verified_at"`
	VerifiedBy         *string    `gorm:"type:uuid" json:"verified_by"`

	Status        string     `gorm:"type:seller_status;not null;default:'pending'" json:"status"`
	SuspendedAt   *time.Time `gorm:"type:timestamptz" json:"suspended_at"`
	SuspendReason *string    `gorm:"type:varchar(500)" json:"suspend_reason"`

	AutoAcceptOrders bool       `gorm:"not null;default:true" json:"auto_accept_orders"`
	VacationMode     bool       `gorm:"not null;default:false" json:"vacation_mode"`
	VacationMessage  *string    `gorm:"type:varchar(500)" json:"vacation_message"`
	VacationUntil    *time.Time `gorm:"type:timestamptz" json:"vacation_until"`

	CreatedAt time.Time      `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt time.Time      `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (Seller) TableName() string {
	return "seller"
}

type SellerDocument struct {
	ID string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`

	SellerID string `gorm:"type:uuid;not null;index" json:"seller_id"`

	DocumentType   string  `gorm:"type:seller_doc_type;not null" json:"document_type"`
	DocumentNumber *string `gorm:"type:varchar(100)" json:"document_number"`

	FileURL  string `gorm:"type:text;not null" json:"file_url"`
	FileName string `gorm:"type:varchar(255);not null" json:"file_name"`
	FileSize *int   `gorm:"type:integer" json:"file_size"`

	Status string `gorm:"type:doc_status;not null;default:'pending'" json:"status"`

	VerifiedAt *time.Time `gorm:"type:timestamptz" json:"verified_at"`
	VerifiedBy *string    `gorm:"type:uuid" json:"verified_by"`

	RejectedAt      *time.Time `gorm:"type:timestamptz" json:"rejected_at"`
	RejectionReason *string    `gorm:"type:varchar(500)" json:"rejection_reason"`

	ExpiresAt *time.Time `gorm:"type:timestamptz" json:"expires_at"`

	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (SellerDocument) TableName() string {
	return "seller_document"
}

type SellerProduct struct {
	ID string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`

	SellerID           string  `gorm:"type:uuid;not null;index" json:"seller_id"`
	WarehouseProductID *string `gorm:"type:uuid" json:"warehouse_product_id"`
	SKU                *string `gorm:"type:varchar(100)" json:"sku"`

	Name             string  `gorm:"type:varchar(255);not null" json:"name"`
	Slug             string  `gorm:"type:varchar(255);unique;not null" json:"slug"`
	Description      *string `gorm:"type:text" json:"description"`
	ShortDescription *string `gorm:"type:varchar(500)" json:"short_description"`

	CategoryID   *string `gorm:"type:uuid;index" json:"category_id"`
	CategoryName *string `gorm:"type:varchar(255)" json:"category_name"`

	Price        float64  `gorm:"type:numeric(15,2);not null" json:"price"`
	ComparePrice *float64 `gorm:"type:numeric(15,2)" json:"compare_price"`
	CostPrice    *float64 `gorm:"type:numeric(15,2)" json:"cost_price"`

	TrackInventory    bool `gorm:"not null;default:true" json:"track_inventory"`
	Quantity          int  `gorm:"not null;default:0" json:"quantity"`
	LowStockThreshold *int `gorm:"default:5" json:"low_stock_threshold"`

	WeightGrams *int     `gorm:"type:integer" json:"weight_grams"`
	LengthCm    *float64 `gorm:"type:numeric(10,2)" json:"length_cm"`
	WidthCm     *float64 `gorm:"type:numeric(10,2)" json:"width_cm"`
	HeightCm    *float64 `gorm:"type:numeric(10,2)" json:"height_cm"`

	Images          datatypes.JSON `gorm:"type:jsonb" json:"images"`
	PrimaryImageURL *string        `gorm:"type:text" json:"primary_image_url"`

	HasVariants bool `gorm:"not null;default:false" json:"has_variants"`

	Status      string     `gorm:"type:product_status;not null;default:'draft'" json:"status"`
	PublishedAt *time.Time `gorm:"type:timestamptz" json:"published_at"`

	MetaTitle       *string `gorm:"type:varchar(255)" json:"meta_title"`
	MetaDescription *string `gorm:"type:text" json:"meta_description"`
	Tags            pq.StringArray `gorm:"type:text[]" json:"tags"`

	ViewCount   int      `gorm:"not null;default:0" json:"view_count"`
	SoldCount   int      `gorm:"not null;default:0" json:"sold_count"`
	AvgRating   *float64 `gorm:"type:numeric(3,2)" json:"avg_rating"`
	ReviewCount int      `gorm:"not null;default:0" json:"review_count"`

	CreatedAt time.Time      `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt time.Time      `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`
}

func (SellerProduct) TableName() string {
	return "seller_product"
}

// --------------------
// Seller Product Variants
// --------------------

type SellerProductVariant struct {
	ID          string  `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	ProductID   string  `gorm:"type:uuid;not null;index" json:"product_id"`
	SKU         *string `gorm:"type:varchar(100)" json:"sku"`
	Name        string  `gorm:"type:varchar(255);not null" json:"name"`
	// Options (supports up to 3 option pairs)
	Option1Name  *string `gorm:"type:varchar(50)" json:"option1_name,omitempty"`
	Option1Value *string `gorm:"type:varchar(100)" json:"option1_value,omitempty"`
	Option2Name  *string `gorm:"type:varchar(50)" json:"option2_name,omitempty"`
	Option2Value *string `gorm:"type:varchar(100)" json:"option2_value,omitempty"`
	Option3Name  *string `gorm:"type:varchar(50)" json:"option3_name,omitempty"`
	Option3Value *string `gorm:"type:varchar(100)" json:"option3_value,omitempty"`
	// Pricing
	Price        float64  `gorm:"type:numeric(15,2);not null" json:"price"`
	ComparePrice *float64 `gorm:"type:numeric(15,2)" json:"compare_price,omitempty"`
	CostPrice    *float64 `gorm:"type:numeric(15,2)" json:"cost_price,omitempty"`
	// Inventory
	Quantity int `gorm:"not null;default:0" json:"quantity"`
	// Shipping
	WeightGrams *int `gorm:"type:integer" json:"weight_grams,omitempty"`
	// Image
	ImageURL *string `gorm:"type:text" json:"image_url,omitempty"`
	// Status
	IsActive  bool `gorm:"not null;default:true" json:"is_active"`
	SortOrder int  `gorm:"not null;default:0" json:"sort_order"`
	// Audit
	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (SellerProductVariant) TableName() string {
	return "seller_product_variant"
}

// --------------------
// Seller Payouts
// --------------------

type SellerPayout struct {
	ID       string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	SellerID string `gorm:"type:uuid;not null;index" json:"seller_id"`

	PayoutNumber string `gorm:"type:varchar(50);unique;not null;index" json:"payout_number"`

	PeriodStart time.Time `gorm:"type:date;not null" json:"period_start"`
	PeriodEnd   time.Time `gorm:"type:date;not null" json:"period_end"`

	GrossAmount     float64 `gorm:"type:numeric(15,2);not null" json:"gross_amount"`
	CommissionAmount float64 `gorm:"type:numeric(15,2);not null;default:0" json:"commission_amount"`
	AdjustmentAmount float64 `gorm:"type:numeric(15,2);not null;default:0" json:"adjustment_amount"`
	NetAmount       float64 `gorm:"type:numeric(15,2);not null" json:"net_amount"`

	OrderCount int `gorm:"not null" json:"order_count"`
	ItemCount  int `gorm:"not null" json:"item_count"`

	BankName          string `gorm:"type:varchar(100);not null" json:"bank_name"`
	BankAccountName   string `gorm:"type:varchar(255);not null" json:"bank_account_name"`
	BankAccountNumber string `gorm:"type:varchar(50);not null" json:"bank_account_number"`

	Status string `gorm:"type:payout_status;not null;default:'pending';index" json:"status"`

	ApprovedAt  *time.Time `gorm:"type:timestamptz" json:"approved_at"`
	ApprovedBy  *string    `gorm:"type:uuid" json:"approved_by"`
	ProcessedAt *time.Time `gorm:"type:timestamptz" json:"processed_at"`
	PaidAt      *time.Time `gorm:"type:timestamptz" json:"paid_at"`

	RejectedAt      *time.Time `gorm:"type:timestamptz" json:"rejected_at"`
	RejectionReason *string    `gorm:"type:varchar(500)" json:"rejection_reason"`

	TransferReference *string `gorm:"type:varchar(255)" json:"transfer_reference"`
	TransferProofURL  *string `gorm:"type:text" json:"transfer_proof_url"`

	Notes         *string `gorm:"type:text" json:"notes"`
	InternalNotes  *string `gorm:"type:text" json:"internal_notes"`

	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (SellerPayout) TableName() string {
	return "seller_payout"
}

type SellerPayoutItem struct {
	ID        string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	PayoutID  string `gorm:"type:uuid;not null;index" json:"payout_id"`

	OrderID     string    `gorm:"type:uuid;not null;index" json:"order_id"`
	OrderNumber string    `gorm:"type:varchar(50);not null" json:"order_number"`
	OrderDate   time.Time `gorm:"type:timestamptz;not null" json:"order_date"`

	GrossAmount float64 `gorm:"type:numeric(15,2);not null" json:"gross_amount"`
	Commission  float64 `gorm:"type:numeric(15,2);not null;default:0" json:"commission"`
	NetAmount   float64 `gorm:"type:numeric(15,2);not null" json:"net_amount"`

	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
}

func (SellerPayoutItem) TableName() string {
	return "seller_payout_item"
}

type SellerPayoutSchedule struct {
	ID       string `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	SellerID string `gorm:"type:uuid;not null;unique" json:"seller_id"`

	Frequency string `gorm:"type:payout_frequency;not null;default:'weekly'" json:"frequency"`

	DayOfWeek  *int `gorm:"type:integer" json:"day_of_week"`  // 0-6 for weekly
	DayOfMonth *int `gorm:"type:integer" json:"day_of_month"` // 1-31 for monthly

	MinPayoutAmount float64 `gorm:"type:numeric(15,2);not null;default:50000" json:"min_payout_amount"`

	IsActive bool `gorm:"not null;default:true" json:"is_active"`

	NextPayoutDate *time.Time `gorm:"type:date" json:"next_payout_date"`
	LastPayoutDate *time.Time `gorm:"type:date" json:"last_payout_date"`

	CreatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"created_at"`
	UpdatedAt time.Time `gorm:"type:timestamptz;not null;default:now()" json:"updated_at"`
}

func (SellerPayoutSchedule) TableName() string {
	return "seller_payout_schedule"
}
