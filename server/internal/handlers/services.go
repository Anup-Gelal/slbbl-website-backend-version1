package handlers

import (
  "database/sql"
  "net/http"
  "path/filepath"

  "github.com/gin-gonic/gin"
  "slbbl/internal/models"
)

type ServiceHandler struct {
  DB         *sql.DB
  UploadPath string
}

func NewServiceHandler(db *sql.DB, uploadPath string) *ServiceHandler {
  return &ServiceHandler{DB: db, UploadPath: uploadPath}
}

func (h *ServiceHandler) GetAllServicesPublic(c *gin.Context) {
  h.getAll(c)
}

func (h *ServiceHandler) GetAllServices(c *gin.Context) {
  h.getAll(c)
}

func (h *ServiceHandler) getAll(c *gin.Context) {
  rows, err := h.DB.Query("SELECT id, title, description, icon FROM services ORDER BY id DESC")
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var services []models.Service
  for rows.Next() {
    var s models.Service
    if err := rows.Scan(&s.ID, &s.Title, &s.Description, &s.Icon); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }
    services = append(services, s)
  }
  c.JSON(http.StatusOK, services)
}

func (h *ServiceHandler) CreateService(c *gin.Context) {
  title := c.PostForm("title")
  description := c.PostForm("description")
  file, err := c.FormFile("icon")

  if title == "" || description == "" || err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "title, description and icon file are required"})
    return
  }

  filename := filepath.Base(file.Filename)
  dest := filepath.Join(h.UploadPath, filename)
  if err := c.SaveUploadedFile(file, dest); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save icon file"})
    return
  }
  link := "/uploads/services/" + filename

  _, err = h.DB.Exec(
    "INSERT INTO services (title, description, icon) VALUES (?, ?, ?)",
    title, description, link,
  )
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }

  c.JSON(http.StatusCreated, gin.H{"message": "Service created successfully"})
}

func (h *ServiceHandler) UpdateService(c *gin.Context) {
  id := c.Param("id")
  title := c.PostForm("title")
  description := c.PostForm("description")

  if title == "" || description == "" {
    c.JSON(http.StatusBadRequest, gin.H{"error": "title and description required"})
    return
  }

  file, err := c.FormFile("icon")
  if err == nil {
    filename := filepath.Base(file.Filename)
    dest := filepath.Join(h.UploadPath, filename)
    if err := c.SaveUploadedFile(file, dest); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save icon file"})
      return
    }
    link := "/uploads/services/" + filename
    _, err = h.DB.Exec(
      "UPDATE services SET title=?, description=?, icon=? WHERE id=?",
      title, description, link, id,
    )
  } else {
    _, err = h.DB.Exec(
      "UPDATE services SET title=?, description=? WHERE id=?",
      title, description, id,
    )
  }

  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }

  c.JSON(http.StatusOK, gin.H{"message": "Service updated successfully"})
}

func (h *ServiceHandler) DeleteService(c *gin.Context) {
  id := c.Param("id")
  _, err := h.DB.Exec("DELETE FROM services WHERE id=?", id)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, gin.H{"message": "Service deleted successfully"})
}
