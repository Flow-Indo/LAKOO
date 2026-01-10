package config

import (
	"github.com/lpernett/godotenv"
)

type Config struct {
	NOTIFICATION_SERVICE_PORT string
	TWILIO_ACCOUNT_SID        string
	TWILIO_AUTH_TOKEN         string
	TWILIO_WHATSAPP_NUMBER    string
	VAPID_PUBLIC_KEY          string
	VAPID_PRIVATE_KEY         string
	VAPID_EMAIL               string
	KAFKA_BROKERS             []string
	KAFKA_GROUP_ID            string
	KAFKA_TOPICS              []string
}

var Envs = initConfig()

func initConfig() *Config {
	godotenv.Load("../.env")

	return &Config{
		NOTIFICATION_SERVICE_PORT: env.getEnv("NOTIFICATION_SERVICE_PORT", "3007"),
		TWILIO_ACCOUNT_SID:        env.getEnv("TWILIO_ACCOUNT_SID", "123"),
		TWILIO_AUTH_TOKEN:         env.getEnv("TWILIO_AUTH_TOKEN", "123"),
		TWILIO_WHATSAPP_NUMBER:    env.getEnv("TWILIO_WHATSAPP_NUMBER", "123"),
		VAPID_PUBLIC_KEY:          env.getEnv("VAPID_PUBLIC_KEY", "123"),
		VAPID_PRIVATE_KEY:         env.getEnv("VAPID_PRIVATE_KEY", "123"),
		VAPID_EMAIL:               env.getEnv("VAPID_EMAIL", "123@gmail.com"),
		KAFKA_BROKERS:             env.getEnvAsSlice("KAFKA_BROKERS", []string{"localhost:9092"}, ","),
		KAFKA_GROUP_ID:            env.getEnv("KAFKA_GROUP_ID", "kafka_group"),
		KAFKA_TOPICS:              env.getEnvAsSlice("KAFKA_TOPICS", []string{"kafka_topic"}, ","),
	}
}
