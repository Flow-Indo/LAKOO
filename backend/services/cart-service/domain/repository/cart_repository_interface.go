package repository

import (
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/models"
	"github.com/google/uuid"
)

type CartRepositoryInterface interface {
	// GetAllCartsByUserId(userId string) (*models.Cart, error)
	GetActiveCartByUserId(userId string) (*models.Cart, error)
	GetCartItemByUserIdAndProductId(userId string, productId string) (*models.CartItem, error)
	UpdateCartItem(userId string, cartId string, cartItem *models.CartItem) error
	CreateCartItem(userId string, cartId string, cartItem *models.CartItem) error

	CreateCart(cart *models.Cart) error
	RemoveCartItem(cartID uuid.UUID, productID uuid.UUID) error
	DeleteAllCartItems(cartID uuid.UUID) error
	RecalculateCartTotals(cartID uuid.UUID) error
}
