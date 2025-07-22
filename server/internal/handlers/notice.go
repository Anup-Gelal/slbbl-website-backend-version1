package handlers

import (
  "database/sql"
  "net/http"
  "path/filepath"
  "strconv"
  "time"

  "github.com/gin-gonic/gin"
  "slbbl/internal/models"
)

type NoticeHandler struct {
  DB         *sql.DB
  UploadPath string
}

func NewNoticeHandler(db *sql.DB, path string) *NoticeHandler {
  return &NoticeHandler{DB: db, UploadPath: path}
}

// Public GET
func (h *NoticeHandler) GetAllPublicNotices(c *gin.Context) {
  rows, err := h.DB.Query(
    "SELECT id, notice_name, file_link, date_of_issue FROM notices ORDER BY date_of_issue DESC",
  )
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var list []models.Notice
  for rows.Next() {
    var n models.Notice
    var doi time.Time
    if err := rows.Scan(&n.ID, &n.NoticeName, &n.FileLink, &doi); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }
    n.DateOfIssue = doi.Format("2006-01-02")
    list = append(list, n)
  }
  c.JSON(http.StatusOK, list)
}

func (h *NoticeHandler) GetAllNotices(c *gin.Context) {
  rows, err := h.DB.Query(
    "SELECT id, notice_name, file_link, date_of_issue FROM notices ORDER BY date_of_issue DESC",
  )
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var list []models.Notice
  for rows.Next() {
    var n models.Notice
    var doi time.Time
    if err := rows.Scan(&n.ID, &n.NoticeName, &n.FileLink, &doi); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }
    n.DateOfIssue = doi.Format("2006-01-02")
    list = append(list, n)
  }
  c.JSON(http.StatusOK, list)
}


// Admin Create
func (h *NoticeHandler) CreateNotice(c *gin.Context) {
  name := c.PostForm("noticeName")
  doi := c.PostForm("dateOfIssue")
  file, err := c.FormFile("file")
  if name == "" || doi == "" || err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Name, date and file are all required"})
    return
  }
  // parse date
  parsed, err := time.Parse("2006-01-02", doi)
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format"})
    return
  }
  filename := filepath.Base(file.Filename)
  full := filepath.Join(h.UploadPath, filename)
  if err := c.SaveUploadedFile(file, full); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
    return
  }
  link := "/uploads/notices/" + filename
  res, err := h.DB.Exec(
    "INSERT INTO notices (notice_name, file_link, date_of_issue) VALUES (?, ?, ?)",
    name, link, parsed,
  )
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  lastId, _ := res.LastInsertId()
  c.JSON(http.StatusCreated, gin.H{"id": lastId, "noticeName": name, "fileLink": link, "dateOfIssue": doi})
}

// Admin Update
func (h *NoticeHandler) UpdateNotice(c *gin.Context) {
  id, err := strconv.Atoi(c.Param("id"))
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
    return
  }
  name := c.PostForm("noticeName")
  doi := c.PostForm("dateOfIssue")
  _, fileErr := c.FormFile("file")

  if name == "" || doi == "" {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Name and dateOfIssue required"})
    return
  }
  parsed, err := time.Parse("2006-01-02", doi)
  if err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date"})
    return
  }

  if fileErr == nil {
    file, _ := c.FormFile("file")
    filename := filepath.Base(file.Filename)
    full := filepath.Join(h.UploadPath, filename)
    if err := c.SaveUploadedFile(file, full); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": "Save failed"})
      return
    }
    link := "/uploads/notices/" + filename
    _, err = h.DB.Exec(
      "UPDATE notices SET notice_name=?, file_link=?, date_of_issue=? WHERE id=?",
      name, link, parsed, id,
    )
  } else {
    _, err = h.DB.Exec(
      "UPDATE notices SET notice_name=?, date_of_issue=? WHERE id=?",
      name, parsed, id,
    )
  }
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
  } else {
    c.JSON(http.StatusOK, gin.H{"message": "Notice updated successfully"})
  }
}

// Admin Delete
func (h *NoticeHandler) DeleteNotice(c *gin.Context) {
  id, _ := strconv.Atoi(c.Param("id"))
  _, err := h.DB.Exec("DELETE FROM notices WHERE id=?", id)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
  } else {
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
  }
}
