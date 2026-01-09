package repository

import (
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

	results := r.db.Model(&models.Order{}).
		Joins("User").
		Joins("LEFT JOIN order_items ON orders.id = order_items.order_id").
		Joins("LEFT JOIN factories ON order_items.factory_id = factories.id").
		Joins("LEFT JOIN products ON order_items.product_id = products.id").
		Where(jsonPayload).
		Distinct("orders.*").
		Find(&orders)
	return orders, results.Error
}

func (r *OrderRepository) CreateOrder(jsonPayload map[string]interface{}) error {
	return nil
}
