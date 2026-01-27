package config

import (
	"github.com/Flow-Indo/LAKOO/backend/shared/env"
	"github.com/lpernett/godotenv"
)

type Config struct {
	SELLER_SERVICE_PORT string
	DB_USER             string
	DB_PASSWORD         string
	DB_NAME             string
	DB_HOST             string
	DB_PORT             string
	DB_SSL              string

	AWS_REGION            string
	AWS_S3_BUCKET         string
	AWS_ACCESS_KEY_ID     string
	AWS_SECRET_ACCESS_KEY string
	AWS_S3_PREFIX         string
}

func initConfig() *Config {
	godotenv.Load(".env")
	return &Config{
		SELLER_SERVICE_PORT: env.GetEnv("SELLER_SERVICE_PORT", ":3015"),
		DB_USER:             env.GetEnv("DB_USER", "user"),
		DB_PASSWORD:         env.GetEnv("DB_PASSWORD", "password"),
		DB_NAME:             env.GetEnv("DB_NAME", "dbname"),
		DB_HOST:             env.GetEnv("DB_HOST", "localhost"),
		DB_PORT:             env.GetEnv("DB_PORT", "5432"),
		DB_SSL:              env.GetEnv("DB_SSL", "disable"),

		AWS_REGION:            env.GetEnv("AWS_REGION", ""),
		AWS_S3_BUCKET:         env.GetEnv("AWS_S3_BUCKET", ""),
		AWS_ACCESS_KEY_ID:     env.GetEnv("AWS_ACCESS_KEY_ID", ""),
		AWS_SECRET_ACCESS_KEY: env.GetEnv("AWS_SECRET_ACCESS_KEY", ""),
		AWS_S3_PREFIX:         env.GetEnv("AWS_S3_PREFIX", "seller-verification/"),
	}
}

var Envs = initConfig()
