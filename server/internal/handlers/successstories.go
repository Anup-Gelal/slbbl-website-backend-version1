package handlers

import (
  "database/sql"
  "encoding/json"
  "net/http"
  "path/filepath"

  "github.com/gin-gonic/gin"
  "slbbl/internal/models"
)

type SuccessStoryHandler struct {
  DB         *sql.DB
  UploadPath string
}

func NewSuccessStoryHandler(db *sql.DB, uploadPath string) *SuccessStoryHandler {
  return &SuccessStoryHandler{DB: db, UploadPath: uploadPath}
}

// Create handler with multi-file support
func (h *SuccessStoryHandler) CreateSuccessStories(c *gin.Context) {
  title := c.PostForm("title")
  desc := c.PostForm("description")
  fullDesc := c.PostForm("fullDescription")

  form, _ := c.MultipartForm()
  files := form.File["images"]
  if title == "" || desc == "" || fullDesc == "" || len(files) == 0 {
    c.JSON(http.StatusBadRequest, gin.H{"error": "All fields and at least one image required"})
    return
  }

  var urls []string
  for _, file := range files {
    filename := filepath.Base(file.Filename)
    dst := filepath.Join(h.UploadPath, filename)
    if err := c.SaveUploadedFile(file, dst); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save " + file.Filename})
      return
    }
    urls = append(urls, "/uploads/success-stories/"+filename)
  }

  js, _ := json.Marshal(urls)
  if _, err := h.DB.Exec(`INSERT INTO success_stories
    (title, description, full_description, images) VALUES (?, ?, ?, ?)`,
    title, desc, fullDesc, js); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusCreated, gin.H{"message": "Story created"})
}

func (h *SuccessStoryHandler) GetAllSuccessStoriesPublic(c *gin.Context) {
  rows, err := h.DB.Query(`SELECT id, title, description, full_description, images, created_at FROM success_stories`)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
  }
  defer rows.Close()

  var out []models.SuccessStory
  for rows.Next() {
    var s models.SuccessStory
    var imgs string
    if err := rows.Scan(&s.ID, &s.Title, &s.Description, &s.FullDescription, &imgs, &s.CreatedAt); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
    }
    json.Unmarshal([]byte(imgs), &s.Images)
    out = append(out, s)
  }
  c.JSON(http.StatusOK, out)
}


// List handler (public + admin)
func (h *SuccessStoryHandler) GetAllSuccessStories(c *gin.Context) {
  rows, err := h.DB.Query(`SELECT id, title, description, full_description, images, created_at FROM success_stories`)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
  }
  defer rows.Close()

  var out []models.SuccessStory
  for rows.Next() {
    var s models.SuccessStory
    var imgs string
    if err := rows.Scan(&s.ID, &s.Title, &s.Description, &s.FullDescription, &imgs, &s.CreatedAt); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
    }
    json.Unmarshal([]byte(imgs), &s.Images)
    out = append(out, s)
  }
  c.JSON(http.StatusOK, out)
}

// Update handler (replaces images)
func (h *SuccessStoryHandler) UpdateSuccessStories(c *gin.Context) {
  id := c.Param("id")
  form, _ := c.MultipartForm()
  files := form.File["images"]

  title := c.PostForm("title")
  desc := c.PostForm("description")
  fullDesc := c.PostForm("fullDescription")

  // build updated URL list
  urls := []string{}
  for _, file := range files {
    filename := filepath.Base(file.Filename)
    dst := filepath.Join(h.UploadPath, filename)
    c.SaveUploadedFile(file, dst)
    urls = append(urls, "/uploads/success-stories/"+filename)
  }
  js, _ := json.Marshal(urls)

  if _, err := h.DB.Exec(`UPDATE success_stories 
    SET title=?, description=?, full_description=?, images=? WHERE id=?`,
    title, desc, fullDesc, js, id); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
  }
  c.JSON(http.StatusOK, gin.H{"message": "Updated"})
}

func (h *SuccessStoryHandler) DeleteSuccessStories(c *gin.Context) {
  id := c.Param("id")
  if _, err := h.DB.Exec(`DELETE FROM success_stories WHERE id=?`, id); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()}); return
  }
  c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}
