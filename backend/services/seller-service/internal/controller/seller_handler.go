package controller

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"

	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/service"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/models"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/types"
	"github.com/gorilla/mux"
	httpSwagger "github.com/swaggo/http-swagger"
	"gorm.io/gorm"
)

type SellerHandler struct {
	service *service.SellerService
}

func NewSellerHandler(service *service.SellerService) *SellerHandler {
	return &SellerHandler{service: service}
}

func (h *SellerHandler) RegisterRoutes(r *mux.Router) {
	// Swagger
	r.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

	// Seller Profile & Settings
	r.HandleFunc("/{sellerId}", h.GetSellerProfile).Methods("GET")
	r.HandleFunc("/{sellerId}/shop", h.UpdateShopInfo).Methods("PATCH")
	r.HandleFunc("/{sellerId}/shop/logo", h.UploadShopLogo).Methods("POST")
	r.HandleFunc("/{sellerId}/bank", h.UpdateBank).Methods("PATCH")
	r.HandleFunc("/{sellerId}/bank", h.GetBankInfo).Methods("GET")
	r.HandleFunc("/{sellerId}/business", h.UpdateBusinessInfo).Methods("PATCH")
	r.HandleFunc("/{sellerId}/verification", h.GetVerificationStatus).Methods("GET")
	r.HandleFunc("/{sellerId}/stats/overview", h.GetStatsOverview).Methods("GET")

	// Document endpoints
	r.HandleFunc("/{sellerId}/verification/documents", h.UploadVerificationDocument).Methods("POST")
	r.HandleFunc("/{sellerId}/verification/documents", h.ListLatestVerificationDocumentsByType).Methods("GET")

	// Product endpoints
	r.HandleFunc("/{sellerId}/products", h.CreateSellerProduct).Methods("POST")
	r.HandleFunc("/{sellerId}/products", h.ListSellerProducts).Methods("GET")
	r.HandleFunc("/{sellerId}/products/{productId}", h.GetSellerProduct).Methods("GET")
	r.HandleFunc("/{sellerId}/products/{productId}", h.UpdateSellerProduct).Methods("PATCH")
	r.HandleFunc("/{sellerId}/products/{productId}", h.SoftDeleteSellerProduct).Methods("DELETE")
	r.HandleFunc("/{sellerId}/products/{productId}/publish", h.PublishSellerProduct).Methods("PATCH")
	r.HandleFunc("/{sellerId}/products/{productId}/unpublish", h.UnpublishSellerProduct).Methods("PATCH")
	r.HandleFunc("/{sellerId}/products/{productId}/copy", h.CopySellerProduct).Methods("POST")

	// Product Image Upload
	r.HandleFunc("/{sellerId}/products/{productId}/images", h.UploadProductImage).Methods("POST")

	// Product Variants
	r.HandleFunc("/{sellerId}/products/{productId}/variants", h.CreateProductVariant).Methods("POST")
	r.HandleFunc("/{sellerId}/products/{productId}/variants", h.ListProductVariants).Methods("GET")
	r.HandleFunc("/{sellerId}/products/{productId}/variants/{variantId}", h.GetProductVariant).Methods("GET")
	r.HandleFunc("/{sellerId}/products/{productId}/variants/{variantId}", h.UpdateProductVariant).Methods("PATCH")
	r.HandleFunc("/{sellerId}/products/{productId}/variants/{variantId}", h.DeleteProductVariant).Methods("DELETE")

	// Analytics
	r.HandleFunc("/{sellerId}/analytics/overview", h.GetAnalyticsOverview).Methods("GET")
	r.HandleFunc("/{sellerId}/analytics/top-products", h.GetTopSellingProducts).Methods("GET")

	// Finance endpoints
	r.HandleFunc("/{sellerId}/finance/balance", h.GetSellerBalance).Methods("GET")
	r.HandleFunc("/{sellerId}/finance/payouts", h.GetSellerPayouts).Methods("GET")
	r.HandleFunc("/{sellerId}/finance/payouts/{payoutId}", h.GetPayoutDetails).Methods("GET")
	r.HandleFunc("/{sellerId}/finance/withdraw", h.RequestWithdrawal).Methods("POST")
	r.HandleFunc("/{sellerId}/finance/payout-schedule", h.GetPayoutSchedule).Methods("GET")
	r.HandleFunc("/{sellerId}/finance/payout-schedule", h.UpdatePayoutSchedule).Methods("PATCH")
}

