package clients

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/client"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/types"
	"github.com/Flow-Indo/LAKOO/backend/shared/go/auth"
	"github.com/Flow-Indo/LAKOO/backend/shared/go/utils"
)

type ProductHTTPClient struct {
	GatewayURL    string
	httpClient    *http.Client
	serviceName   string
	serviceSecret string
}

type ProductHTTPClientConfig struct {
	GatewayURL    string
	Timeout       time.Duration
	ServiceName   string
	ServiceSecret string
}

func NewProductHTTPClient(config ProductHTTPClientConfig) client.ProductServiceClient {
	return &ProductHTTPClient{
		GatewayURL: config.GatewayURL,
		httpClient: &http.Client{
			Timeout: config.Timeout,
		},
		serviceName:   config.ServiceName,
		serviceSecret: config.ServiceSecret,
	}
}

func (c *ProductHTTPClient) addServiceHeaders(req *http.Request) {
	serviceToken := auth.GenerateServiceToken(c.serviceName, c.serviceSecret)
	req.Header.Set(auth.ServiceAuthHeader, serviceToken)
	req.Header.Set(auth.ServiceNameHeader, c.serviceName)
}

func (c *ProductHTTPClient) GetProductByIdBase(ctx context.Context, productId string) (*types.ProductResponseDTO, error) {
	// Use product-service taggable endpoint (exists) for MVP contract compatibility
	url := fmt.Sprintf("%s/api/products/%s/taggable", c.GatewayURL, productId)

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	c.addServiceHeaders(req)

	resp, err := c.httpClient.Do(req)
	if err != nil {
		//TODO: if token expired, refresh the token and send the request
		return nil, fmt.Errorf("failed to call product service: %w", err)
	}

	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("product service returned %d: %s", resp.StatusCode, string(body))
	}

	// product-service response shape:
	// { success: true, data: { id, name, sellerId, status, isTaggable, price, primaryImageUrl, productSource } }
	var wrapped struct {
		Success bool `json:"success"`
		Data    struct {
			ID              string  `json:"id"`
			Name            string  `json:"name"`
			SellerID        *string `json:"sellerId"`
			Status          string  `json:"status"`
			IsTaggable      bool    `json:"isTaggable"`
			Price           float64 `json:"price"`
			PrimaryImageURL *string `json:"primaryImageUrl"`
			ProductSource   string  `json:"productSource"`
		} `json:"data"`
	}

	if err := utils.ParseJSONBody(resp.Body, &wrapped); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	product := types.ProductResponseDTO{
		ID:              wrapped.Data.ID,
		Name:            wrapped.Data.Name,
		Price:           wrapped.Data.Price,
		SellerID:        wrapped.Data.SellerID,
		Status:          wrapped.Data.Status,
		IsTaggable:      wrapped.Data.IsTaggable,
		PrimaryImageURL: wrapped.Data.PrimaryImageURL,
		ProductSource:   wrapped.Data.ProductSource,
	}

	return &product, nil

}
