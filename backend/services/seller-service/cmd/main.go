package main

import (
	"log"

	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/config"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/db"
	_ "github.com/Flow-Indo/LAKOO/backend/services/seller-service/docs" // swagger docs
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/client"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/controller"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/repository"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/service"
	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/internal/storage"
	"github.com/Flow-Indo/LAKOO/backend/shared/api"
	"gorm.io/gorm"
)

// @title Seller Service API
// @version 1.0
// @description This API manages seller profiles, products, verification, and related functionalities.
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:3015
// @BasePath /api/sellers
func main() {
	// Initialize database connection
	database, err := db.NewPostgresStore()
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	initDatabase(database)

	// Initialize S3 Uploader
	s3Uploader, err := storage.NewS3Uploader()
	if err != nil {
		log.Fatal("Failed to initialize S3 uploader: ", err)
	}

	// Initialize Order Service client (mocked for now)
	orderClient := client.NewOrderServiceClient("") // baseURL will be used when order-service is ready

	// Initialize API server
	apiServer := api.NewServer(api.ServerConfig{
		Addr:        config.Envs.SELLER_SERVICE_PORT,
		DB:          database,
		ServiceName: "seller-service",
		APIPrefix:   "sellers",
	})

	// Initialize dependencies
	sellerRepo := repository.NewSellerRepository(database)
	sellerService := service.NewSellerService(sellerRepo, s3Uploader, orderClient)
	sellerHandler := controller.NewSellerHandler(sellerService)

	// Register routes
	apiServer.RegisterRoutes(sellerHandler.RegisterRoutes)

	// Start server
	if err := apiServer.Start(); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}

func initDatabase(gormDB *gorm.DB) {
	db, err := gormDB.DB()
	if err != nil {
		log.Fatal("Unable to get generic DB from gorm: ", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}

	log.Println("DB: Successfully connected")
}