// @Summary Get Analytics Overview
// @Description Get high-level analytics overview for a seller.
// @Tags Analytics
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Success 200 {object} types.SellerAnalyticsOverviewResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/analytics/overview [get]
func (h *SellerHandler) GetAnalyticsOverview(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	stats, err := h.service.GetStatsOverview(sellerID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	topProducts, err := h.service.GetTopSellingProducts(sellerID, 5)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, types.SellerAnalyticsOverviewResponseDTO{
		SellerID:      sellerID,
		TotalOrders:   stats.TotalOrders,
		TotalRevenue:  stats.TotalRevenue,
		TotalProducts: stats.TotalProducts,
		TopProducts:   topProducts,
	})
}

// @Summary Get Top Selling Products
// @Description Get top selling products for a seller.
// @Tags Analytics
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param limit query int false "Max number of products to return" default(10)
// @Success 200 {object} types.TopSellingProductsResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/analytics/top-products [get]
func (h *SellerHandler) GetTopSellingProducts(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	limit := 10
	if v := r.URL.Query().Get("limit"); v != "" {
		if l, err := strconv.Atoi(v); err == nil && l > 0 {
			limit = l
		}
	}

	products, err := h.service.GetTopSellingProducts(sellerID, limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, types.TopSellingProductsResponseDTO{
		Products: products,
	})
}


func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]interface{}{
		"error": msg,
	})
}

func toProfileDTO(s models.Seller) types.SellerProfileResponseDTO {
	return types.SellerProfileResponseDTO{
		ID:                 s.ID,
		UserID:             s.UserID,
		SellerCode:         s.SellerCode,
		ShopName:           s.ShopName,
		ShopSlug:           s.ShopSlug,
		ShopDescription:    s.ShopDescription,
		ShopLogoURL:        s.ShopLogoURL,
		ShopBannerURL:      s.ShopBannerURL,
		ShopAnnouncement:   s.ShopAnnouncement,
		BusinessName:       s.BusinessName,
		BusinessType:       s.BusinessType,
		BusinessLicense:    s.BusinessLicense,
		TaxID:              s.TaxID,
		ContactName:        s.ContactName,
		ContactEmail:       s.ContactEmail,
		ContactPhone:       s.ContactPhone,
		ContactWhatsapp:    s.ContactWhatsapp,
		Address:            s.Address,
		District:           s.District,
		City:               s.City,
		Province:           s.Province,
		PostalCode:         s.PostalCode,
		Status:             s.Status,
		VerificationStatus: s.VerificationStatus,
		CreatedAt:          s.CreatedAt,
		UpdatedAt:          s.UpdatedAt,
	}
}

func toSellerProductDTO(p models.SellerProduct) types.SellerProductResponseDTO {
	var images interface{}
	_ = json.Unmarshal(p.Images, &images)

	return types.SellerProductResponseDTO{
		ID:               p.ID,
		SellerID:         p.SellerID,
		SKU:              p.SKU,
		Name:             p.Name,
		Slug:             p.Slug,
		Description:      p.Description,
		ShortDescription: p.ShortDescription,
		CategoryID:       p.CategoryID,
		CategoryName:     p.CategoryName,
		Price:            p.Price,
		ComparePrice:     p.ComparePrice,
		CostPrice:        p.CostPrice,
		TrackInventory:   p.TrackInventory,
		Quantity:         p.Quantity,
		Images:           images,
		PrimaryImageURL:  p.PrimaryImageURL,
		HasVariants:      p.HasVariants,
		Status:           p.Status,
		PublishedAt:      p.PublishedAt,
		Tags:             p.Tags,
		CreatedAt:        p.CreatedAt,
		UpdatedAt:        p.UpdatedAt,

		// Shipping
		WeightGrams: p.WeightGrams,
		LengthCm:    p.LengthCm,
		WidthCm:     p.WidthCm,
		HeightCm:    p.HeightCm,

		// Performance
		ViewCount: p.ViewCount,
		SoldCount: p.SoldCount,
	}
}

