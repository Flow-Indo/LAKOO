package service

import (
	"context"
	"errors"
	"fmt"
	"io"
	"strings"
	"time"
	"unicode"

	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/client"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/repository"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/storage"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/models"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/types"
	"github.com/lib/pq"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

var ErrSellerProductSlugExists = errors.New("product slug already exists")

type SellerService struct {
	repo       *repository.SellerRepository
	s3Uploader *storage.S3Uploader
	orderClient *client.OrderServiceClient
}

func NewSellerService(
	repo *repository.SellerRepository,
	s3Uploader *storage.S3Uploader,
	orderClient *client.OrderServiceClient,
) *SellerService {
	return &SellerService{
		repo:        repo,
		s3Uploader:  s3Uploader,
		orderClient: orderClient,
	}
}

// -------- Orders (via order-service client) --------

func (s *SellerService) ListSellerOrders(
	ctx context.Context,
	sellerID string,
	params types.ListSellerOrdersParams,
) (types.ListSellerOrdersResponseDTO, error) {
	query := map[string]string{}
	if params.Status != "" {
		query["status"] = params.Status
	}
	if params.From != "" {
		query["from"] = params.From
	}
	if params.To != "" {
		query["to"] = params.To
	}
	if params.Query != "" {
		query["q"] = params.Query
	}

	resp, err := s.orderClient.ListOrders(ctx, sellerID, query)
	if err != nil {
		return types.ListSellerOrdersResponseDTO{}, err
	}

	items := make([]types.OrderListItemResponseDTO, 0, len(resp.Orders))
	for _, o := range resp.Orders {
		createdAt, _ := time.Parse(time.RFC3339, o.CreatedAt)
		items = append(items, types.OrderListItemResponseDTO{
			ID:           o.ID,
			OrderNumber:  o.OrderNumber,
			Status:       o.Status,
			CreatedAt:    createdAt,
			BuyerName:    o.BuyerName,
			TotalAmount:  o.TotalAmount,
			ShippingCity: o.ShippingCity,
		})
	}

	return types.ListSellerOrdersResponseDTO{
		Orders: items,
		Page:   resp.Page,
		Limit:  resp.Limit,
		Total:  resp.Total,
	}, nil
}

func (s *SellerService) GetSellerOrder(
	ctx context.Context,
	sellerID, orderID string,
) (types.OrderDetailResponseDTO, error) {
	resp, err := s.orderClient.GetOrder(ctx, sellerID, orderID)
	if err != nil {
		return types.OrderDetailResponseDTO{}, err
	}

	createdAt, _ := time.Parse(time.RFC3339, resp.CreatedAt)

	items := make([]types.OrderItemDetailDTO, 0, len(resp.Items))
	for _, it := range resp.Items {
		items = append(items, types.OrderItemDetailDTO{
			ID:        it.ID,
			ProductID: it.ProductID,
			Name:      it.Name,
			Variant:   it.Variant,
			Quantity:  it.Quantity,
			UnitPrice: it.UnitPrice,
			Subtotal:  it.Subtotal,
			ImageURL:  it.ImageURL,
		})
	}

	return types.OrderDetailResponseDTO{
		ID:                 resp.ID,
		OrderNumber:        resp.OrderNumber,
		Status:             resp.Status,
		CreatedAt:          createdAt,
		BuyerName:          resp.BuyerName,
		BuyerPhone:         resp.BuyerPhone,
		ShippingAddress:    resp.ShippingAddress,
		ShippingCity:       resp.ShippingCity,
		ShippingPostalCode: resp.ShippingPostalCode,
		Subtotal:           resp.Subtotal,
		ShippingCost:       resp.ShippingCost,
		TaxAmount:          resp.TaxAmount,
		DiscountAmount:     resp.DiscountAmount,
		TotalAmount:        resp.TotalAmount,
		TrackingNumber:     resp.TrackingNumber,
		EstimatedDelivery:  resp.EstimatedDeliveryDate,
		Items:              items,
	}, nil
}

func (s *SellerService) ConfirmSellerOrder(
	ctx context.Context,
	sellerID, orderID string,
) error {
	return s.orderClient.ConfirmOrder(ctx, sellerID, orderID)
}

func (s *SellerService) ShipSellerOrder(
	ctx context.Context,
	sellerID, orderID string,
) error {
	return s.orderClient.ShipOrder(ctx, sellerID, orderID)
}

func (s *SellerService) UpdateSellerOrderTracking(
	ctx context.Context,
	sellerID, orderID, trackingNumber string,
) error {
	return s.orderClient.UpdateTracking(ctx, sellerID, orderID, trackingNumber)
}

// ... (existing seller profile methods) ...

func (s *SellerService) GetSellerProfile(id string) (models.Seller, error) {
	return s.repo.GetByID(id)
}

func (s *SellerService) UpdateShopInfo(id string, payload types.UpdateShopInfoPayload) (models.Seller, error) {
	return s.repo.UpdateShopInfo(id, payload)
}

func (s *SellerService) UpdateBank(id string, payload types.UpdateBankAccountPayload) (models.Seller, error) {
	return s.repo.UpdateBank(id, payload)
}

func (s *SellerService) UpdateBusinessInfo(id string, payload types.UpdateBusinessInfoPayload) (models.Seller, error) {
	return s.repo.UpdateBusinessInfo(id, payload)
}

func (s *SellerService) GetVerificationStatus(id string) (types.VerificationStatusResponseDTO, error) {
	seller, err := s.repo.GetByID(id)
	if err != nil {
		return types.VerificationStatusResponseDTO{}, err
	}

	return types.VerificationStatusResponseDTO{
		SellerID:           seller.ID,
		VerificationStatus: seller.VerificationStatus,
		VerifiedAt:         seller.VerifiedAt,
		VerifiedBy:         seller.VerifiedBy,
	}, nil
}

func (s *SellerService) GetBankInfo(id string) (types.SellerBankResponseDTO, error) {
	seller, err := s.repo.GetByID(id)
	if err != nil {
		return types.SellerBankResponseDTO{}, err
	}

	return types.SellerBankResponseDTO{
		SellerID:          seller.ID,
		SellerCode:        seller.SellerCode,
		BankName:          seller.BankName,
		BankAccountName:   seller.BankAccountName,
		BankAccountNumber: seller.BankAccountNumber,
		BankBranch:        seller.BankBranch,
		UpdatedAt:         seller.UpdatedAt,
	}, nil
}

func (s *SellerService) GetStatsOverview(id string) (types.SellerStatsOverviewResponseDTO, error) {
	return s.repo.GetStatsOverview(id)
}

func (s *SellerService) UploadVerificationDocument(sellerID string, payload types.UploadSellerDocumentPayload) (types.SellerDocumentResponseDTO, error) {
	if payload.DocumentType == "" {
		return types.SellerDocumentResponseDTO{}, errors.New("document_type is required")
	}
	if payload.FileURL == "" {
		return types.SellerDocumentResponseDTO{}, errors.New("file_url is required")
	}
	if payload.FileName == "" {
		return types.SellerDocumentResponseDTO{}, errors.New("file_name is required")
	}

	doc := models.SellerDocument{
		SellerID:        sellerID,
		DocumentType:    payload.DocumentType,
		DocumentNumber:  payload.DocumentNumber,
		FileURL:         payload.FileURL,
		FileName:        payload.FileName,
		FileSize:        payload.FileSize,
		ExpiresAt:       payload.ExpiresAt,
		Status:          "pending",
	}

	if err := s.repo.CreateSellerDocument(&doc); err != nil {
		return types.SellerDocumentResponseDTO{}, err
	}

	if err := s.repo.SetSellerVerificationStatusInReview(sellerID); err != nil {
		return types.SellerDocumentResponseDTO{}, err
	}

	return toSellerDocumentDTO(doc), nil
}

func (s *SellerService) ListLatestVerificationDocumentsByType(sellerID string) ([]types.SellerDocumentResponseDTO, error) {
	docs, err := s.repo.ListLatestSellerDocumentsByType(sellerID)
	if err != nil {
		return nil, err
	}

	resp := make([]types.SellerDocumentResponseDTO, 0, len(docs))
	for _, d := range docs {
		resp = append(resp, toSellerDocumentDTO(d))
	}

	return resp, nil
}

func (s *SellerService) UploadShopLogo(ctx context.Context, sellerID, fileName string, file io.Reader) (models.Seller, error) {
	s3URI, err := s.s3Uploader.UploadFile(ctx, sellerID, "shop-logos", fileName, file)
	if err != nil {
		return models.Seller{}, err
	}

	if err := s.repo.UpdateShopLogoURL(sellerID, s3URI); err != nil {
		return models.Seller{}, err
	}

	return s.repo.GetByID(sellerID)
}

func (s *SellerService) UploadProductImage(ctx context.Context, sellerID, productID, fileName string, file io.Reader, isPrimary bool) (models.SellerProduct, error) {
	product, err := s.repo.GetSellerProductByID(sellerID, productID)
	if err != nil {
		return models.SellerProduct{}, err
	}

	s3URI, err := s.s3Uploader.UploadFile(ctx, sellerID, "product-images", fileName, file)
	if err != nil {
		return models.SellerProduct{}, err
	}

	if err := s.repo.AddProductImage(sellerID, product.ID, s3URI, isPrimary); err != nil {
		return models.SellerProduct{}, err
	}

	return s.repo.GetSellerProductByID(sellerID, productID)
}

// --------------------
// Seller Products (MVP)
// --------------------

func (s *SellerService) CreateSellerProduct(sellerID string, payload types.CreateSellerProductPayload) (models.SellerProduct, error) {
	name := strings.TrimSpace(payload.Name)
	if name == "" {
		return models.SellerProduct{}, errors.New("name is required")
	}
	if payload.Price < 0 {
		return models.SellerProduct{}, errors.New("price must be >= 0")
	}

	slug := ""
	clientProvidedSlug := payload.Slug != nil && strings.TrimSpace(*payload.Slug) != ""
	if clientProvidedSlug {
		slug = slugify(*payload.Slug)
		if slug == "" {
			return models.SellerProduct{}, errors.New("slug is invalid")
		}
		exists, err := s.repo.IsSellerProductSlugExists(slug)
		if err != nil {
			return models.SellerProduct{}, err
		}
		if exists {
			return models.SellerProduct{}, ErrSellerProductSlugExists
		}
	} else {
		base := slugify(name)
		if base == "" {
			return models.SellerProduct{}, errors.New("failed to generate slug")
		}
		unique, err := s.generateUniqueProductSlug(base)
		if err != nil {
			return models.SellerProduct{}, err
		}
		slug = unique
	}

	trackInventory := true
	if payload.TrackInventory != nil {
		trackInventory = *payload.TrackInventory
	}

	quantity := 0
	if payload.Quantity != nil {
		quantity = *payload.Quantity
	}

	images := payload.Images
	if len(images) == 0 {
		images = datatypes.JSON([]byte("null"))
	}

	product := models.SellerProduct{
		SellerID:           sellerID,
		SKU:                payload.SKU,
		Name:               name,
		Slug:               slug,
		Description:        payload.Description,
		ShortDescription:   payload.ShortDescription,
		CategoryID:         payload.CategoryID,
		CategoryName:       payload.CategoryName,
		Price:              payload.Price,
		ComparePrice:       payload.ComparePrice,
		CostPrice:          payload.CostPrice,
		TrackInventory:     trackInventory,
		Quantity:           quantity,
		WeightGrams:        payload.WeightGrams,
		LengthCm:           payload.LengthCm,
		WidthCm:            payload.WidthCm,
		HeightCm:           payload.HeightCm,
		Images:             images,
		PrimaryImageURL:    payload.PrimaryImageURL,
		Status:             "draft",
		Tags:               pqStringArray(payload.Tags),
	}

	if err := s.repo.CreateSellerProduct(&product); err != nil {
		return models.SellerProduct{}, err
	}

	return product, nil
}

func (s *SellerService) ListSellerProducts(sellerID string, status *string, search *string, page int, limit int) ([]models.SellerProduct, int64, error) {
	return s.repo.ListSellerProducts(sellerID, status, search, page, limit)
}

func (s *SellerService) GetSellerProduct(sellerID, productID string) (models.SellerProduct, error) {
	return s.repo.GetSellerProductByID(sellerID, productID)
}

func (s *SellerService) UpdateSellerProduct(sellerID, productID string, payload types.UpdateSellerProductPayload) (models.SellerProduct, error) {
	updates := map[string]interface{}{}

	if payload.Name != nil {
		name := strings.TrimSpace(*payload.Name)
		if name == "" {
			return models.SellerProduct{}, errors.New("name cannot be empty")
		}
		updates["name"] = name
	}
	if payload.Description != nil {
		updates["description"] = *payload.Description
	}
	if payload.ShortDescription != nil {
		updates["short_description"] = *payload.ShortDescription
	}
	if payload.SKU != nil {
		updates["sku"] = *payload.SKU
	}
	if payload.CategoryID != nil {
		updates["category_id"] = *payload.CategoryID
	}
	if payload.CategoryName != nil {
		updates["category_name"] = *payload.CategoryName
	}
	if payload.Price != nil {
		if *payload.Price < 0 {
			return models.SellerProduct{}, errors.New("price must be >= 0")
		}
		updates["price"] = *payload.Price
	}
	if payload.ComparePrice != nil {
		updates["compare_price"] = *payload.ComparePrice
	}
	if payload.CostPrice != nil {
		updates["cost_price"] = *payload.CostPrice
	}
	if payload.TrackInventory != nil {
		updates["track_inventory"] = *payload.TrackInventory
	}
	if payload.Quantity != nil {
		if *payload.Quantity < 0 {
			return models.SellerProduct{}, errors.New("quantity must be >= 0")
		}
		updates["quantity"] = *payload.Quantity
	}
	if payload.WeightGrams != nil {
		updates["weight_grams"] = *payload.WeightGrams
	}
	if payload.LengthCm != nil {
		updates["length_cm"] = *payload.LengthCm
	}
	if payload.WidthCm != nil {
		updates["width_cm"] = *payload.WidthCm
	}
	if payload.HeightCm != nil {
		updates["height_cm"] = *payload.HeightCm
	}
	if payload.PrimaryImageURL != nil {
		updates["primary_image_url"] = *payload.PrimaryImageURL
	}
	if payload.Images != nil {
		updates["images"] = *payload.Images
	}
	if payload.Tags != nil {
		updates["tags"] = pqStringArray(*payload.Tags)
	}
	if payload.Status != nil {
		st := strings.TrimSpace(*payload.Status)
		if st != "" {
			updates["status"] = st
		}
	}

	if payload.Slug != nil {
		slug := slugify(*payload.Slug)
		if slug == "" {
			return models.SellerProduct{}, errors.New("slug is invalid")
		}
		exists, err := s.repo.IsSellerProductSlugExists(slug)
		if err != nil {
			return models.SellerProduct{}, err
		}
		if exists {
			return models.SellerProduct{}, ErrSellerProductSlugExists
		}
		updates["slug"] = slug
	}

	return s.repo.UpdateSellerProduct(sellerID, productID, updates)
}

func (s *SellerService) PublishSellerProduct(sellerID, productID string) (models.SellerProduct, error) {
	return s.repo.PublishSellerProduct(sellerID, productID)
}

func (s *SellerService) UnpublishSellerProduct(sellerID, productID string) (models.SellerProduct, error) {
	return s.repo.UnpublishSellerProduct(sellerID, productID)
}

func (s *SellerService) SoftDeleteSellerProduct(sellerID, productID string) error {
	return s.repo.SoftDeleteSellerProduct(sellerID, productID)
}

func (s *SellerService) CopySellerProduct(sellerID, productID string) (models.SellerProduct, error) {
	original, err := s.repo.GetSellerProductByID(sellerID, productID)
	if err != nil {
		return models.SellerProduct{}, err
	}

	newSlugBase := slugify(original.Name + "-copy")
	newSlug, err := s.generateUniqueProductSlug(newSlugBase)
	if err != nil {
		return models.SellerProduct{}, fmt.Errorf("failed to generate unique slug for copy: %w", err)
	}

	newProduct := original
	newProduct.ID = ""
	newProduct.Slug = newSlug
	newProduct.Status = "draft"
	newProduct.PublishedAt = nil
	newProduct.SoldCount = 0
	newProduct.ViewCount = 0
	newProduct.CreatedAt = time.Time{}
	newProduct.UpdatedAt = time.Time{}
	newProduct.DeletedAt = gorm.DeletedAt{}

	if err := s.repo.CreateSellerProduct(&newProduct); err != nil {
		return models.SellerProduct{}, err
	}

	return newProduct, nil
}

// --------------------
// Seller Analytics (MVP)
// --------------------

func (s *SellerService) GetTopSellingProducts(sellerID string, limit int) ([]types.TopProductDTO, error) {
	products, err := s.repo.GetTopSellingProducts(sellerID, limit)
	if err != nil {
		return nil, err
	}

	resp := make([]types.TopProductDTO, 0, len(products))
	for _, p := range products {
		resp = append(resp, types.TopProductDTO{
			ID:              p.ID,
			Name:            p.Name,
			PrimaryImageURL: p.PrimaryImageURL,
			SoldCount:       p.SoldCount,
		})
	}

	return resp, nil
}

// --------------------
// Seller Product Variants
// --------------------

func (s *SellerService) CreateProductVariant(sellerID, productID string, payload types.CreateProductVariantPayload) (models.SellerProductVariant, error) {
	// Verify product belongs to seller
	product, err := s.repo.GetSellerProductByID(sellerID, productID)
	if err != nil {
		return models.SellerProductVariant{}, err
	}

	// Validate price
	if payload.Price < 0 {
		return models.SellerProductVariant{}, errors.New("price must be >= 0")
	}

	// Validate quantity if provided
	if payload.Quantity != nil && *payload.Quantity < 0 {
		return models.SellerProductVariant{}, errors.New("quantity must be >= 0")
	}

	// Create variant
	variant := models.SellerProductVariant{
		ProductID:    productID,
		Name:         payload.Name,
		SKU:          payload.SKU,
		Option1Name:  payload.Option1Name,
		Option1Value: payload.Option1Value,
		Option2Name:  payload.Option2Name,
		Option2Value: payload.Option2Value,
		Option3Name:  payload.Option3Name,
		Option3Value: payload.Option3Value,
		Price:        payload.Price,
		ComparePrice: payload.ComparePrice,
		CostPrice:    payload.CostPrice,
		Quantity:     0,
		WeightGrams:  payload.WeightGrams,
		ImageURL:     payload.ImageURL,
		IsActive:     true,
		SortOrder:    0,
	}

	if payload.Quantity != nil {
		variant.Quantity = *payload.Quantity
	}
	if payload.IsActive != nil {
		variant.IsActive = *payload.IsActive
	}
	if payload.SortOrder != nil {
		variant.SortOrder = *payload.SortOrder
	}

	if err := s.repo.CreateProductVariant(&variant); err != nil {
		return models.SellerProductVariant{}, err
	}

	// Update product's has_variants flag if this is the first variant
	if !product.HasVariants {
		if _, err := s.repo.UpdateSellerProduct(sellerID, productID, map[string]interface{}{
			"has_variants": true,
		}); err != nil {
			// Log error but don't fail the variant creation
			fmt.Printf("Warning: failed to update has_variants flag: %v\n", err)
		}
	}

	return variant, nil
}

func (s *SellerService) ListProductVariants(sellerID, productID string) ([]models.SellerProductVariant, error) {
	// Verify product belongs to seller
	if _, err := s.repo.GetSellerProductByID(sellerID, productID); err != nil {
		return nil, err
	}

	return s.repo.ListProductVariants(sellerID, productID)
}

func (s *SellerService) GetProductVariant(sellerID, productID, variantID string) (models.SellerProductVariant, error) {
	return s.repo.GetProductVariantByID(sellerID, productID, variantID)
}

func (s *SellerService) UpdateProductVariant(sellerID, productID, variantID string, payload types.UpdateProductVariantPayload) (models.SellerProductVariant, error) {
	updates := map[string]interface{}{}

	if payload.Name != nil {
		name := strings.TrimSpace(*payload.Name)
		if name == "" {
			return models.SellerProductVariant{}, errors.New("name cannot be empty")
		}
		updates["name"] = name
	}
	if payload.SKU != nil {
		updates["sku"] = *payload.SKU
	}
	if payload.Option1Name != nil {
		updates["option1_name"] = *payload.Option1Name
	}
	if payload.Option1Value != nil {
		updates["option1_value"] = *payload.Option1Value
	}
	if payload.Option2Name != nil {
		updates["option2_name"] = *payload.Option2Name
	}
	if payload.Option2Value != nil {
		updates["option2_value"] = *payload.Option2Value
	}
	if payload.Option3Name != nil {
		updates["option3_name"] = *payload.Option3Name
	}
	if payload.Option3Value != nil {
		updates["option3_value"] = *payload.Option3Value
	}
	if payload.Price != nil {
		if *payload.Price < 0 {
			return models.SellerProductVariant{}, errors.New("price must be >= 0")
		}
		updates["price"] = *payload.Price
	}
	if payload.ComparePrice != nil {
		updates["compare_price"] = *payload.ComparePrice
	}
	if payload.CostPrice != nil {
		updates["cost_price"] = *payload.CostPrice
	}
	if payload.Quantity != nil {
		if *payload.Quantity < 0 {
			return models.SellerProductVariant{}, errors.New("quantity must be >= 0")
		}
		updates["quantity"] = *payload.Quantity
	}
	if payload.WeightGrams != nil {
		updates["weight_grams"] = *payload.WeightGrams
	}
	if payload.ImageURL != nil {
		updates["image_url"] = *payload.ImageURL
	}
	if payload.IsActive != nil {
		updates["is_active"] = *payload.IsActive
	}
	if payload.SortOrder != nil {
		updates["sort_order"] = *payload.SortOrder
	}

	if len(updates) == 0 {
		// No updates provided, return current variant
		return s.repo.GetProductVariantByID(sellerID, productID, variantID)
	}

	return s.repo.UpdateProductVariant(sellerID, productID, variantID, updates)
}

func (s *SellerService) DeleteProductVariant(sellerID, productID, variantID string) error {
	// Delete the variant
	if err := s.repo.DeleteProductVariant(sellerID, productID, variantID); err != nil {
		return err
	}

	// Check if there are any remaining variants
	count, err := s.repo.CountProductVariants(productID)
	if err != nil {
		// Log error but don't fail the deletion
		fmt.Printf("Warning: failed to count remaining variants: %v\n", err)
		return nil
	}

	// Update product's has_variants flag if no variants remain
	if count == 0 {
		if _, err := s.repo.UpdateSellerProduct(sellerID, productID, map[string]interface{}{
			"has_variants": false,
		}); err != nil {
			// Log error but don't fail the deletion
			fmt.Printf("Warning: failed to update has_variants flag: %v\n", err)
		}
	}

	return nil
}

// --------------------
// Helpers
// --------------------

func (s *SellerService) generateUniqueProductSlug(base string) (string, error) {
	slug := base
	for i := 0; i < 50; i++ {
		exists, err := s.repo.IsSellerProductSlugExists(slug)
		if err != nil {
			return "", err
		}
		if !exists {
			return slug, nil
		}
		slug = fmt.Sprintf("%s-%d", base, i+2)
	}
	return "", errors.New("unable to generate unique slug")
}

func slugify(s string) string {
	s = strings.TrimSpace(strings.ToLower(s))
	if s == "" {
		return ""
	}

	var b strings.Builder
	b.Grow(len(s))

	prevDash := false
	for _, r := range s {
		switch {
		case unicode.IsLetter(r) || unicode.IsDigit(r):
			b.WriteRune(r)
			prevDash = false
		case r == ' ' || r == '-' || r == '_' || r == '.':
			if !prevDash {
				b.WriteByte('-')
				prevDash = true
			}
		default:
			// skip
		}
	}

	out := strings.Trim(b.String(), "-")
	return out
}

func pqStringArray(tags []string) pq.StringArray {
	if tags == nil {
		return pq.StringArray{}
	}

	out := make([]string, 0, len(tags))
	for _, t := range tags {
		tt := strings.TrimSpace(t)
		if tt != "" {
			out = append(out, tt)
		}
	}
	return pq.StringArray(out)
}

func toSellerDocumentDTO(doc models.SellerDocument) types.SellerDocumentResponseDTO {
	return types.SellerDocumentResponseDTO{
		ID:             doc.ID,
		SellerID:        doc.SellerID,
		DocumentType:    doc.DocumentType,
		DocumentNumber:  doc.DocumentNumber,
		FileURL:         doc.FileURL,
		FileName:        doc.FileName,
		FileSize:        doc.FileSize,
		Status:          doc.Status,
		VerifiedAt:      doc.VerifiedAt,
		VerifiedBy:      doc.VerifiedBy,
		RejectedAt:      doc.RejectedAt,
		RejectionReason: doc.RejectionReason,
		ExpiresAt:       doc.ExpiresAt,
		CreatedAt:       doc.CreatedAt,
		UpdatedAt:       doc.UpdatedAt,
	}
}

// --------------------
// Seller Finance & Payouts
// --------------------

func (s *SellerService) GetSellerBalance(sellerID string) (types.SellerBalanceResponseDTO, error) {
	return s.repo.GetSellerBalance(sellerID)
}

func (s *SellerService) GetSellerPayouts(sellerID, status string, page, limit int) ([]types.SellerPayoutResponseDTO, int64, error) {
	return s.repo.GetSellerPayouts(sellerID, status, page, limit)
}

func (s *SellerService) GetPayoutDetails(sellerID, payoutID string) (types.SellerPayoutResponseDTO, error) {
	return s.repo.GetPayoutDetails(sellerID, payoutID)
}

func (s *SellerService) RequestWithdrawal(sellerID string, amount float64, notes *string) (types.SellerPayoutResponseDTO, error) {
	// Get seller to check bank info and balance
	seller, err := s.repo.GetByID(sellerID)
	if err != nil {
		return types.SellerPayoutResponseDTO{}, err
	}

	if seller.BankName == nil || seller.BankAccountNumber == nil {
		return types.SellerPayoutResponseDTO{}, errors.New("bank account information is required for withdrawal")
	}

	// Check available balance
	balance, err := s.repo.GetSellerBalance(sellerID)
	if err != nil {
		return types.SellerPayoutResponseDTO{}, err
	}

	if amount > balance.AvailableBalance {
		return types.SellerPayoutResponseDTO{}, errors.New("insufficient balance")
	}

	// Create payout with status 'pending'
	return s.repo.CreateWithdrawalPayout(sellerID, amount, notes, seller)
}

func (s *SellerService) GetPayoutSchedule(sellerID string) (types.PayoutScheduleResponseDTO, error) {
	return s.repo.GetPayoutSchedule(sellerID)
}

func (s *SellerService) UpdatePayoutSchedule(sellerID string, payload types.UpdatePayoutSchedulePayload) (types.PayoutScheduleResponseDTO, error) {
	return s.repo.UpdatePayoutSchedule(sellerID, payload)
}
