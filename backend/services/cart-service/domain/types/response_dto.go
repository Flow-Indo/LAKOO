package types

import "github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/models"

type CartResponseDTO struct {
	ID        string            `json:"id"`
	UserID    string            `json:"user_id"`
	ItemCount int               `json:"item_count"`
	Items     []models.CartItem `json:"items"`
	Total     float64           `json:"total"`
}

type ProductResponseDTO struct {
	ID              string  `json:"id" validate:"required,uuid4"`
	Name            string  `json:"name" validate:"required,min=1,max=200"`
	Price           float64 `json:"price" validate:"required,min=0,max=1000000"`
	SellerID        *string `json:"seller_id,omitempty"`
	Status          string  `json:"status,omitempty"`
	IsTaggable      bool    `json:"is_taggable"`
	PrimaryImageURL *string `json:"primary_image_url,omitempty"`
	ProductSource   string  `json:"product_source,omitempty"` // seller_product | warehouse_product
}