// @Summary Get Seller Profile
// @Description Get a seller's public profile information.
// @Tags Sellers
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Success 200 {object} types.SellerProfileResponseDTO
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId} [get]
func (h *SellerHandler) GetSellerProfile(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	seller, err := h.service.GetSellerProfile(sellerID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "seller not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toProfileDTO(seller))
}

// @Summary Upload Shop Logo
// @Description Upload a new shop logo. The file should be sent as multipart/form-data.
// @Tags Sellers
// @Accept multipart/form-data
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param file formData file true "The logo image file"
// @Success 200 {object} types.SellerProfileResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/shop/logo [post]
func (h *SellerHandler) UploadShopLogo(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	if err := r.ParseMultipartForm(5 << 20); err != nil { // 5MB limit
		writeError(w, http.StatusBadRequest, "file too large or invalid form")
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		writeError(w, http.StatusBadRequest, "missing 'file' field in multipart form")
		return
	}
	defer file.Close()

	seller, err := h.service.UploadShopLogo(r.Context(), sellerID, handler.Filename, file)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toProfileDTO(seller))
}

// @Summary Update Shop Info
// @Description Update a seller's shop information.
// @Tags Sellers
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param shopInfo body types.UpdateShopInfoPayload true "Shop info to update"
// @Success 200 {object} types.SellerProfileResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/shop [patch]
func (h *SellerHandler) UpdateShopInfo(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	var payload types.UpdateShopInfoPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	seller, err := h.service.UpdateShopInfo(sellerID, payload)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toProfileDTO(seller))
}

// @Summary Update Bank Account
// @Description Update a seller's bank account details.
// @Tags Sellers
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param bankInfo body types.UpdateBankAccountPayload true "Bank info to update"
// @Success 200 {object} types.SellerProfileResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/bank [patch]
func (h *SellerHandler) UpdateBank(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	var payload types.UpdateBankAccountPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	seller, err := h.service.UpdateBank(sellerID, payload)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toProfileDTO(seller))
}

