package main

import (
	"log"
	"time"

	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/clients"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/config"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/db"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/internal/controller"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/internal/repository"
	"github.com/Flow-Indo/LAKOO/backend/services/cart-service/internal/service"
	"github.com/Flow-Indo/LAKOO/backend/shared/go/api"
	"gorm.io/gorm"
)

func main() {
	database, err := db.NewPostgresStore()
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	initDatabase(database)

	apiServer := api.NewServer(api.ServerConfig{
		Addr:        config.Envs.CART_SERVICE_PORT,
		DB:          database,
		ServiceName: "cart-service",
		APIPrefix:   "cart",
	})

	productClient := clients.NewProductHTTPClient(clients.ProductHTTPClientConfig{
		ProductServiceURL: config.Envs.PRODUCT_SERVICE_URL,
		Timeout:           5 * time.Second,
		ServiceName:       "product-service",
		ServiceSecret:     config.Envs.SERVICE_SECRET,
	})

	cartRepository := repository.NewCartRepository(database)
	cartService := service.NewCartService(cartRepository, productClient, service.CartServiceConfig{
		ProductServiceTimeout: 5 * time.Second,
	})
	cartHandler := controller.NewCartHandler(cartService)
	apiServer.RegisterRoutes(cartHandler.RegisterRoutes)

	if err := apiServer.Start(); err != nil {
		log.Fatal("Failed to start server: ", err)
	}

}

func initDatabase(gorm_Db *gorm.DB) {
	db, err := gorm_Db.DB()

	if err != nil {
		log.Fatal("Unable to get generic DB from gorm: ", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("Unable to connect to database: ", err)
	}

	log.Println("DB: Successfully connected")
}
