package storage

import (
	"context"
	"fmt"
	"io"
	"path/filepath"

	"github.com/Flow-Indo/LAKOO/backend/services/seller-service/config"
	"github.com/aws/aws-sdk-go-v2/aws"
	awsConfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

// S3Uploader handles uploads to an S3 bucket.
type S3Uploader struct {
	client *s3.Client
	bucket string
	prefix string
}

// NewS3Uploader creates a new S3 uploader.
func NewS3Uploader() (*S3Uploader, error) {
	cfg, err := awsConfig.LoadDefaultConfig(context.TODO(), awsConfig.WithRegion(config.Envs.AWS_REGION))
	if err != nil {
		return nil, fmt.Errorf("failed to load aws config: %w", err)
	}

	client := s3.NewFromConfig(cfg)

	return &S3Uploader{
		client: client,
		bucket: config.Envs.AWS_S3_BUCKET,
		prefix: config.Envs.AWS_S3_PREFIX,
	}, nil
}

// UploadFile uploads a file to S3 and returns the s3 URI.
func (u *S3Uploader) UploadFile(ctx context.Context, sellerID, objectType, fileName string, file io.Reader) (string, error) {
	// Generate a unique key for the object to prevent collisions
	uniqueFileName := fmt.Sprintf("%s%s", uuid.New().String(), filepath.Ext(fileName))
	key := fmt.Sprintf("%s%s/%s/%s", u.prefix, objectType, sellerID, uniqueFileName)

	_, err := u.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket: aws.String(u.bucket),
		Key:    aws.String(key),
		Body:   file,
		ACL:    "private",
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload file to s3: %w", err)
	}

	// Return the S3 URI for storage in the database
	s3URI := fmt.Sprintf("s3://%s/%s", u.bucket, key)
	return s3URI, nil
}
