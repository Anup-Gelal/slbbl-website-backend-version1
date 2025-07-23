package config

import (
	"fmt"
	"os"
	"time"
)

type Config struct {
	Server struct {
		Port         string
		Host         string
		ReadTimeout  time.Duration
		WriteTimeout time.Duration
	}

	Database struct {
		Host     string
		Port     string
		User     string
		Password string
		DBName   string
		SSLMode  string
	}

	JWT struct {
		Secret        string
		TokenExpiry   time.Duration
		RefreshExpiry time.Duration
	}

	Environment string
}

func Load() (*Config, error) {
	cfg := &Config{}

	// Server
	cfg.Server.Port = os.Getenv("SERVER_PORT")
	cfg.Server.Host = os.Getenv("SERVER_HOST")
	cfg.Server.ReadTimeout = 15 * time.Second
	cfg.Server.WriteTimeout = 15 * time.Second

	// Database
	cfg.Database.Host = os.Getenv("DB_HOST")
	cfg.Database.Port = os.Getenv("DB_PORT")
	cfg.Database.User = os.Getenv("DB_USER")
	cfg.Database.Password = os.Getenv("DB_PASSWORD")
	cfg.Database.DBName = os.Getenv("DB_NAME")
	cfg.Database.SSLMode = os.Getenv("DB_SSLMODE")

	// JWT
	cfg.JWT.Secret = os.Getenv("JWT_SECRET")
	cfg.JWT.TokenExpiry, _ = time.ParseDuration(os.Getenv("JWT_TOKEN_EXPIRY"))
	cfg.JWT.RefreshExpiry, _ = time.ParseDuration(os.Getenv("JWT_REFRESH_EXPIRY"))

	cfg.Environment = os.Getenv("ENVIRONMENT")

	return cfg, nil
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		c.Database.User,
		c.Database.Password,
		c.Database.Host,
		c.Database.Port,
		c.Database.DBName,
	)
}

/*
package config

import (
	"fmt"
	"time"
)

type Config struct {
	Server struct {
		Port         string
		Host         string
		ReadTimeout  time.Duration
		WriteTimeout time.Duration
	}

	Database struct {
		Host     string
		Port     string
		User     string
		Password string
		DBName   string
		SSLMode  string
	}

	JWT struct {
		Secret        string
		TokenExpiry   time.Duration
		RefreshExpiry time.Duration
	}

	Environment string
}

func Load() (*Config, error) {
	cfg := &Config{}

	// Server config
	cfg.Server.Port = "8080"
	cfg.Server.Host = "0.0.0.0"
	cfg.Server.ReadTimeout = 15 * time.Second
	cfg.Server.WriteTimeout = 15 * time.Second

	// Database config
	cfg.Database.Host = "localhost"
	cfg.Database.Port = "3306"
	cfg.Database.User = "root"
	cfg.Database.Password = "root"
	cfg.Database.DBName = "slbbladminserver"

	// JWT config
	cfg.JWT.Secret = "secret" 
	cfg.JWT.TokenExpiry = 24 * time.Hour
	cfg.JWT.RefreshExpiry = 7 * 24 * time.Hour

	cfg.Environment = "development"

	return cfg, nil
}

func (c *Config) GetDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		c.Database.User,
		c.Database.Password,
		c.Database.Host,
		c.Database.Port,
		c.Database.DBName,
	)
}
*/