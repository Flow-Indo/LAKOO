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
	//check is no product, or check if requested quantity > stock quantity
	if productResponse == nil || productResponse.StockQuantity < request.Quantity {
		return errors.New("Requested quantity exceeds the stock quantity for this product")
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

				return nil
			}
		}

		//if product didnt exist in the cart

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
			IsAvailable:        true,
			//Availability message
			//SnapshotVariantName
			//SnapshotSellerName
			//SnapshotBrandNme
			SnapshotProductName: productResponse.Name,
			SnapshotImageURL:    &productResponse.ImageURL,
			SnapshotSKU:         &productResponse.SKU,
		}
		//add item count
		existingActiveCart.ItemCount += 1

		if err := s.repository.CreateCartItem(userId, existingActiveCart.ID.String(), newCartItem); err != nil {
			return fmt.Errorf("Unable to create cartItem for productID: %v", productResponse.ID)
		}
	} else { //if user does not have an active cart

	}

	return nil
}

func (s *CartService) GetActiveCart(userId string) (*types.CartResponseDTO, error) {
	cart, err := s.repository.GetActiveCartByUserId(userId)
	if err != nil {
		return nil, err
	}

	return s.parseToCartResponse(cart), nil

}

func (s *CartService) RemoveFromCart(userId string, productId string) error {
	return nil
}

func (s *CartService) ClearCart(userId string) error {
	return nil
}

func (s *CartService) parseToCartResponse(cart *models.Cart) *types.CartResponseDTO {
	var cartResponse types.CartResponseDTO

	cartResponse.Total = cart.Total
	cartResponse.Items = cart.Items
	cartResponse.ItemCount = cart.ItemCount

	return &cartResponse
}
