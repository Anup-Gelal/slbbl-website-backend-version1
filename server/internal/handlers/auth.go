package handlers

import (
	"database/sql"
	"net/http"
	"slbbl/internal/models"
	"slbbl/internal/utils"
	"time"
     "encoding/csv"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type AuthHandler struct {
	DB        *sql.DB
	JWTSecret []byte
}

func NewAuthHandler(db *sql.DB, secret []byte) *AuthHandler {
	return &AuthHandler{DB: db, JWTSecret: secret}
}

// Login authenticates the user and returns a JWT
func (h *AuthHandler) Login(c *gin.Context) {
	var creds models.LoginInput
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var user models.User
	query := `SELECT id, userid, username, password_hash, role, is_approved, created_at, updated_at FROM users WHERE userid = ?`
	err := h.DB.QueryRow(query, creds.UserID).Scan(
		&user.ID, &user.UserID, &user.Username, &user.PasswordHash,
		&user.Role, &user.IsApproved, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil || !utils.CheckPasswordHash(creds.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !user.IsApproved {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Account not yet approved by admin"})
		return
	}

	// Log successful login
	_, _ = h.DB.Exec(`INSERT INTO login_logs (user_id, timestamp, ip) VALUES (?, ?, ?)`,
		user.UserID, time.Now(), c.ClientIP())

	// Create JWT
	claims := jwt.MapClaims{
		"user_id": user.ID,
		"userid":  user.UserID,
		"role":    string(user.Role),
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(h.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": signedToken})
}

// Register creates a new user but marks them as unapproved
func (h *AuthHandler) Register(c *gin.Context) {
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := input.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hashing failed"})
		return
	}

	query := `INSERT INTO users (userid, username, password_hash, role, is_approved, created_at, updated_at) 
	          VALUES (?, ?, ?, ?, ?, NOW(), NOW())`
	_, err = h.DB.Exec(query, input.UserID, input.Username, hashed, models.RoleAccessedUser, false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User creation failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registration successful. Awaiting admin approval."})
}

// ApproveUser allows admin to approve a user by ID
func (h *AuthHandler) ApproveUser(c *gin.Context) {
	userID := c.Param("id")
	query := `UPDATE users SET is_approved = true, updated_at = NOW() WHERE id = ?`
	res, err := h.DB.Exec(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve user"})
		return
	}

	affected, _ := res.RowsAffected()
	if affected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Log admin action
	adminID, _ := c.Get("userid")
	_, _ = h.DB.Exec(`INSERT INTO admin_logs (admin_id, action, target_id, timestamp) VALUES (?, ?, ?, ?)`,
		adminID, "approve_user", userID, time.Now())

	c.JSON(http.StatusOK, gin.H{"message": "User approved"})
}

// GetPendingUsers returns a list of unapproved users
func (h *AuthHandler) GetPendingUsers(c *gin.Context) {
	query := `SELECT id, userid, username, role, created_at FROM users WHERE is_approved = false`
	rows, err := h.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer rows.Close()

	var result []gin.H
	for rows.Next() {
		var id uint
		var userid, username, role string
		var created time.Time
		err := rows.Scan(&id, &userid, &username, &role, &created)
		if err != nil {
			continue
		}
		result = append(result, gin.H{
			"id":       id,
			"userid":   userid,
			"username": username,
			"role":     role,
			"created":  created,
		})
	}

	c.JSON(http.StatusOK, gin.H{"pending_users": result})
}

// GetApprovedUsers returns a list of approved users
func (h *AuthHandler) GetApprovedUsers(c *gin.Context) {
	query := `SELECT id, userid, username, role, created_at FROM users WHERE is_approved = true`
	rows, err := h.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch approved users"})
		return
	}
	defer rows.Close()

	var result []gin.H
	for rows.Next() {
		var id uint
		var userid, username, role string
		var created time.Time
		err := rows.Scan(&id, &userid, &username, &role, &created)
		if err != nil {
			continue
		}
		result = append(result, gin.H{
			"id":       id,
			"userid":   userid,
			"username": username,
			"role":     role,
			"created":  created,
		})
	}

	c.JSON(http.StatusOK, gin.H{"approved_users": result})
}

// GetLoginLogs returns all login logs
func (h *AuthHandler) GetLoginLogs(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, user_id, timestamp, ip FROM login_logs ORDER BY timestamp DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch login logs"})
		return
	}
	defer rows.Close()

	var logs []models.LoginLog
	for rows.Next() {
		var log models.LoginLog
		if err := rows.Scan(&log.ID, &log.UserID, &log.Timestamp, &log.IP); err != nil {
			continue
		}
		logs = append(logs, log)
	}
	c.JSON(http.StatusOK, logs)
}

// GetAdminLogs returns admin action logs
func (h *AuthHandler) GetAdminLogs(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, admin_id, action, target_id, timestamp FROM admin_logs ORDER BY timestamp DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch admin logs"})
		return
	}
	defer rows.Close()

	var logs []models.AdminActionLog
	for rows.Next() {
		var log models.AdminActionLog
		if err := rows.Scan(&log.ID, &log.AdminID, &log.Action, &log.TargetID, &log.Timestamp); err != nil {
			continue
		}
		logs = append(logs, log)
	}
	c.JSON(http.StatusOK, logs)
}

func (h *AuthHandler) GetLoginLogsCSV(c *gin.Context) {
	userID := c.Query("user_id")
	start := c.Query("start") // format: 2025-07-01
	end := c.Query("end")     // format: 2025-07-13

	query := `SELECT user_id, timestamp, ip FROM login_logs WHERE 1=1`
	args := []interface{}{}

	if userID != "" {
		query += " AND user_id = ?"
		args = append(args, userID)
	}
	if start != "" && end != "" {
		query += " AND DATE(timestamp) BETWEEN ? AND ?"
		args = append(args, start, end)
	}

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed"})
		return
	}
	defer rows.Close()

	c.Header("Content-Disposition", "attachment; filename=login_logs.csv")
	c.Header("Content-Type", "text/csv")

	w := csv.NewWriter(c.Writer)
	defer w.Flush()

	_ = w.Write([]string{"User ID", "Timestamp", "IP Address"})

	for rows.Next() {
		var userID, ip string
		var timestamp time.Time
		if err := rows.Scan(&userID, &timestamp, &ip); err == nil {
			_ = w.Write([]string{
				userID,
				timestamp.Format("2006-01-02 15:04:05"),
				ip,
			})
		}
	}
}

func (h *AuthHandler) GetAdminLogsCSV(c *gin.Context) {
	adminID := c.Query("admin_id")
	start := c.Query("start")
	end := c.Query("end")

	query := `SELECT admin_id, action, target_id, timestamp FROM admin_logs WHERE 1=1`
	args := []interface{}{}

	if adminID != "" {
		query += " AND admin_id = ?"
		args = append(args, adminID)
	}
	if start != "" && end != "" {
		query += " AND DATE(timestamp) BETWEEN ? AND ?"
		args = append(args, start, end)
	}

	rows, err := h.DB.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed"})
		return
	}
	defer rows.Close()

	c.Header("Content-Disposition", "attachment; filename=admin_logs.csv")
	c.Header("Content-Type", "text/csv")

	w := csv.NewWriter(c.Writer)
	defer w.Flush()

	_ = w.Write([]string{"Admin ID", "Action", "Target ID", "Timestamp"})

	for rows.Next() {
		var adminID, action, targetID string
		var timestamp time.Time
		if err := rows.Scan(&adminID, &action, &targetID, &timestamp); err == nil {
			_ = w.Write([]string{
				adminID, action, targetID,
				timestamp.Format("2006-01-02 15:04:05"),
			})
		}
	}
}



