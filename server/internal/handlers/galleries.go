package handlers

import (
    "database/sql"
    "log"
    "net/http"
    "path/filepath"
    "strings"

    "github.com/gin-gonic/gin"
    "slbbl/internal/models"
)

type GalleryHandler struct { DB *sql.DB }

func NewGalleryHandler(db *sql.DB) *GalleryHandler {
    return &GalleryHandler{DB: db}
}

// Common method for both public and admin routes
func (h *GalleryHandler) respondWithAll(c *gin.Context) {
    log.Println("📣 GET galleries")
    rows, err := h.DB.Query("SELECT id, title, date, image_paths FROM galleries ORDER BY date DESC")
    if err != nil {
        log.Println("DB query error:", err)
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var galleries []models.Gallery
    for rows.Next() {
        var g models.Gallery
        var imagePaths string
        if err := rows.Scan(&g.ID, &g.Title, &g.Date, &imagePaths); err != nil {
            log.Println("row scan error:", err)
            continue
        }
        g.ImagePaths = strings.Split(imagePaths, ",")
        galleries = append(galleries, g)
    }
    // Always return an array—even empty :contentReference[oaicite:1]{index=1}
    c.JSON(http.StatusOK, galleries)
}

func (h *GalleryHandler) GetAllPublicGalleries(c *gin.Context) { h.respondWithAll(c) }
func (h *GalleryHandler) GetAllGalleries(c *gin.Context)       { h.respondWithAll(c) }


func (h *GalleryHandler) UploadGalleryImages(c *gin.Context) {
  title := c.PostForm("title")
  date := c.PostForm("date")

  form, err := c.MultipartForm()
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid form data"})
    return
  }
  files := form.File["images"]
  if len(files) == 0 {
    c.JSON(http.StatusBadRequest, gin.H{"error": "No images uploaded"})
    return
  }

  var imagePaths []string
  for _, file := range files {
    fname := filepath.Base(file.Filename)
    fullPath := filepath.Join("uploads", "galleries", fname)
    if err := c.SaveUploadedFile(file, fullPath); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
      return
    }
    imagePaths = append(imagePaths, fullPath)
  }

  // INSERT into DB
  joined := strings.Join(imagePaths, ",")
  res, err := h.DB.Exec(
    "INSERT INTO galleries (title, date, image_paths) VALUES (?, ?, ?)",
    title, date, joined,
  )
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  insertedID, _ := res.LastInsertId()

  c.JSON(http.StatusOK, gin.H{
    "id":         insertedID,
    "imagePaths": imagePaths,
  })
}

// UpdateGallery updates an existing gallery's details.
func (h *GalleryHandler) UpdateGallery(c *gin.Context) {
	id := c.Param("id")
	var gallery models.Gallery
	if err := c.ShouldBindJSON(&gallery); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Update gallery in the database
	_, err := h.DB.Exec("UPDATE galleries SET title = ?, date = ?, image_paths = ? WHERE id = ?",
		gallery.Title, gallery.Date, strings.Join(gallery.ImagePaths, ","), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Gallery updated successfully"})
}

// DeleteGallery deletes a gallery by its ID.
func (h *GalleryHandler) DeleteGallery(c *gin.Context) {
	id := c.Param("id")
	_, err := h.DB.Exec("DELETE FROM galleries WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Gallery deleted successfully"})
}
