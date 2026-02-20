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
	// //check is no product, or check if requested quantity > stock quantity
	if productResponse == nil {
		return errors.New("product not found")
	}

	//check if seller product or brand
	var itemType models.CartItemType
	isSellerProduct := productResponse.SupplierID == nil
	if isSellerProduct {
		// s.sellerClient.GetProductById()
		itemType = models.SellerProduct
	} else {
		// s.brandClient.GetProductById()
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
	//create cart if user does not have an active cart
	if existingActiveCart == nil {
		newCart := &models.Cart{
			UserID:         &userUUID,
			Status:         models.CartStatusActive,
			Currency:       "IDR",
			ItemCount:      1,
			Total:          float64(request.Quantity),
			DiscountAmount: 0,
			LastActivityAt: time.Now(),
			CreatedAt:      time.Now(),
			UpdatedAt:      time.Now(),
		}

		if err := s.repository.CreateCart(newCart); err != nil {
			return err
		}
	}

	//if active cart is available now
	if existingActiveCart != nil {
		currentPrice := productResponse.Price
		priceChanged := false

		for _, cartItem := range existingActiveCart.Items {
			//if product of same sku exists already in the cart
			//if it is the same sku and same item type
			if cartItem.ItemType == itemType && cartItem.SnapshotSKU == &productResponse.SKU {
				priceChanged = cartItem.SnapshotUnitPrice != currentPrice

				cartItem.Quantity += request.Quantity
				cartItem.CurrentUnitPrice = currentPrice
				cartItem.PriceChanged = priceChanged
				cartItem.PriceLastCheckedAt = time.Now()
				cartItem.Subtotal = float64(cartItem.Quantity) * currentPrice

				//check availability if the product is still available for the existingcart
				cartItem.IsAvailable = productResponse.StockQuantity >= cartItem.Quantity
				if !cartItem.IsAvailable {
					message := fmt.Sprintf("Only %d items available", productResponse.StockQuantity)
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

		//if product sku didnt exist in the cart

		productID, _ := uuid.Parse(productResponse.ID)
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
			Subtotal:           currentPrice * float64(request.Quantity),
			IsAvailable:        productResponse.StockQuantity >= 1,
			//Availability message
			//SnapshotVariantName
			//SnapshotSellerName
			//SnapshotBrandNme
			SnapshotProductName: productResponse.Name,
			SnapshotImageURL:    &productResponse.ImageURL,
			SnapshotSKU:         &productResponse.SKU,
		}
		if !newCartItem.IsAvailable {
			message := "product is not available"
			newCartItem.AvailabilityMessage = &message
		}
		//add item count
		existingActiveCart.ItemCount += 1

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
			ItemCount: 0,
			Items:     []models.CartItem{},
			Total:     0,
		}, nil
	}

	return s.parseToCartResponse(cart), nil

}

func (s *CartService) RemoveFromCart(userId string, sku string) error {
	cart, err := s.repository.GetActiveCartByUserId(userId)
	if err != nil {
		return err
	}

	if cart == nil {
		return errors.New("no active cart found")
	}

	skuUUID, err := uuid.Parse(sku)
	if err != nil {
		return fmt.Errorf("invalid product ID format: %w", err)
	}

	if err := s.repository.RemoveCartItem(cart.ID, skuUUID); err != nil {
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

	cartResponse.Total = cart.Total
	cartResponse.Items = cart.Items
	cartResponse.ItemCount = cart.ItemCount

	return &cartResponse
}
