package db

import (
	"fmt"
	"log"

	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/config"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/domain/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewPostgresStore() (*gorm.DB, error) {
	var dsn string
	
	// Support both DATABASE_URL and individual DB parameters
	if config.Envs.DATABASE_URL != "" {
		dsn = config.Envs.DATABASE_URL
	} else {
		dsn = fmt.Sprintf("host=%v user=%v password=%v dbname=%v port=%v sslmode=%v",
			config.Envs.DB_HOST,
			config.Envs.DB_USER,
			config.Envs.DB_PASSWORD,
			config.Envs.DB_NAME,
			config.Envs.DB_PORT,
			config.Envs.DB_SSL,
		)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	// Auto-migrate models
	if err := db.AutoMigrate(&models.Cart{}, &models.CartItem{}); err != nil {
		return nil, fmt.Errorf("failed to migrate: %w", err)
	}

	log.Println("Database connected and migrated successfully")
	return db, nil
}
