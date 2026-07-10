package db

import (
	"fmt"
	"lldance_backend/config"
	"log"
	"os"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToDB() {
	dsn := buildDSN()

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Failed to get underlying sql.DB: %v", err)
	}
	sqlDB.SetMaxIdleConns(0)
	sqlDB.SetConnMaxIdleTime(30 * time.Second)
	sqlDB.SetConnMaxLifetime(5 * time.Minute)
	sqlDB.SetMaxOpenConns(10)
}

// buildDSN prefers DATABASE_URL (as Railway's Postgres plugin exposes it),
// falls back to individual DB_* env vars for local dev.
func buildDSN() string {
	if url := os.Getenv("DATABASE_URL"); url != "" {
		return url
	}
	c := config.AppConfig
	schema := c.DBSchema
	if schema == "" {
		schema = "public"
	}
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s search_path=%s sslmode=disable TimeZone=Asia/Kolkata",
		c.DBHost, c.DBUser, c.DBPassword, c.DBName, c.DBPort, schema,
	)
}
