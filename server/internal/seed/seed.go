package seed

import (
	"database/sql"
	"log"
	"time"

	"slbbl/internal/models"
	"slbbl/internal/utils"
)

func SeedAdminUser(db *sql.DB) {
	adminUserID := "admin111"

	// Check if admin user already exists
	var exists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE userid = ?)", adminUserID).Scan(&exists)
	if err != nil {
		log.Println("❌ Failed to check admin:", err)
		return
	}

	if exists {
		log.Println("✅ Admin user already exists")
		return
	}

	// Create new admin user
	passwordHash, err := utils.HashPassword("slbbl1234")
	if err != nil {
		log.Println("❌ Failed to hash admin password:", err)
		return
	}

	query := `
		INSERT INTO users (userid, username, password_hash, role, is_approved, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`
	_, err = db.Exec(
		query,
		adminUserID,
		"superadmin",
		passwordHash,
		models.RoleAdmin,
		true,
		time.Now(),
		time.Now(),
	)

	if err != nil {
		log.Println("❌ Failed to create admin user:", err)
		return
	}

	log.Println("✅ Admin user created with user id:", adminUserID)
}
