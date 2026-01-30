package repository

import (
	"encoding/json"
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/models"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/types"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type SellerRepository struct {
	db *gorm.DB
}

func NewSellerRepository(db *gorm.DB) *SellerRepository {
	return &SellerRepository{db: db}
}

func (r *SellerRepository) GetByID(id string) (models.Seller, error) {
	var seller models.Seller
	err := r.db.Model(&models.Seller{}).Where("id = ?", id).First(&seller).Error
	return seller, err
}

func (r *SellerRepository) UpdateShopInfo(id string, payload types.UpdateShopInfoPayload) (models.Seller, error) {
	updates := map[string]interface{}{}
	if payload.ShopName != nil {
		updates["shop_name"] = *payload.ShopName
	}
	if payload.ShopSlug != nil {
		updates["shop_slug"] = *payload.ShopSlug
	}
	if payload.ShopDescription != nil {
		updates["shop_description"] = *payload.ShopDescription
	}
	if payload.ShopLogoURL != nil {
		updates["shop_logo_url"] = *payload.ShopLogoURL
	}
	if payload.ShopBannerURL != nil {
		updates["shop_banner_url"] = *payload.ShopBannerURL
	}
	if payload.ShopAnnouncement != nil {
		updates["shop_announcement"] = *payload.ShopAnnouncement
	}

	if err := r.db.Model(&models.Seller{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return models.Seller{}, err
	}

	return r.GetByID(id)
}

func (r *SellerRepository) UpdateShopLogoURL(sellerID, logoURL string) error {
	return r.db.Model(&models.Seller{}).Where("id = ?", sellerID).Update("shop_logo_url", logoURL).Error
}

func (r *SellerRepository) UpdateBank(id string, payload types.UpdateBankAccountPayload) (models.Seller, error) {
	updates := map[string]interface{}{}
	if payload.BankName != nil {
		updates["bank_name"] = *payload.BankName
	}
	if payload.BankAccountName != nil {
		updates["bank_account_name"] = *payload.BankAccountName
	}
	if payload.BankAccountNumber != nil {
		updates["bank_account_number"] = *payload.BankAccountNumber
	}
	if payload.BankBranch != nil {
		updates["bank_branch"] = *payload.BankBranch
	}

	if err := r.db.Model(&models.Seller{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return models.Seller{}, err
	}

	return r.GetByID(id)
}

func (r *SellerRepository) UpdateBusinessInfo(id string, payload types.UpdateBusinessInfoPayload) (models.Seller, error) {
	updates := map[string]interface{}{}

	if payload.BusinessName != nil {
		updates["business_name"] = *payload.BusinessName
	}
	if payload.BusinessType != nil {
		updates["business_type"] = *payload.BusinessType
	}
	if payload.BusinessLicense != nil {
		updates["business_license"] = *payload.BusinessLicense
	}
	if payload.TaxID != nil {
		updates["tax_id"] = *payload.TaxID
	}

	if payload.ContactName != nil {
		updates["contact_name"] = *payload.ContactName
	}
	if payload.ContactEmail != nil {
		updates["contact_email"] = *payload.ContactEmail
	}
	if payload.ContactPhone != nil {
		updates["contact_phone"] = *payload.ContactPhone
	}
	if payload.ContactWhatsapp != nil {
		updates["contact_whatsapp"] = *payload.ContactWhatsapp
	}

	if payload.Address != nil {
		updates["address"] = *payload.Address
	}
	if payload.District != nil {
		updates["district"] = *payload.District
	}
	if payload.City != nil {
		updates["city"] = *payload.City
	}
	if payload.Province != nil {
		updates["province"] = *payload.Province
	}
	if payload.PostalCode != nil {
		updates["postal_code"] = *payload.PostalCode
	}

	if err := r.db.Model(&models.Seller{}).Where("id = ?", id).Updates(updates).Error; err != nil {
		return models.Seller{}, err
	}

	return r.GetByID(id)
}

func (r *SellerRepository) GetStatsOverview(id string) (types.SellerStatsOverviewResponseDTO, error) {
	seller, err := r.GetByID(id)
	if err != nil {
		return types.SellerStatsOverviewResponseDTO{}, err
	}

	return types.SellerStatsOverviewResponseDTO{
		SellerID:      seller.ID,
		TotalProducts: seller.TotalProducts,
		TotalOrders:   seller.TotalOrders,
		TotalRevenue:  seller.TotalRevenue,
		AvgRating:     seller.AvgRating,
		ReviewCount:   seller.ReviewCount,
		ResponseRate:  seller.ResponseRate,
		ResponseTime:  seller.ResponseTime,
		IsFeatured:    seller.IsFeatured,
		UpdatedAt:     seller.UpdatedAt,
	}, nil
}

func (r *SellerRepository) CreateSellerDocument(doc *models.SellerDocument) error {
	return r.db.Create(doc).Error
}

func (r *SellerRepository) SetSellerVerificationStatusInReview(id string) error {
	return r.db.Model(&models.Seller{}).Where("id = ?", id).Update("verification_status", "in_review").Error
}

func (r *SellerRepository) ListLatestSellerDocumentsByType(sellerID string) ([]models.SellerDocument, error) {
	var docs []models.SellerDocument

	sub := r.db.Model(&models.SellerDocument{}).
		Select("document_type, MAX(created_at) AS max_created_at").
		Where("seller_id = ?", sellerID).
		Group("document_type")

	err := r.db.Model(&models.SellerDocument{}).
		Joins("JOIN (?) latest ON latest.document_type = seller_document.document_type AND latest.max_created_at = seller_document.created_at", sub).
		Where("seller_document.seller_id = ?", sellerID).
		Order("seller_document.created_at DESC").
		Find(&docs).Error

	return docs, err
}

// --------------------
// Seller Products (MVP)
// --------------------

func (r *SellerRepository) IsSellerProductSlugExists(slug string) (bool, error) {
	var count int64
	err := r.db.Model(&models.SellerProduct{}).
		Where("slug = ?", slug).
		Where("deleted_at IS NULL").
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *SellerRepository) CreateSellerProduct(product *models.SellerProduct) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(product).Error; err != nil {
			return err
		}

		return tx.Model(&models.Seller{}).
			Where("id = ?", product.SellerID).
			UpdateColumn("total_products", gorm.Expr("GREATEST(total_products + 1, 0)")).Error
	})
}

