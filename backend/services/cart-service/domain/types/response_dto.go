package types

import "github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/models"

type CartResponseDTO struct {
	ItemCount int               `json:"item_count`
	Items     []models.CartItem `json:"items"`
	Total     float64           `json:"total_price"`
}

type ProductResponseDTO struct {
	ID            string  `json:"id" validate:"required,uuid4"`
	Name          string  `json:"name" validate:"required,min=1,max=200"`
	Price         float64 `json:"price" validate:"required,min=0,max=1000000"`
	SupplierID    *string `json:"supplier_id,omitempty"`
	StockQuantity int     `json:"stock_quantity" validate:"required"`
	SKU           string  `json:"sku" validate:"required"`
	Weight        float64 `json:"weight" validate:"min=0,max=1000"` // in grams
	Length        float64 `json:"length" validate:"min=0,max=500"`  // in cm
	Width         float64 `json:"width" validate:"min=0,max=500"`   // in cm
	Height        float64 `json:"height" validate:"min=0,max=500"`  // in cm
	ImageURL      string  `json:"image_url" validate:"omitempty,url,max=500"`
}
