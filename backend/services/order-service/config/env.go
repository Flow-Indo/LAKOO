package config

import (
	"log"
	"os"

	"github.com/lpernett/godotenv"
)

type Config struct {
	ORDER_SERVICE_PORT string
	DB_HOST            string
	DB_USER            string
	DB_PASSWORD        string
	DB_NAME            string
	DB_PORT            string
	DB_SSL             string
	KAFKA_BROKERS      string
}

var Envs = initConfig()

func initConfig() *Config {
	godotenv.Load("../.env")

	return &Config{
		ORDER_SERVICE_PORT: getEnv("ORDER_SERVICE_PORT", "3006"),
		DB_HOST:            getEnv("DB_HOST", "localhost"),
		DB_USER:            getEnv("DB_USER", "postgres"),
		DB_PASSWORD:        getEnv("DB_PASSWORD", "password"),
		DB_NAME:            getEnv("DB_NAME", "orderdb"),
		DB_PORT:            getEnv("DB_PORT", "5432"),
		DB_SSL:             getEnv("DB_SSL", "DISABLED"),
		KAFKA_BROKERS:      getEnv("KAFKA_BROKERS", "localhost:9092"),
	}
}

func getEnv(key string, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		log.Println("Value: ", value)
		return value
	}

	log.Println("Returning feedback")
	return fallback
}
