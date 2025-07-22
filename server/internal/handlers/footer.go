package handlers

import (
  "database/sql"
  "net/http"
  "path/filepath"
  "github.com/gin-gonic/gin"
  "slbbl/internal/models"
)

// ----- Downloads -----

type DownloadHandler struct {
  DB         *sql.DB
  UploadPath string
}

func NewDownloadHandler(db *sql.DB, uploadPath string) *DownloadHandler {
  return &DownloadHandler{DB: db, UploadPath: uploadPath}
}

func (h *DownloadHandler) GetAllDownloads(c *gin.Context) {
  rows, err := h.DB.Query("SELECT id, title, file_path FROM footer_downloads ORDER BY created_at DESC")
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var items []models.Download
  for rows.Next() {
    var d models.Download
    if err := rows.Scan(&d.ID, &d.Title, &d.FilePath); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }
    items = append(items, d)
  }
  c.JSON(http.StatusOK, items)
}

func (h *DownloadHandler) CreateDownloads(c *gin.Context) {
  title := c.PostForm("title")
  file, err := c.FormFile("file")
  if err != nil || title == "" {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Title and file required"})
    return
  }
  filename := filepath.Base(file.Filename)
  dest := filepath.Join(h.UploadPath, filename)
  if err := c.SaveUploadedFile(file, dest); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
    return
  }
  path := "/uploads/downloads/" + filename
  _, err = h.DB.Exec("INSERT INTO footer_downloads(title, file_path) VALUES (?, ?)", title, path)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusCreated, gin.H{"message": "Created"})
}

func (h *DownloadHandler) DeleteDownloads(c *gin.Context) {
  id := c.Param("id")
  _, err := h.DB.Exec("DELETE FROM footer_downloads WHERE id = ?", id)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

// ----- Spokespersons -----

type SpokespersonHandler struct {
  DB         *sql.DB
  UploadPath string
}

func NewSpokespersonHandler(db *sql.DB, uploadPath string) *SpokespersonHandler {
  return &SpokespersonHandler{DB: db, UploadPath: uploadPath}
}

func (h *SpokespersonHandler) GetAllSpokePerson(c *gin.Context) {
  rows, err := h.DB.Query("SELECT id, name, role, phone, email, image_path FROM footer_spokespersons ORDER BY created_at DESC")
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var list []models.Spokesperson
  for rows.Next() {
    var s models.Spokesperson
    if err := rows.Scan(&s.ID, &s.Name, &s.Role, &s.Phone, &s.Email, &s.ImagePath); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }
    list = append(list, s)
  }
  c.JSON(http.StatusOK, list)
}

func (h *SpokespersonHandler) CreateSpokePerson(c *gin.Context) {
  name := c.PostForm("name")
  role := c.PostForm("role")
  phone := c.PostForm("phone")
  email := c.PostForm("email")
  file, err := c.FormFile("image")
  if err != nil || name == "" {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Name and image required"})
    return
  }
  filename := filepath.Base(file.Filename)
  dest := filepath.Join(h.UploadPath, filename)
  if err := c.SaveUploadedFile(file, dest); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "File save failed"})
    return
  }
  path := "/uploads/spokespersons/" + filename
  _, err = h.DB.Exec("INSERT INTO footer_spokespersons(name, role, phone, email, image_path) VALUES (?, ?, ?, ?, ?)",
    name, role, phone, email, path)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusCreated, gin.H{"message": "Created"})
}

func (h *SpokespersonHandler) UpdateSpokePerson(c *gin.Context) {
  id := c.Param("id")
  name := c.PostForm("name")
  role := c.PostForm("role")
  phone := c.PostForm("phone")
  email := c.PostForm("email")
  var imagePath string
  file, err := c.FormFile("image")
  if err == nil {
    filename := filepath.Base(file.Filename)
    dest := filepath.Join(h.UploadPath, filename)
    c.SaveUploadedFile(file, dest)
    imagePath = "/uploads/spokespersons/" + filename
    _, err = h.DB.Exec("UPDATE footer_spokespersons SET name=?, role=?, phone=?, email=?, image_path=? WHERE id=?",
      name, role, phone, email, imagePath, id)
  } else {
    _, err = h.DB.Exec("UPDATE footer_spokespersons SET name=?, role=?, phone=?, email=? WHERE id=?",
      name, role, phone, email, id)
  }
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, gin.H{"message": "Updated"})
}

func (h *SpokespersonHandler) DeleteSpokePerson(c *gin.Context) {
  id := c.Param("id")
  _, err := h.DB.Exec("DELETE FROM footer_spokespersons WHERE id=?", id)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
