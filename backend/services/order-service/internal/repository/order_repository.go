package repository

import (
	"context"
	"fmt"

	"github.com/Flow-Indo/LAKOO/backend/services/order-service/models"
	"gorm.io/gorm"
)

type OrderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) *OrderRepository {
	// db = db.Session(&gorm.Session{
	// 	PrepareStmt: false,
	// })
	return &OrderRepository{db: db}
}

func (r *OrderRepository) GetOrders(jsonPayload map[string]interface{}) ([]models.Order, error) {
	var orders []models.Order

	// Preload order items with the order
	results := r.db.Model(&models.Order{}).
		Preload("Items").
		Where(jsonPayload).
		Find(&orders)
	return orders, results.Error
}

func (r *OrderRepository) CreateOrder(ctx context.Context, order *models.Order) error {
	return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {
		// Create the order row first
		if err := tx.Omit("Items").Create(order).Error; err != nil {
			return fmt.Errorf("failed to create order: %w", err)
		}

		// Create order items (if any)
		if len(order.Items) > 0 {
			for i := range order.Items {
				order.Items[i].OrderID = order.ID
			}
			if err := tx.Create(&order.Items).Error; err != nil {
				return fmt.Errorf("failed to create order items: %w", err)
			}
		}

		return nil
	})
}
