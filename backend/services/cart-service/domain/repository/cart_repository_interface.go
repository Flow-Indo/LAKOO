package repository

import (
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/models"
)

type CartRepositoryInterface interface {
	// GetAllCartsByUserId(userId string) (*models.Cart, error)
	GetActiveCartByUserId(userId string) (*models.Cart, error)
	GetCartItemByUserIdAndProductId(userId string, productId string) (*models.CartItem, error)
	UpdateCartItem(userId string, cartId string, cartItem *models.CartItem) error
	CreateCartItem(userId string, cartId string, cartItem *models.CartItem) error
}