func (r *SellerRepository) GetSellerProductByID(sellerID, productID string) (models.SellerProduct, error) {
	var product models.SellerProduct
	err := r.db.Model(&models.SellerProduct{}).
		Where("id = ?", productID).
		Where("seller_id = ?", sellerID).
		Where("deleted_at IS NULL").
		First(&product).Error
	return product, err
}

func (r *SellerRepository) ListSellerProducts(sellerID string, status *string, search *string, page int, limit int) ([]models.SellerProduct, int64, error) {
	var products []models.SellerProduct
	var total int64

	q := r.db.Model(&models.SellerProduct{}).
		Where("seller_id = ?", sellerID).
		Where("deleted_at IS NULL")

	if status != nil && *status != "" {
		q = q.Where("status = ?", *status)
	}
	if search != nil && *search != "" {
		like := "%" + *search + "%"
		q = q.Where("name ILIKE ? OR sku ILIKE ?", like, like)
	}

	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 20
	}
	offset := (page - 1) * limit

	err := q.Order("created_at DESC").Offset(offset).Limit(limit).Find(&products).Error
	return products, total, err
}

func (r *SellerRepository) UpdateSellerProduct(sellerID, productID string, updates map[string]interface{}) (models.SellerProduct, error) {
	if err := r.db.Model(&models.SellerProduct{}).
		Where("id = ?", productID).
		Where("seller_id = ?", sellerID).
		Where("deleted_at IS NULL").
		Updates(updates).Error; err != nil {
		return models.SellerProduct{}, err
	}

	return r.GetSellerProductByID(sellerID, productID)
}

func (r *SellerRepository) PublishSellerProduct(sellerID, productID string) (models.SellerProduct, error) {
	updates := map[string]interface{}{
		"status":       "active",
		"published_at": time.Now(),
	}
	return r.UpdateSellerProduct(sellerID, productID, updates)
}

func (r *SellerRepository) UnpublishSellerProduct(sellerID, productID string) (models.SellerProduct, error) {
	updates := map[string]interface{}{
		"status":       "inactive",
		"published_at": nil,
	}
	return r.UpdateSellerProduct(sellerID, productID, updates)
}

func (r *SellerRepository) SoftDeleteSellerProduct(sellerID, productID string) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		res := tx.Model(&models.SellerProduct{}).
			Where("id = ?", productID).
			Where("seller_id = ?", sellerID).
			Where("deleted_at IS NULL").
			Update("deleted_at", time.Now())
		if res.Error != nil {
			return res.Error
		}
		if res.RowsAffected == 0 {
			return nil
		}

		return tx.Model(&models.Seller{}).
			Where("id = ?", sellerID).
			UpdateColumn("total_products", gorm.Expr("GREATEST(total_products - 1, 0)")).Error
	})
}

