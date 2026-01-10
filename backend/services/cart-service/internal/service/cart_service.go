package service

import (
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/internal/repository"
)

type CartService struct {
	repository *repository.CartRepository
}
