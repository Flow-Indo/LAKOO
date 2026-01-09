package types

type ProductSnapshot struct {
	Factory  ProductSnapshotFactory  `json:"factory"`
	Product  ProductSnapshotProduct  `json:"product"`
	Category ProductSnapshotCategory `json:"category"`
}

type ProductSnapshotFactory struct {
	ID          string `json:"id"`
	City        string `json:"city"`
	FactoryName string `json:"factory_name"`
}

type ProductSnapshotProduct struct {
	ID              string `json:"id"`
	SKU             string `json:"sku"`
	Name            string `json:"name"`
	WidthCM         int    `json:"width_cm"`
	HeightCM        int    `json:"height_cm"`
	LengthCM        int    `json:"length_cm"`
	BasePrice       int    `json:"base_price"`
	FactoryID       string `json:"factory_id"`
	Description     string `json:"description"`
	WeightGrams     int    `json:"weight_grams"`
	PrimaryImageURL string `json:"primary_image_url"`
}

type ProductSnapshotCategory struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type PaginatedOrdersResponse struct {
	Data       []OrderResponse `json:"data"`
	Pagination Pagination      `json:"pagination"`
}

type Pagination struct {
	Page       int `json:"page"`
	Limit      int `json:"limit"`
	Total      int `json:"total"`
	TotalPages int `json:"totalPages"`
}
