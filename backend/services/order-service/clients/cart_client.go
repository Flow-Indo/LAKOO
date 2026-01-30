package clients

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type CartClient struct {
	baseURL    string
	httpClient *http.Client
}

type CartResponse struct {
	ID        string     `json:"id"`
	UserID    string     `json:"user_id"`
	Items     []CartItem `json:"items"`
	Total     float64    `json:"total"`
	ItemCount int        `json:"item_count"`
}

type CartItem struct {
	ID                  string  `json:"id"`
	ItemType            string  `json:"item_type"`
	ProductID           string  `json:"product_id"`
	VariantID           *string `json:"variant_id"`
	BrandID             *string `json:"brand_id"`
	SellerID            *string `json:"seller_id"`
	Quantity            int     `json:"quantity"`
	CurrentUnitPrice    float64 `json:"current_unit_price"`
	SnapshotProductName string  `json:"snapshot_product_name"`
	SnapshotVariantName *string `json:"snapshot_variant_name"`
	SnapshotSKU         *string `json:"snapshot_sku"`
	SnapshotImageURL    *string `json:"snapshot_image_url"`
	SnapshotUnitPrice   float64 `json:"snapshot_unit_price"`
	SnapshotBrandName   *string `json:"snapshot_brand_name"`
	SnapshotSellerName  *string `json:"snapshot_seller_name"`
	IsAvailable         bool    `json:"is_available"`
}

func NewCartClient() *CartClient {
	baseURL := os.Getenv("CART_SERVICE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:3003"
	}

	return &CartClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (c *CartClient) GetCart(userID string) (*CartResponse, error) {
	url := fmt.Sprintf("%s/api/cart/%s", c.baseURL, userID)

	resp, err := c.httpClient.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("cart service returned status: %d", resp.StatusCode)
	}

	var cart CartResponse
	if err := json.NewDecoder(resp.Body).Decode(&cart); err != nil {
		return nil, err
	}

	return &cart, nil
}

func (c *CartClient) ClearCart(userID string) error {
	url := fmt.Sprintf("%s/api/cart/%s", c.baseURL, userID)

	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		return err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent {
		return fmt.Errorf("failed to clear cart: status %d", resp.StatusCode)
	}

	return nil
}
