package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"slbbl/internal/models"
)

type AboutHandler struct {
	DB *sql.DB
}

func NewAboutHandler(db *sql.DB) *AboutHandler {
	return &AboutHandler{DB: db}
}

// --- MESSAGES (JSON CRUD as before) ---
func (h *AboutHandler) GetMessages(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, description, image_url FROM messages")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var m models.Message
		if err := rows.Scan(&m.ID, &m.Description, &m.ImageURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		messages = append(messages, m)
	}
	c.JSON(http.StatusOK, messages)
}

func (h *AboutHandler) AdminGetMessages(c *gin.Context) {
	h.GetMessages(c) // same as public
}


func (h *AboutHandler) AdminCreateMessage(c *gin.Context) {
	description := c.PostForm("description")

	// Validate description
	if description == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Description is required"})
		return
	}

	// Handle image file upload (optional)
	file, err := c.FormFile("image")
	var imageURL string
	if err == nil && file != nil {
		filename := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))
		savePath := "./uploads/about/messages/" + filename

		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		imageURL = "about/messages/" + filename
	}

	_, err = h.DB.Exec("INSERT INTO messages (description, image_url) VALUES (?, ?)", description, imageURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Message created"})
}

func (h *AboutHandler) AdminUpdateMessage(c *gin.Context) {
	id := c.Param("id")
	description := c.PostForm("description")

	// Validate description
	if description == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Description is required"})
		return
	}

	// Handle image file upload (optional)
	file, err := c.FormFile("image")
	var imageURL string

	if err == nil && file != nil {
		// Save new image and update imageURL
		filename := fmt.Sprintf("%d_%s", time.Now().Unix(), filepath.Base(file.Filename))
		savePath := "./uploads/about/messages/" + filename

		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
			return
		}
		imageURL = "about/messages/" + filename

		// Update description and image_url in DB
		_, err = h.DB.Exec("UPDATE messages SET description=?, image_url=? WHERE id=?", description, imageURL, id)
	} else {
		// No new image, only update description
		_, err = h.DB.Exec("UPDATE messages SET description=? WHERE id=?", description, id)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Message updated"})
}


func (h *AboutHandler) AdminDeleteMessage(c *gin.Context) {
	id := c.Param("id")
	_, err := h.DB.Exec("DELETE FROM messages WHERE id=?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Message deleted"})
}

// --- VISION, OBJECTIVE, ABOUT (Singleton id=1) ---
func (h *AboutHandler) GetAboutVision(c *gin.Context) {
	var v models.AboutVision
	err := h.DB.QueryRow("SELECT id, vision, objective, about FROM about_vision WHERE id=1").Scan(&v.ID, &v.Vision, &v.Objective, &v.About)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, v)
}

func (h *AboutHandler) AdminGetAboutVision(c *gin.Context) {
	h.GetAboutVision(c)
}

func (h *AboutHandler) AdminCreateAboutVision(c *gin.Context) {
	var v models.AboutVision
	if err := c.ShouldBindJSON(&v); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var exists bool
	err := h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM about_vision WHERE id=1)").Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if exists {
		c.JSON(http.StatusConflict, gin.H{"error": "Vision record already exists"})
		return
	}
	_, err = h.DB.Exec("INSERT INTO about_vision (id, vision, objective, about) VALUES (1, ?, ?, ?)", v.Vision, v.Objective, v.About)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Vision record created"})
}

func (h *AboutHandler) AdminUpdateAboutVision(c *gin.Context) {
	var v models.AboutVision
	if err := c.ShouldBindJSON(&v); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var exists bool
	err := h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM about_vision WHERE id=1)").Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vision record does not exist, create it first"})
		return
	}
	_, err = h.DB.Exec("UPDATE about_vision SET vision=?, objective=?, about=? WHERE id=1", v.Vision, v.Objective, v.About)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "About vision updated"})
}

func (h *AboutHandler) AdminDeleteAboutVision(c *gin.Context) {
	c.JSON(http.StatusMethodNotAllowed, gin.H{"error": "Deleting the vision record is not allowed"})
}

// --- STATS ---
func (h *AboutHandler) GetStats(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, title, value, icon_url FROM about_stats")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var stats []models.AboutStat
	for rows.Next() {
		var s models.AboutStat
		if err := rows.Scan(&s.ID, &s.Title, &s.Value, &s.IconURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		stats = append(stats, s)
	}
	c.JSON(http.StatusOK, stats)
}

func (h *AboutHandler) AdminGetStats(c *gin.Context) {
	h.GetStats(c)
}

func (h *AboutHandler) AdminCreateStat(c *gin.Context) {
	title := c.PostForm("title")
	value := c.PostForm("value")

	// Handle file upload
	file, err := c.FormFile("icon")
	var iconURL string
	if err == nil {
		// Save file with unique name
		ext := filepath.Ext(file.Filename)
		iconFileName := fmt.Sprintf("stat_icon_%d%s", time.Now().UnixNano(), ext)
		savePath := filepath.Join("uploads/about/stats", iconFileName)
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save icon file"})
			return
		}
		iconURL = iconFileName
	}

	if title == "" || value == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title and Value are required"})
		return
	}

	_, err = h.DB.Exec("INSERT INTO about_stats (title, value, icon_url) VALUES (?, ?, ?)", title, value, iconURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Stat created"})
}

