package service

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/client"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/models"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/repository"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/types"
	"github.com/google/uuid"
)

type CartService struct {
	repository    repository.CartRepositoryInterface
	productClient client.ProductServiceClient
	timeout       time.Duration
}

type CartServiceConfig struct {
	ProductServiceTimeout time.Duration
}

func NewCartService(repository repository.CartRepositoryInterface, productClient client.ProductServiceClient, config CartServiceConfig) *CartService {
	return &CartService{
		repository:    repository,
		productClient: productClient,
		timeout:       config.ProductServiceTimeout,
	}
}

func (s *CartService) AddToCart(ctx context.Context, userId string, request types.CartItemRequest) error {
	//get product
	productResponse, err := s.productClient.GetProductByIdBase(ctx, request.ProductID)
	if err != nil {
		return err
	}
	//check is no product
	if productResponse == nil {
		return errors.New("product not found")
	}
	// MVP: stock validation is handled by downstream inventory/warehouse; product-service taggable endpoint does not expose stock.

	//check if seller product or brand
	var itemType models.CartItemType
	if productResponse.ProductSource == "seller_product" || productResponse.SellerID != nil {
		itemType = models.SellerProduct
	} else {
		itemType = models.BrandProduct
	}

	existingActiveCart, err := s.repository.GetActiveCartByUserId(userId)
	if err != nil {
		return err
	}

	userUUID, err := uuid.Parse(userId)
	if err != nil {
		return fmt.Errorf("invalid user ID format: %w", err)
	}

	// Create cart if user does not have an active cart
	if existingActiveCart == nil {
		existingActiveCart = &models.Cart{
			UserID:         &userUUID,
			Status:         models.CartStatusActive,
			Currency:       "IDR",
			ItemCount:      0,
			Subtotal:       0,
			DiscountAmount: 0,
			LastActivityAt: time.Now(),
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		}

		if err := s.repository.CreateCart(existingActiveCart); err != nil {
			return err
		}
	}

	if existingActiveCart != nil {
		currentPrice := productResponse.Price
		priceChanged := false

		for _, cartItem := range existingActiveCart.Items {
			//if product exists already in the cart
			if cartItem.ProductID.String() == request.ProductID && cartItem.ItemType == itemType {
				priceChanged = cartItem.SnapshotUnitPrice != currentPrice

				cartItem.Quantity += request.Quantity
				cartItem.CurrentUnitPrice = currentPrice
				cartItem.PriceChanged = priceChanged
				cartItem.PriceLastCheckedAt = time.Now()

				// MVP: treat "taggable" as a lightweight availability gate (approved/active & not deleted)
				// Stock validation is handled elsewhere (warehouse/inventory) in this architecture.
				cartItem.IsAvailable = productResponse.IsTaggable
				if !cartItem.IsAvailable {
					message := "Product is not available"
					cartItem.AvailabilityMessage = &message
				} else {
					cartItem.AvailabilityMessage = nil
				}

				if err := s.repository.UpdateCartItem(userId, existingActiveCart.ID.String(), &cartItem); err != nil {
					return fmt.Errorf("Unable to update cart for productID: %v", request.ProductID)
				}

				if err := s.repository.RecalculateCartTotals(existingActiveCart.ID); err != nil {
					return err
				}

				return nil
			}
		}

		//if product didnt exist in the cart

		productID, err := uuid.Parse(productResponse.ID)
		if err != nil {
			return fmt.Errorf("invalid product ID format: %w", err)
		}
		newCartItem := &models.CartItem{
			CartID:    existingActiveCart.ID,
			ItemType:  itemType,
			ProductID: &productID,
			//variantID
			//brandID
			//BrandproductID
			//SellerID
			//SellerProductID
			Quantity:          request.Quantity,
			CurrentUnitPrice:  currentPrice,
			SnapshotUnitPrice: currentPrice,
			// SnapshotComparePrice: comparePrice,
			PriceChanged:       false,
			PriceLastCheckedAt: time.Now(),
			IsAvailable:        productResponse.IsTaggable,
			//Availability message
			//SnapshotVariantName
			//SnapshotSellerName
			//SnapshotBrandNme
			SnapshotProductName: productResponse.Name,
			SnapshotImageURL:    productResponse.PrimaryImageURL,
			SnapshotSKU:         nil,
		}
		if !newCartItem.IsAvailable {
			message := "Product is not available"
			newCartItem.AvailabilityMessage = &message
		}

		if err := s.repository.CreateCartItem(userId, existingActiveCart.ID.String(), newCartItem); err != nil {
			return fmt.Errorf("Unable to create cartItem for productID: %v", productResponse.ID)
		}
		if err := s.repository.RecalculateCartTotals(existingActiveCart.ID); err != nil {
			return err
		}
	}

	return nil
}

func (s *CartService) GetActiveCart(userId string) (*types.CartResponseDTO, error) {
	cart, err := s.repository.GetActiveCartByUserId(userId)
	if err != nil {
		return nil, err
	}

	if cart == nil {
		return &types.CartResponseDTO{
			ID:        "",
			UserID:    userId,
			ItemCount: 0,
			Items:     []models.CartItem{},
			Total:     0,
		}, nil
	}

	return s.parseToCartResponse(cart), nil

}

func (s *CartService) RemoveFromCart(userId string, productId string) error {
	cart, err := s.repository.GetActiveCartByUserId(userId)
	if err != nil {
		return err
	}
	if cart == nil {
		return errors.New("no active cart found")
	}

	productUUID, err := uuid.Parse(productId)
	if err != nil {
		return fmt.Errorf("invalid product ID format: %w", err)
	}

	if err := s.repository.RemoveCartItem(cart.ID, productUUID); err != nil {
		return err
	}

	return s.repository.RecalculateCartTotals(cart.ID)
}

func (s *CartService) ClearCart(userId string) error {
	cart, err := s.repository.GetActiveCartByUserId(userId)
	if err != nil {
		return err
	}
	if cart == nil {
		return nil
	}

	if err := s.repository.DeleteAllCartItems(cart.ID); err != nil {
		return err
	}

	return s.repository.RecalculateCartTotals(cart.ID)
}

func (s *CartService) parseToCartResponse(cart *models.Cart) *types.CartResponseDTO {
	var cartResponse types.CartResponseDTO

	cartResponse.ID = cart.ID.String()
	if cart.UserID != nil {
		cartResponse.UserID = cart.UserID.String()
	}
	cartResponse.Total = cart.Subtotal
	cartResponse.Items = cart.Items
	cartResponse.ItemCount = cart.ItemCount

	return &cartResponse
}
