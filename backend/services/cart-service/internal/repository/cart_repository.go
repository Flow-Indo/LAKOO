package repository

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/models"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CartRepository struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) *CartRepository {
	return &CartRepository{
		db: db,
	}
}

// all carts
func (r *CartRepository) GetAllCartsByUserId(userId string) (*models.Cart, error) {
	var cart models.Cart

	_, err := r.db.Model(&models.Cart{}).
		Where("user_id = ?", userId).
		Find(&cart).Rows()

	if err != nil {
		return nil, errors.New("failed to fetch cart items")
	}

	return &cart, nil
}

// active carts
func (r *CartRepository) GetActiveCartByUserId(userId string) (*models.Cart, error) {
	var cart models.Cart

	_, err := r.db.Model(&models.Cart{}).
		Where("user_id = ? AND status = active", userId).
		Find(&cart).Rows()

	if err != nil {
		return nil, errors.New("failed to fetch cart items")
	}

	return &cart, nil
}

func (r *CartRepository) GetCartItemByUserIdAndProductId(userId string, productId string) (*models.CartItem, error) {
	var cartItem models.CartItem

	// userUUID, err := uuid.Parse(userId)
	// if err != nil {
	// 	return nil, fmt.Errorf("invalid user ID format: %w", err)
	// }

	// productUUID, err := uuid.Parse(productId)
	// if err != nil {
	// 	return nil, fmt.Errorf("invalid product ID format: %w", err)
	// }

	err := r.db.
		Joins("JOIN carts ON carts.id = cart_items.cart_id").
		Where("carts.user_id = ? AND cart_items.product_id = ?", userId, productId).
		Where("carts.status = ?", models.CartStatusActive). // Only active carts
		First(&cartItem).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get cart item: %w", err)
	}

	return &cartItem, nil
}

func (r *CartRepository) UpdateCartItem(userId string, cartId string, cartItem *models.CartItem) error {
	//verify the cart belongs to the user
	var cart models.Cart
	if err := r.db.Where("id = ? AND user_id = ?", cartId, userId).First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("cart not found or doesn't belong to user")
		}
		return fmt.Errorf("failed to verify cart ownership: %w", err)
	}

	//update the cart item
	result := r.db.Model(&models.CartItem{}).
		Where("id = ? AND cart_id = ?", cartItem.ID, cartId).
		Updates(map[string]interface{}{
			"quantity":              cartItem.Quantity,
			"current_unit_price":    cartItem.CurrentUnitPrice,
			"snapshot_unit_price":   cartItem.SnapshotUnitPrice,
			"price_changed":         cartItem.PriceChanged,
			"price_last_checked_at": cartItem.PriceLastCheckedAt,
			"is_available":          cartItem.IsAvailable,
			"availability_message":  cartItem.AvailabilityMessage,
			"updated_at":            time.Now(),
		})

	if result.Error != nil {
		return fmt.Errorf("failed to update cart item: %w", result.Error)
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("cart item not found")
	}

	return nil
}

func (r *CartRepository) CreateCartItem(userId string, cartId string, cartItem *models.CartItem) error {
	//verify the cart belongs to the user
	var cart models.Cart
	if err := r.db.Where("id = ? AND user_id = ?", cartId, userId).First(&cart).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("cart not found or doesn't belong to user")
		}
		return fmt.Errorf("failed to verify cart ownership: %w", err)
	}

	//set cart ID and timestamps
	cartUUID, err := uuid.Parse(cartId)
	if err != nil {
		return fmt.Errorf("cannot parse cartID to uuid from string")
	}
	cartItem.CartID = cartUUID
	cartItem.AddedAt = time.Now()
	cartItem.UpdatedAt = time.Now()

	//create cart item
	if err := r.db.Create(cartItem).Error; err != nil {
		//check for duplicate
		if strings.Contains(err.Error(), "duplicate key") ||
			strings.Contains(err.Error(), "UNIQUE constraint failed") {
			return fmt.Errorf("product already exists in cart")
		}
		return fmt.Errorf("failed to create cart item: %w", err)
	}

	return nil
}