func (r *SellerRepository) AddProductImage(sellerID, productID, imageURL string, isPrimary bool) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		product, err := r.GetSellerProductByID(sellerID, productID)
		if err != nil {
			return err
		}

		var images []string
		if product.Images != nil {
			if err := json.Unmarshal(product.Images, &images); err != nil {
				images = []string{}
			}
		}

		images = append(images, imageURL)
		imagesJSON, _ := json.Marshal(images)

		updates := map[string]interface{}{"images": datatypes.JSON(imagesJSON)}
		if isPrimary || product.PrimaryImageURL == nil || *product.PrimaryImageURL == "" {
			updates["primary_image_url"] = imageURL
		}

		return tx.Model(&models.SellerProduct{}).Where("id = ?", productID).Updates(updates).Error
	})
}

func (r *SellerRepository) GetTopSellingProducts(sellerID string, limit int) ([]models.SellerProduct, error) {
	var products []models.SellerProduct
	err := r.db.Model(&models.SellerProduct{}).
		Where("seller_id = ?", sellerID).
		Where("status = ?", "active").
		Where("deleted_at IS NULL").
		Order("sold_count DESC").
		Limit(limit).
		Find(&products).Error
	return products, err
}

// --------------------
// Seller Product Variants
// --------------------

func (r *SellerRepository) CreateProductVariant(variant *models.SellerProductVariant) error {
	return r.db.Create(variant).Error
}

func (r *SellerRepository) GetProductVariantByID(sellerID, productID, variantID string) (models.SellerProductVariant, error) {
	var variant models.SellerProductVariant
	err := r.db.Model(&models.SellerProductVariant{}).
		Joins("JOIN seller_product ON seller_product_variant.product_id = seller_product.id").
		Where("seller_product_variant.id = ?", variantID).
		Where("seller_product_variant.product_id = ?", productID).
		Where("seller_product.seller_id = ?", sellerID).
		Where("seller_product.deleted_at IS NULL").
		First(&variant).Error
	return variant, err
}

func (r *SellerRepository) ListProductVariants(sellerID, productID string) ([]models.SellerProductVariant, error) {
	var variants []models.SellerProductVariant
	err := r.db.Model(&models.SellerProductVariant{}).
		Joins("JOIN seller_product ON seller_product_variant.product_id = seller_product.id").
		Where("seller_product_variant.product_id = ?", productID).
		Where("seller_product.seller_id = ?", sellerID).
		Where("seller_product.deleted_at IS NULL").
		Order("seller_product_variant.sort_order ASC, seller_product_variant.created_at ASC").
		Find(&variants).Error
	return variants, err
}

func (r *SellerRepository) UpdateProductVariant(sellerID, productID, variantID string, updates map[string]interface{}) (models.SellerProductVariant, error) {
	var variant models.SellerProductVariant
	
	// First verify the variant belongs to the seller's product
	if err := r.db.Model(&models.SellerProductVariant{}).
		Joins("JOIN seller_product ON seller_product_variant.product_id = seller_product.id").
		Where("seller_product_variant.id = ?", variantID).
		Where("seller_product_variant.product_id = ?", productID).
		Where("seller_product.seller_id = ?", sellerID).
		Where("seller_product.deleted_at IS NULL").
		First(&variant).Error; err != nil {
		return models.SellerProductVariant{}, err
	}

	// Update the variant
	if err := r.db.Model(&models.SellerProductVariant{}).
		Where("id = ?", variantID).
		Updates(updates).Error; err != nil {
		return models.SellerProductVariant{}, err
	}

	// Fetch updated variant
	if err := r.db.Where("id = ?", variantID).First(&variant).Error; err != nil {
		return models.SellerProductVariant{}, err
	}

	return variant, nil
}

func (r *SellerRepository) DeleteProductVariant(sellerID, productID, variantID string) error {
	// Verify the variant belongs to the seller's product before deleting
	var count int64
	err := r.db.Model(&models.SellerProductVariant{}).
		Joins("JOIN seller_product ON seller_product_variant.product_id = seller_product.id").
		Where("seller_product_variant.id = ?", variantID).
		Where("seller_product_variant.product_id = ?", productID).
		Where("seller_product.seller_id = ?", sellerID).
		Where("seller_product.deleted_at IS NULL").
		Count(&count).Error
	
	if err != nil {
		return err
	}
	
	if count == 0 {
		return gorm.ErrRecordNotFound
	}

	// Delete the variant
	return r.db.Delete(&models.SellerProductVariant{}, "id = ?", variantID).Error
}

func (r *SellerRepository) CountProductVariants(productID string) (int64, error) {
	var count int64
	err := r.db.Model(&models.SellerProductVariant{}).
		Where("product_id = ?", productID).
		Count(&count).Error
	return count, err
}