/*
package handlers

import (
	"database/sql"
	"net/http"
	"slbbl/internal/models"
	"slbbl/internal/utils"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type AuthHandler struct {
	DB        *sql.DB
	JWTSecret []byte
}

func NewAuthHandler(db *sql.DB, secret []byte) *AuthHandler {
	return &AuthHandler{DB: db, JWTSecret: secret}
}

// Login authenticates the user and returns a JWT
func (h *AuthHandler) Login(c *gin.Context) {
	var creds models.LoginInput
	if err := c.ShouldBindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var user models.User
	query := `SELECT id, userid, username, password_hash, role, is_approved, created_at, updated_at FROM users WHERE userid = ?`
	err := h.DB.QueryRow(query, creds.UserID).Scan(
		&user.ID, &user.UserID, &user.Username, &user.PasswordHash,
		&user.Role, &user.IsApproved, &user.CreatedAt, &user.UpdatedAt,
	)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if !user.IsApproved {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Account not yet approved by admin"})
		return
	}

	if !utils.CheckPasswordHash(creds.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"userid":  user.UserID,
		"role":    string(user.Role),
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(h.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": signedToken})
}

// Register creates a new user but marks them as unapproved
func (h *AuthHandler) Register(c *gin.Context) {
	var input models.RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	if err := input.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hashed, err := utils.HashPassword(input.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password hashing failed"})
		return
	}

	query := `INSERT INTO users (userid, username, password_hash, role, is_approved, created_at, updated_at) 
	          VALUES (?, ?, ?, ?, ?, NOW(), NOW())`
	_, err = h.DB.Exec(query, input.UserID, input.Username, hashed, models.RoleAccessedUser, false)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User creation failed"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Registration successful. Awaiting admin approval."})
}

// ApproveUser allows admin to approve a user by ID
func (h *AuthHandler) ApproveUser(c *gin.Context) {
	userID := c.Param("id")
	query := `UPDATE users SET is_approved = true, updated_at = NOW() WHERE id = ?`
	res, err := h.DB.Exec(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to approve user"})
		return
	}

	affected, _ := res.RowsAffected()
	if affected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User approved"})
}

// GetPendingUsers returns a list of unapproved users
func (h *AuthHandler) GetPendingUsers(c *gin.Context) {
	query := `SELECT id, userid, username, role, created_at FROM users WHERE is_approved = false`
	rows, err := h.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch users"})
		return
	}
	defer rows.Close()

	var result []gin.H
	for rows.Next() {
		var id uint
		var userid, username, role string
		var created time.Time
		err := rows.Scan(&id, &userid, &username, &role, &created)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan failed"})
			return
		}
		result = append(result, gin.H{
			"id":       id,
			"userid":   userid,
			"username": username,
			"role":     role,
			"created":  created,
		})
	}

	c.JSON(http.StatusOK, gin.H{"pending_users": result})
}

// GetApprovedUsers returns a list of approved users
func (h *AuthHandler) GetApprovedUsers(c *gin.Context) {
	query := `SELECT id, userid, username, role, created_at FROM users WHERE is_approved = true`
	rows, err := h.DB.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch approved users"})
		return
	}
	defer rows.Close()

	var result []gin.H
	for rows.Next() {
		var id uint
		var userid, username, role string
		var created time.Time
		err := rows.Scan(&id, &userid, &username, &role, &created)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan failed"})
			return
		}
		result = append(result, gin.H{
			"id":       id,
			"userid":   userid,
			"username": username,
			"role":     role,
			"created":  created,
		})
	}

	c.JSON(http.StatusOK, gin.H{"approved_users": result})
}
*/