func (h *AboutHandler) AdminUpdateStat(c *gin.Context) {
	id := c.Param("id")

	title := c.PostForm("title")
	value := c.PostForm("value")

	// Fetch existing icon_url first
	var existingIconURL string
	err := h.DB.QueryRow("SELECT icon_url FROM about_stats WHERE id=?", id).Scan(&existingIconURL)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Stat not found"})
		return
	}

	// Handle optional file upload
	file, errFile := c.FormFile("icon")
	iconURL := existingIconURL
	if errFile == nil {
		// Save new icon file and update iconURL
		ext := filepath.Ext(file.Filename)
		iconFileName := fmt.Sprintf("stat_icon_%d%s", time.Now().UnixNano(), ext)
		savePath := filepath.Join("uploads/about/stats", iconFileName)
		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save icon file"})
			return
		}
		iconURL = iconFileName
	}

	if title == "" || value == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title and Value are required"})
		return
	}

	_, err = h.DB.Exec("UPDATE about_stats SET title=?, value=?, icon_url=? WHERE id=?", title, value, iconURL, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Stat updated"})
}

func (h *AboutHandler) AdminDeleteStat(c *gin.Context) {
	id := c.Param("id")
	_, err := h.DB.Exec("DELETE FROM about_stats WHERE id=?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Stat deleted"})
}


// --- SLIDES ---
// Get slides (list)
func (h *AboutHandler) AdminGetSlides(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, image_url FROM about_slides ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var slides []models.Slide
	for rows.Next() {
		var s models.Slide
		if err := rows.Scan(&s.ID, &s.ImageURL); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		slides = append(slides, s)
	}
	c.JSON(http.StatusOK, slides)
}

func (h *AboutHandler) AdminUploadSlideImage(c *gin.Context) {
	// Only POST to upload new slide

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required"})
		return
	}

	ext := filepath.Ext(file.Filename)
	newFileName := fmt.Sprintf("slide_%d%s", time.Now().UnixNano(), ext)
	savePath := filepath.Join("uploads/about/slides", newFileName)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	_, err = h.DB.Exec("INSERT INTO about_slides (image_url) VALUES (?)", newFileName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert slide record"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Slide uploaded"})
}

func (h *AboutHandler) AdminUpdateSlide(c *gin.Context) {
	id := c.Param("id")

	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image file is required for update"})
		return
	}

	// Save new image
	ext := filepath.Ext(file.Filename)
	newFileName := fmt.Sprintf("slide_%d%s", time.Now().UnixNano(), ext)
	savePath := filepath.Join("uploads/about/slides", newFileName)

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	// Update DB record with new image_url
	_, err = h.DB.Exec("UPDATE about_slides SET image_url=? WHERE id=?", newFileName, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update slide record"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Slide updated"})
}

func (h *AboutHandler) AdminDeleteSlide(c *gin.Context) {
	id := c.Param("id")
	_, err := h.DB.Exec("DELETE FROM about_slides WHERE id=?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete slide"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Slide deleted"})
}
// --- CEO IMAGE HANDLING ---
// Get CEO info (assuming singleton id=1 in about_info table)
func (h *AboutHandler) GetCEOInfo(c *gin.Context) {
	var ceoImageURL, ceoName, ceoDescription string
	err := h.DB.QueryRow("SELECT ceo_image_url, ceo_name, ceo_description FROM about_info WHERE id=1").Scan(&ceoImageURL, &ceoName, &ceoDescription)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "CEO info not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"ceo_image_url":    ceoImageURL,
		"ceo_name":         ceoName,
		"ceo_description":  ceoDescription,
	})
}

// Update CEO text info (name, description)
func (h *AboutHandler) AdminUpdateCEOInfo(c *gin.Context) {
	var payload struct {
		CEOName        string `json:"ceo_name"`
		CEODescription string `json:"ceo_description"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec("UPDATE about_info SET ceo_name=?, ceo_description=? WHERE id=1", payload.CEOName, payload.CEODescription)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "CEO info updated"})
}

// Upload CEO image (multipart/form-data)
func (h *AboutHandler) AdminUploadCEOImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "CEO image file is required"})
		return
	}

	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
	savePath := "./uploads/about/ceo/" + filename

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save CEO image"})
		return
	}

	// Update CEO image path in DB
	_, err = h.DB.Exec("UPDATE about_info SET ceo_image_url=? WHERE id=1", filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update CEO image in DB"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":   "CEO image uploaded",
		"image_url": "/uploads/about/ceo/" + filename,
	})
}
