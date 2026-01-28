package services

import (
	"context"

	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/types"
)

type CartServiceInterface interface {
	AddToCart(ctx context.Context, userId string, request types.CartItemRequest) error
	RemoveFromCart(userId string, productId string) error
	GetActiveCart(userId string) (*types.CartResponseDTO, error)
	ClearCart(userId string) error
}