// --------------------
// Seller Finance & Payouts
// --------------------

func (r *SellerRepository) GetSellerBalance(sellerID string) (types.SellerBalanceResponseDTO, error) {
	var seller models.Seller
	if err := r.db.Where("id = ?", sellerID).First(&seller).Error; err != nil {
		return types.SellerBalanceResponseDTO{}, err
	}

	// Total revenue from seller's total_revenue field
	totalRevenue := seller.TotalRevenue

	// Total paid out: sum of all payouts with status 'paid'
	var totalPaidOut float64
	r.db.Model(&models.SellerPayout{}).
		Where("seller_id = ?", sellerID).
		Where("status = ?", "paid").
		Select("COALESCE(SUM(net_amount), 0)").
		Scan(&totalPaidOut)

	// Pending payouts: sum of payouts with status IN ('pending', 'approved', 'processing')
	var pendingPayouts float64
	r.db.Model(&models.SellerPayout{}).
		Where("seller_id = ?", sellerID).
		Where("status IN ?", []string{"pending", "approved", "processing"}).
		Select("COALESCE(SUM(net_amount), 0)").
		Scan(&pendingPayouts)

	// Available balance = total revenue - total paid out - pending payouts
	availableBalance := totalRevenue - totalPaidOut - pendingPayouts
	if availableBalance < 0 {
		availableBalance = 0
	}

	return types.SellerBalanceResponseDTO{
		TotalRevenue:    totalRevenue,
		TotalPaidOut:    totalPaidOut,
		PendingPayouts:  pendingPayouts,
		AvailableBalance: availableBalance,
	}, nil
}

func (r *SellerRepository) GetSellerPayouts(sellerID, status string, page, limit int) ([]types.SellerPayoutResponseDTO, int64, error) {
	query := r.db.Model(&models.SellerPayout{}).
		Where("seller_id = ?", sellerID)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	var total int64
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	var payouts []models.SellerPayout
	offset := (page - 1) * limit
	if err := query.Order("created_at DESC").
		Offset(offset).
		Limit(limit).
		Find(&payouts).Error; err != nil {
		return nil, 0, err
	}

	result := make([]types.SellerPayoutResponseDTO, 0, len(payouts))
	for _, p := range payouts {
		result = append(result, toSellerPayoutDTO(p))
	}

	return result, total, nil
}

func (r *SellerRepository) GetPayoutDetails(sellerID, payoutID string) (types.SellerPayoutResponseDTO, error) {
	var payout models.SellerPayout
	if err := r.db.Where("id = ? AND seller_id = ?", payoutID, sellerID).First(&payout).Error; err != nil {
		return types.SellerPayoutResponseDTO{}, err
	}

	dto := toSellerPayoutDTO(payout)

	// Load items
	var items []models.SellerPayoutItem
	if err := r.db.Where("payout_id = ?", payoutID).Find(&items).Error; err != nil {
		return types.SellerPayoutResponseDTO{}, err
	}

	dto.Items = make([]types.SellerPayoutItemResponseDTO, 0, len(items))
	for _, item := range items {
		dto.Items = append(dto.Items, types.SellerPayoutItemResponseDTO{
			ID:          item.ID,
			PayoutID:    item.PayoutID,
			OrderID:     item.OrderID,
			OrderNumber: item.OrderNumber,
			OrderDate:   item.OrderDate,
			GrossAmount:  item.GrossAmount,
			Commission:  item.Commission,
			NetAmount:   item.NetAmount,
		})
	}

	return dto, nil
}

func (r *SellerRepository) CreateWithdrawalPayout(sellerID string, amount float64, notes *string, seller models.Seller) (types.SellerPayoutResponseDTO, error) {
	// Generate payout number
	payoutNumber := fmt.Sprintf("PAY-%s-%s", time.Now().Format("20060102"), generateRandomString(5))

	// Create payout
	payout := models.SellerPayout{
		SellerID:          sellerID,
		PayoutNumber:      payoutNumber,
		PeriodStart:       time.Now(),
		PeriodEnd:         time.Now(),
		GrossAmount:       amount,
		CommissionAmount:  0,
		AdjustmentAmount:  0,
		NetAmount:         amount,
		OrderCount:        0,
		ItemCount:         0,
		BankName:          *seller.BankName,
		BankAccountName:   *seller.BankAccountName,
		BankAccountNumber: *seller.BankAccountNumber,
		Status:            "pending",
		Notes:             notes,
	}

	if err := r.db.Create(&payout).Error; err != nil {
		return types.SellerPayoutResponseDTO{}, err
	}

	return toSellerPayoutDTO(payout), nil
}

