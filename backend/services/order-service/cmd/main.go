package main

import (
	"fmt"
	"log"

	"github.com/Flow-Indo/ecommerce-mvp/services/order-service-go/cmd/api"
	"github.com/Flow-Indo/ecommerce-mvp/services/order-service-go/config"
	"github.com/Flow-Indo/ecommerce-mvp/services/order-service-go/db"
	"gorm.io/gorm"
)

func main() {

	fmt.Printf("config: %v", config.Envs.DB_HOST)
	database, err := db.NewPostgresStore()
	if err != nil {
		log.Fatal("Failed to connect to database: ", err)
	}

	initDatabase(database)
	apiServer := api.NewAPIServer(config.Envs.ORDER_SERVICE_PORT, database)

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