// @Summary Get Bank Account
// @Description Get a seller's bank account details.
// @Tags Sellers
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Success 200 {object} types.SellerBankResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/bank [get]
func (h *SellerHandler) GetBankInfo(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	resp, err := h.service.GetBankInfo(sellerID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// @Summary Update Business Info
// @Description Update a seller's business information.
// @Tags Sellers
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param businessInfo body types.UpdateBusinessInfoPayload true "Business info to update"
// @Success 200 {object} types.SellerProfileResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/business [patch]
func (h *SellerHandler) UpdateBusinessInfo(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	var payload types.UpdateBusinessInfoPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	seller, err := h.service.UpdateBusinessInfo(sellerID, payload)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toProfileDTO(seller))
}

// @Summary Get Verification Status
// @Description Get a seller's verification status.
// @Tags Sellers
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Success 200 {object} types.VerificationStatusResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/verification [get]
func (h *SellerHandler) GetVerificationStatus(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	resp, err := h.service.GetVerificationStatus(sellerID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// @Summary Get Stats Overview
// @Description Get a seller's shop statistics overview.
// @Tags Sellers
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Success 200 {object} types.SellerStatsOverviewResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/stats/overview [get]
func (h *SellerHandler) GetStatsOverview(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	resp, err := h.service.GetStatsOverview(sellerID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// @Summary Upload Verification Document (JSON)
// @Description Upload a verification document by providing a file URL.
// @Tags Sellers
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param documentInfo body types.UploadSellerDocumentPayload true "Document info"
// @Success 201 {object} types.SellerDocumentResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/verification/documents [post]
func (h *SellerHandler) UploadVerificationDocument(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	var payload types.UploadSellerDocumentPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	doc, err := h.service.UploadVerificationDocument(sellerID, payload)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, doc)
}

// @Summary List Verification Documents
// @Description List the latest uploaded verification document for each type.
// @Tags Sellers
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/verification/documents [get]
func (h *SellerHandler) ListLatestVerificationDocumentsByType(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	docs, err := h.service.ListLatestVerificationDocumentsByType(sellerID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"documents": docs,
	})
}

// --------------------
// Seller Products (MVP)
// --------------------

// @Summary Create Seller Product
// @Description Create a new product for a seller. Slug is optional and will be generated if not provided.
// @Tags Products
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param product body types.CreateSellerProductPayload true "Product information"
// @Success 201 {object} types.SellerProductResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 409 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products [post]
func (h *SellerHandler) CreateSellerProduct(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	var payload types.CreateSellerProductPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	product, err := h.service.CreateSellerProduct(sellerID, payload)
	if err != nil {
		if errors.Is(err, service.ErrSellerProductSlugExists) {
			writeError(w, http.StatusConflict, err.Error())
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, toSellerProductDTO(product))
}

// @Summary List Seller Products
// @Description List products for a seller with optional filters and pagination.
// @Tags Products
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param status query string false "Filter by product status (e.g., draft, active)"
// @Param search query string false "Search by product name or SKU"
// @Param page query int false "Page number"
// @Param limit query int false "Items per page"
// @Success 200 {object} types.ListSellerProductsResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products [get]
func (h *SellerHandler) ListSellerProducts(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	page := 1
	limit := 20
	status := r.URL.Query().Get("status")
	search := r.URL.Query().Get("search")

	if v := r.URL.Query().Get("page"); v != "" {
		if p, err := strconv.Atoi(v); err == nil && p > 0 {
			page = p
		}
	}
	if v := r.URL.Query().Get("limit"); v != "" {
		if l, err := strconv.Atoi(v); err == nil && l > 0 {
			limit = l
		}
	}

	products, total, err := h.service.ListSellerProducts(sellerID, &status, &search, page, limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	resp := types.ListSellerProductsResponseDTO{
		Products: make([]types.SellerProductResponseDTO, 0, len(products)),
		Total:    total,
		Page:     page,
		Limit:    limit,
	}
	for _, p := range products {
		resp.Products = append(resp.Products, toSellerProductDTO(p))
	}

	writeJSON(w, http.StatusOK, resp)
}

// @Summary Get Seller Product
// @Description Get a single product by its ID, scoped to the seller.
// @Tags Products
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Success 200 {object} types.SellerProductResponseDTO
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId} [get]
func (h *SellerHandler) GetSellerProduct(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	product, err := h.service.GetSellerProduct(sellerID, productID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toSellerProductDTO(product))
}

// @Summary Update Seller Product
// @Description Update a seller's product.
// @Tags Products
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Param productInfo body types.UpdateSellerProductPayload true "Product info to update"
// @Success 200 {object} types.SellerProductResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 409 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId} [patch]
func (h *SellerHandler) UpdateSellerProduct(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	var payload types.UpdateSellerProductPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	product, err := h.service.UpdateSellerProduct(sellerID, productID, payload)
	if err != nil {
		if errors.Is(err, service.ErrSellerProductSlugExists) {
			writeError(w, http.StatusConflict, err.Error())
			return
		}
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toSellerProductDTO(product))
}

// @Summary Publish Seller Product
// @Description Mark a product as active and set its publish date.
// @Tags Products
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Success 200 {object} types.SellerProductResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/publish [patch]
func (h *SellerHandler) PublishSellerProduct(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	product, err := h.service.PublishSellerProduct(sellerID, productID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toSellerProductDTO(product))
}

// @Summary Unpublish Seller Product
// @Description Mark a product as inactive.
// @Tags Products
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Success 200 {object} types.SellerProductResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/unpublish [patch]
func (h *SellerHandler) UnpublishSellerProduct(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	product, err := h.service.UnpublishSellerProduct(sellerID, productID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toSellerProductDTO(product))
}

// @Summary Copy Seller Product
// @Description Create a copy of an existing product with all fields duplicated. The new product will have status 'draft' and a unique slug.
// @Tags Products
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Success 201 {object} types.SellerProductResponseDTO
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/copy [post]
func (h *SellerHandler) CopySellerProduct(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	product, err := h.service.CopySellerProduct(sellerID, productID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, toSellerProductDTO(product))
}

// @Summary Delete Seller Product
// @Description Soft delete a seller's product.
// @Tags Products
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Success 204 "No Content"
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId} [delete]
func (h *SellerHandler) SoftDeleteSellerProduct(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	if err := h.service.SoftDeleteSellerProduct(sellerID, productID); err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// @Summary Upload Product Image
// @Description Upload an image for a product. The file should be sent as multipart/form-data.
// @Tags Products
// @Accept multipart/form-data
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Param file formData file true "The image file"
// @Param is_primary formData boolean false "Set as primary image"
// @Success 200 {object} types.SellerProductResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/images [post]
func (h *SellerHandler) UploadProductImage(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	if err := r.ParseMultipartForm(5 << 20); err != nil { // 5MB limit
		writeError(w, http.StatusBadRequest, "file too large or invalid form")
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		writeError(w, http.StatusBadRequest, "missing 'file' field in multipart form")
		return
	}
	defer file.Close()

	isPrimary := r.FormValue("is_primary") == "true"

	product, err := h.service.UploadProductImage(r.Context(), sellerID, productID, handler.Filename, file, isPrimary)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toSellerProductDTO(product))
}

// --------------------
// Product Variant Handlers
// --------------------

func toProductVariantDTO(v models.SellerProductVariant) types.ProductVariantResponseDTO {
	return types.ProductVariantResponseDTO{
		ID:           v.ID,
		ProductID:    v.ProductID,
		SKU:          v.SKU,
		Name:         v.Name,
		Option1Name:  v.Option1Name,
		Option1Value: v.Option1Value,
		Option2Name:  v.Option2Name,
		Option2Value: v.Option2Value,
		Option3Name:  v.Option3Name,
		Option3Value: v.Option3Value,
		Price:        v.Price,
		ComparePrice: v.ComparePrice,
		CostPrice:    v.CostPrice,
		Quantity:     v.Quantity,
		WeightGrams:  v.WeightGrams,
		ImageURL:     v.ImageURL,
		IsActive:     v.IsActive,
		SortOrder:    v.SortOrder,
		CreatedAt:    v.CreatedAt,
		UpdatedAt:    v.UpdatedAt,
	}
}

// @Summary Create Product Variant
// @Description Create a new variant for a seller's product.
// @Tags Products
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Param variant body types.CreateProductVariantPayload true "Variant information"
// @Success 201 {object} types.ProductVariantResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/variants [post]
func (h *SellerHandler) CreateProductVariant(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	var payload types.CreateProductVariantPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	variant, err := h.service.CreateProductVariant(sellerID, productID, payload)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusCreated, toProductVariantDTO(variant))
}

// @Summary List Product Variants
// @Description List all variants for a seller's product.
// @Tags Products
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Success 200 {object} types.ListProductVariantsResponseDTO
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/variants [get]
func (h *SellerHandler) ListProductVariants(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]

	variants, err := h.service.ListProductVariants(sellerID, productID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "product not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	resp := types.ListProductVariantsResponseDTO{
		Variants: make([]types.ProductVariantResponseDTO, 0, len(variants)),
	}
	for _, v := range variants {
		resp.Variants = append(resp.Variants, toProductVariantDTO(v))
	}

	writeJSON(w, http.StatusOK, resp)
}

// @Summary Get Product Variant
// @Description Get a single variant by its ID, scoped to the seller's product.
// @Tags Products
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Param variantId path string true "Variant ID"
// @Success 200 {object} types.ProductVariantResponseDTO
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/variants/{variantId} [get]
func (h *SellerHandler) GetProductVariant(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]
	variantID := mux.Vars(r)["variantId"]

	variant, err := h.service.GetProductVariant(sellerID, productID, variantID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "variant not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toProductVariantDTO(variant))
}

// @Summary Update Product Variant
// @Description Update a product variant.
// @Tags Products
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Param variantId path string true "Variant ID"
// @Param variantInfo body types.UpdateProductVariantPayload true "Variant info to update"
// @Success 200 {object} types.ProductVariantResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/variants/{variantId} [patch]
func (h *SellerHandler) UpdateProductVariant(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]
	variantID := mux.Vars(r)["variantId"]

	var payload types.UpdateProductVariantPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid JSON body")
		return
	}

	variant, err := h.service.UpdateProductVariant(sellerID, productID, variantID, payload)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "variant not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, toProductVariantDTO(variant))
}

