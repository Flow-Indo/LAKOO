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
	ProductServiceURL string
	httpClient        *http.Client
	serviceName       string
	serviceSecret     string
}

type ProductHTTPClientConfig struct {
	ProductServiceURL string
	Timeout           time.Duration
	ServiceName       string
	ServiceSecret     string
}

func NewProductHTTPClient(config ProductHTTPClientConfig) client.ProductServiceClient {
	return &ProductHTTPClient{
		ProductServiceURL: config.ProductServiceURL,
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
	url := fmt.Sprintf("%s/api/product/productsBase/%s", c.ProductServiceURL, productId)

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

	var product types.ProductResponseDTO
	if err := utils.ParseJSONBody(resp.Body, &product); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	return &product, nil

}
