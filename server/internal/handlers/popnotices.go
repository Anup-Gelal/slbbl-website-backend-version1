package handlers

import (
	"database/sql"
	"net/http"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"slbbl/internal/models"
	"slbbl/internal/utils"
)

type PopupNoticeHandler struct {
	DB         *sql.DB
	UploadPath string
}

func NewPopupNoticeHandler(db *sql.DB, uploadPath string) *PopupNoticeHandler {
	return &PopupNoticeHandler{DB: db, UploadPath: uploadPath}
}

// Create popup notice (Admin)
func (h *PopupNoticeHandler) CreatePopupNotice(c *gin.Context) {
	noticeName := c.PostForm("notice_name")
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
		return
	}

	filename := utils.GenerateUniqueFilename(file.Filename)
	savePath := filepath.Join(h.UploadPath, filename)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	imageURL := "uploads/popup_notices/" + filename
	createdAt := time.Now()

	_, err = h.DB.Exec(
		`INSERT INTO popup_notices (notice_name, image_url, created_at) VALUES (?, ?, ?)`,
		noticeName, imageURL, createdAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"notice_name": noticeName,
		"image_url":   imageURL,
		"created_at":  createdAt,
	})
}

// Get all popup notices (public)
func (h *PopupNoticeHandler) GetAllPopupNotices(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, notice_name, image_url, created_at FROM popup_notices ORDER BY created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to query notices"})
		return
	}
	defer rows.Close()

	var notices []models.PopupNotice
	for rows.Next() {
		var notice models.PopupNotice
		if err := rows.Scan(&notice.ID, &notice.NoticeName, &notice.ImageURL, &notice.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning notice"})
			return
		}
		notices = append(notices, notice)
	}

	c.JSON(http.StatusOK, notices)
}

// Update popup notice (Admin)
func (h *PopupNoticeHandler) UpdatePopupNotice(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))

	noticeName := c.PostForm("notice_name")
	file, _ := c.FormFile("image")

	var imageURL string
	if file != nil {
		filename := utils.GenerateUniqueFilename(file.Filename)
		savePath := filepath.Join(h.UploadPath, filename)
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
			return
		}
		imageURL = "uploads/popup_notices/" + filename
	}

	query := `UPDATE popup_notices SET notice_name = ?, image_url = COALESCE(?, image_url) WHERE id = ?`
	_, err := h.DB.Exec(query, noticeName, sql.NullString{String: imageURL, Valid: imageURL != ""}, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notice updated"})
}

// Delete popup notice (Admin)
func (h *PopupNoticeHandler) DeletePopupNotice(c *gin.Context) {
	id := c.Param("id")

	_, err := h.DB.Exec(`DELETE FROM popup_notices WHERE id = ?`, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete notice"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Notice deleted"})
}

func (h *PopupNoticeHandler) GetLatestPopupNotice(c *gin.Context) {
	var notice models.PopupNotice

	query := `SELECT id, notice_name, image_url, created_at FROM popup_notices ORDER BY created_at DESC LIMIT 1`
	row := h.DB.QueryRow(query)

	err := row.Scan(&notice.ID, &notice.NoticeName, &notice.ImageURL, &notice.CreatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "No popup notice found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch popup notice"})
		}
		return
	}

	c.JSON(http.StatusOK, notice)
}
