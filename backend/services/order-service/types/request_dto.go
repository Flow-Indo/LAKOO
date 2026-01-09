package types

import "time"

type OrderFilterPayload struct {
	userId        string    `schema:"user_id"`
	factoryId     string    `schema:"factory_id"`
	status        string    `schema:"status"`
	isGroupBuying bool      `schema:"is_group_buying"`
	search        string    `schema:"search"`
	page          int       `schema:"page"`
	limit         int       `schema:"limit"`
	startDate     time.Time `schema:"start_date"`
	endDate       time.Time `schema:"end_date"`
}

type CreateOrderPayload struct {
	UserID          string                 `json:"userId" validate:"required,uuid4"`
	Items           []OrderItemPayload     `json:"items" validate:"required,min=1,dive"`
	ShippingAddress ShippingAddressPayload `json:"shippingAddress" validate:"required"`
}

// Read implements io.Reader.
func (c *CreateOrderPayload) Read(p []byte) (n int, err error) {
	panic("unimplemented")
}

type OrderItemPayload struct {
	ProductID string `json:"productId" validate:"required,uuid4"`
	Quantity  int    `json:"quantity" validate:"required,min=1"`
}

type ShippingAddressPayload struct {
	Name       string `json:"name" validate:"required"`
	Phone      string `json:"phone" validate:"required"`
	Address    string `json:"address" validate:"required"`
	City       string `json:"city" validate:"required"`
	Province   string `json:"province" validate:"required"`
	District   string `json:"district" validate:"required"`
	PostalCode string `json:"postalCode,omitempty"` // Optional field
}
