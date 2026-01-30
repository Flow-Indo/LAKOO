package clients

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Flow-Indo/LAKOO/backend/shared/go/utils"
)

type PaymentClient struct {
	baseURL       string
	httpClient    *http.Client
	serviceSecret string
}

type CreatePaymentRequest struct {
	OrderID       string  `json:"orderId"`
	Amount        float64 `json:"amount"`
	Currency      string  `json:"currency"`
	PaymentMethod string  `json:"paymentMethod"`
	UserID        string  `json:"userId"`
}

type PaymentResponse struct {
	ID            string  `json:"id"`
	PaymentNumber string  `json:"paymentNumber"`
	Status        string  `json:"status"`
	Amount        float64 `json:"amount"`
	InvoiceURL    *string `json:"invoiceUrl"`
}

func NewPaymentClient() *PaymentClient {
	baseURL := os.Getenv("PAYMENT_SERVICE_URL")
	if baseURL == "" {
		baseURL = "http://localhost:3007"
	}
	serviceSecret := os.Getenv("SERVICE_SECRET")

	return &PaymentClient{
		baseURL: baseURL,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		serviceSecret: serviceSecret,
	}
}

func (c *PaymentClient) CreatePayment(req CreatePaymentRequest) (*PaymentResponse, error) {
	url := fmt.Sprintf("%s/api/payments", c.baseURL)

	body, err := json.Marshal(req)
	if err != nil {
		return nil, err
	}

	httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("x-service-name", "order-service")
	httpReq.Header.Set("x-service-auth", utils.GenerateServiceToken("order-service", c.serviceSecret))

	resp, err := c.httpClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("payment service returned status: %d", resp.StatusCode)
	}

	var result struct {
		Success bool            `json:"success"`
		Data    PaymentResponse `json:"data"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}

	return &result.Data, nil
}