// @Summary Delete Product Variant
// @Description Delete a product variant.
// @Tags Products
// @Param sellerId path string true "Seller ID"
// @Param productId path string true "Product ID"
// @Param variantId path string true "Variant ID"
// @Success 204 "No Content"
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/products/{productId}/variants/{variantId} [delete]
func (h *SellerHandler) DeleteProductVariant(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	productID := mux.Vars(r)["productId"]
	variantID := mux.Vars(r)["variantId"]

	if err := h.service.DeleteProductVariant(sellerID, productID, variantID); err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "variant not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// --------------------
// Finance Handlers
// --------------------

// @Summary Get Seller Balance
// @Description Get seller's financial balance summary
// @Tags Finance
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Success 200 {object} types.SellerBalanceResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/finance/balance [get]
func (h *SellerHandler) GetSellerBalance(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	balance, err := h.service.GetSellerBalance(sellerID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, balance)
}

// @Summary Get Seller Payouts
// @Description Get list of seller payouts with optional status filter
// @Tags Finance
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param status query string false "Filter by status (pending, approved, processing, paid, rejected, cancelled)"
// @Param page query int false "Page number" default(1)
// @Param limit query int false "Items per page" default(20)
// @Success 200 {object} types.ListSellerPayoutsResponseDTO
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/finance/payouts [get]
func (h *SellerHandler) GetSellerPayouts(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	status := r.URL.Query().Get("status")
	page := 1
	if v := r.URL.Query().Get("page"); v != "" {
		if p, err := strconv.Atoi(v); err == nil && p > 0 {
			page = p
		}
	}
	limit := 20
	if v := r.URL.Query().Get("limit"); v != "" {
		if l, err := strconv.Atoi(v); err == nil && l > 0 {
			limit = l
		}
	}

	payouts, total, err := h.service.GetSellerPayouts(sellerID, status, page, limit)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, types.ListSellerPayoutsResponseDTO{
		Payouts: payouts,
		Total:   total,
		Page:    page,
		Limit:   limit,
	})
}

