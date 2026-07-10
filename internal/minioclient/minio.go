package minioclient

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"path/filepath"
	"strings"
	"time"

	"lldance_backend/config"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var Client *minio.Client

func Init() error {
	cfg := config.AppConfig
	if cfg.MinioEndpoint == "" {
		log.Println("MinIO not configured, uploads disabled")
		return nil
	}

	c, err := minio.New(cfg.MinioEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.MinioAccessKey, cfg.MinioSecretKey, ""),
		Secure: cfg.MinioUseSSL,
	})
	if err != nil {
		return err
	}
	Client = c

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	exists, err := c.BucketExists(ctx, cfg.MinioBucket)
	if err != nil {
		return err
	}
	if !exists {
		if err := c.MakeBucket(ctx, cfg.MinioBucket, minio.MakeBucketOptions{}); err != nil {
			return err
		}
	}

	policy := fmt.Sprintf(`{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"AWS":["*"]},"Action":["s3:GetObject"],"Resource":["arn:aws:s3:::%s/*"]}]}`, cfg.MinioBucket)
	if err := c.SetBucketPolicy(ctx, cfg.MinioBucket, policy); err != nil {
		log.Printf("Warning: failed to set bucket policy: %v", err)
	}
	return nil
}

func Upload(file multipart.File, filename, contentType string) (string, error) {
	cfg := config.AppConfig
	if Client == nil {
		return "", fmt.Errorf("minio client not initialized")
	}

	ext := filepath.Ext(filename)
	key := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	_, err := Client.PutObject(ctx, cfg.MinioBucket, key, file, -1, minio.PutObjectOptions{
		ContentType: contentType,
	})
	if err != nil {
		return "", err
	}

	base := strings.TrimRight(cfg.MinioPublicURL, "/")
	if base == "" {
		scheme := "http"
		if cfg.MinioUseSSL {
			scheme = "https"
		}
		base = fmt.Sprintf("%s://%s", scheme, cfg.MinioEndpoint)
	}
	return fmt.Sprintf("%s/%s/%s", base, cfg.MinioBucket, key), nil
}