func (r *SellerRepository) GetPayoutSchedule(sellerID string) (types.PayoutScheduleResponseDTO, error) {
	var schedule models.SellerPayoutSchedule
	err := r.db.Where("seller_id = ?", sellerID).First(&schedule).Error
	
	if errors.Is(err, gorm.ErrRecordNotFound) {
		// Create default schedule with automatic payouts disabled
		schedule = models.SellerPayoutSchedule{
			SellerID:        sellerID,
			Frequency:       "weekly",
			MinPayoutAmount: 50000,
			IsActive:        false, // Automatic payouts disabled by default
		}
		if err := r.db.Create(&schedule).Error; err != nil {
			return types.PayoutScheduleResponseDTO{}, err
		}
	} else if err != nil {
		return types.PayoutScheduleResponseDTO{}, err
	}

	return types.PayoutScheduleResponseDTO{
		ID:              schedule.ID,
		SellerID:        schedule.SellerID,
		Frequency:       schedule.Frequency,
		DayOfWeek:       schedule.DayOfWeek,
		DayOfMonth:      schedule.DayOfMonth,
		MinPayoutAmount: schedule.MinPayoutAmount,
		IsActive:        schedule.IsActive,
		NextPayoutDate:  schedule.NextPayoutDate,
		LastPayoutDate:  schedule.LastPayoutDate,
	}, nil
}

func (r *SellerRepository) UpdatePayoutSchedule(sellerID string, payload types.UpdatePayoutSchedulePayload) (types.PayoutScheduleResponseDTO, error) {
	var schedule models.SellerPayoutSchedule
	if err := r.db.Where("seller_id = ?", sellerID).First(&schedule).Error; err != nil {
		return types.PayoutScheduleResponseDTO{}, err
	}

	updates := map[string]interface{}{}
	if payload.Frequency != nil {
		updates["frequency"] = *payload.Frequency
	}
	if payload.DayOfWeek != nil {
		updates["day_of_week"] = *payload.DayOfWeek
	}
	if payload.DayOfMonth != nil {
		updates["day_of_month"] = *payload.DayOfMonth
	}
	if payload.MinPayoutAmount != nil {
		updates["min_payout_amount"] = *payload.MinPayoutAmount
	}
	if payload.IsActive != nil {
		updates["is_active"] = *payload.IsActive
	}

	if err := r.db.Model(&schedule).Updates(updates).Error; err != nil {
		return types.PayoutScheduleResponseDTO{}, err
	}

	// Reload to get updated data
	if err := r.db.Where("seller_id = ?", sellerID).First(&schedule).Error; err != nil {
		return types.PayoutScheduleResponseDTO{}, err
	}

	return types.PayoutScheduleResponseDTO{
		ID:              schedule.ID,
		SellerID:        schedule.SellerID,
		Frequency:       schedule.Frequency,
		DayOfWeek:       schedule.DayOfWeek,
		DayOfMonth:      schedule.DayOfMonth,
		MinPayoutAmount: schedule.MinPayoutAmount,
		IsActive:        schedule.IsActive,
		NextPayoutDate:  schedule.NextPayoutDate,
		LastPayoutDate:  schedule.LastPayoutDate,
	}, nil
}

// Helper functions

func toSellerPayoutDTO(p models.SellerPayout) types.SellerPayoutResponseDTO {
	return types.SellerPayoutResponseDTO{
		ID:                p.ID,
		SellerID:          p.SellerID,
		PayoutNumber:      p.PayoutNumber,
		PeriodStart:       p.PeriodStart,
		PeriodEnd:         p.PeriodEnd,
		GrossAmount:       p.GrossAmount,
		CommissionAmount:  p.CommissionAmount,
		AdjustmentAmount:   p.AdjustmentAmount,
		NetAmount:         p.NetAmount,
		OrderCount:        p.OrderCount,
		ItemCount:         p.ItemCount,
		BankName:          p.BankName,
		BankAccountName:   p.BankAccountName,
		BankAccountNumber: p.BankAccountNumber,
		Status:            p.Status,
		ApprovedAt:        p.ApprovedAt,
		ProcessedAt:       p.ProcessedAt,
		PaidAt:            p.PaidAt,
		RejectedAt:        p.RejectedAt,
		RejectionReason:   p.RejectionReason,
		TransferReference: p.TransferReference,
		TransferProofURL:  p.TransferProofURL,
		Notes:             p.Notes,
		CreatedAt:         p.CreatedAt,
		UpdatedAt:         p.UpdatedAt,
	}
}

func generateRandomString(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, length)
	rand.Seed(time.Now().UnixNano())
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}