// @Summary Get Payout Details
// @Description Get detailed information about a specific payout including items
// @Tags Finance
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param payoutId path string true "Payout ID"
// @Success 200 {object} types.SellerPayoutResponseDTO
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/finance/payouts/{payoutId} [get]
func (h *SellerHandler) GetPayoutDetails(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]
	payoutID := mux.Vars(r)["payoutId"]

	payout, err := h.service.GetPayoutDetails(sellerID, payoutID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "payout not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, payout)
}

// @Summary Request Withdrawal
// @Description Request a manual withdrawal (creates a payout with status 'pending')
// @Tags Finance
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param payload body types.RequestWithdrawalPayload true "Withdrawal request"
// @Success 200 {object} types.SellerPayoutResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/finance/withdraw [post]
func (h *SellerHandler) RequestWithdrawal(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	var payload types.RequestWithdrawalPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if payload.Amount <= 0 {
		writeError(w, http.StatusBadRequest, "amount must be greater than 0")
		return
	}

	payout, err := h.service.RequestWithdrawal(sellerID, payload.Amount, payload.Notes)
	if err != nil {
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, payout)
}

// @Summary Get Payout Schedule
// @Description Get seller's payout schedule configuration
// @Tags Finance
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Success 200 {object} types.PayoutScheduleResponseDTO
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/finance/payout-schedule [get]
func (h *SellerHandler) GetPayoutSchedule(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	schedule, err := h.service.GetPayoutSchedule(sellerID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "payout schedule not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, schedule)
}

// @Summary Update Payout Schedule
// @Description Update seller's payout schedule configuration
// @Tags Finance
// @Accept json
// @Produce json
// @Param sellerId path string true "Seller ID"
// @Param payload body types.UpdatePayoutSchedulePayload true "Schedule update"
// @Success 200 {object} types.PayoutScheduleResponseDTO
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /{sellerId}/finance/payout-schedule [patch]
func (h *SellerHandler) UpdatePayoutSchedule(w http.ResponseWriter, r *http.Request) {
	sellerID := mux.Vars(r)["sellerId"]

	var payload types.UpdatePayoutSchedulePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	schedule, err := h.service.UpdatePayoutSchedule(sellerID, payload)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			writeError(w, http.StatusNotFound, "payout schedule not found")
			return
		}
		writeError(w, http.StatusInternalServerError, err.Error())
		return
	}

	writeJSON(w, http.StatusOK, schedule)
}
