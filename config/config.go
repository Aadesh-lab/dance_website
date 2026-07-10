package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port           string
	Env            string
	DBUser         string
	DBPassword     string
	DBName         string
	DBHost         string
	DBPort         string
	DBSchema       string
	JWTSecret      string
	AdminUsername  string
	AdminPassword  string
	MinioEndpoint  string
	MinioAccessKey string
	MinioSecretKey string
	MinioBucket    string
	MinioPublicURL string
	MinioUseSSL    bool
}

var AppConfig *Config

func LoadConfig() {
	godotenv.Load()

	env := os.Getenv("ENV")
	fmt.Printf("env: %s\n", env)
	if env == "" {
		env = "development"
	} else {
		godotenv.Overload(".env." + env)
	}

	useSSL, _ := strconv.ParseBool(getEnvDefault("MINIO_USE_SSL", "false"))

	AppConfig = &Config{
		Port:           os.Getenv("PORT"),
		Env:            os.Getenv("ENV"),
		DBUser:         os.Getenv("DB_USER"),
		DBPassword:     os.Getenv("DB_PASSWORD"),
		DBName:         os.Getenv("DB_NAME"),
		DBHost:         os.Getenv("DB_HOST"),
		DBPort:         os.Getenv("DB_PORT"),
		DBSchema:       os.Getenv("DB_SCHEMA"),
		JWTSecret:      os.Getenv("JWT_SECRET"),
		AdminUsername:  os.Getenv("ADMIN_USERNAME"),
		AdminPassword:  os.Getenv("ADMIN_PASSWORD"),
		MinioEndpoint:  os.Getenv("MINIO_ENDPOINT"),
		MinioAccessKey: os.Getenv("MINIO_ACCESS_KEY"),
		MinioSecretKey: os.Getenv("MINIO_SECRET_KEY"),
		MinioBucket:    os.Getenv("MINIO_BUCKET"),
		MinioPublicURL: os.Getenv("MINIO_PUBLIC_URL"),
		MinioUseSSL:    useSSL,
	}
	if AppConfig.JWTSecret == "" {
		AppConfig.JWTSecret = "your-very-secret-key"
	}
	if AppConfig.Port == "" {
		AppConfig.Port = "8080"
	}
	if AppConfig.MinioBucket == "" {
		AppConfig.MinioBucket = "lldance"
	}
}

func getEnvDefault(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
