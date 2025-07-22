package handlers

import (
    "database/sql"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "slbbl/internal/models"
)

type ScrollingNoticeHandler struct {
    DB *sql.DB
}

func NewScrollingNoticeHandler(db *sql.DB) *ScrollingNoticeHandler {
    return &ScrollingNoticeHandler{DB: db}
}

// Get all notices ordered by created_at DESC
func (h *ScrollingNoticeHandler) GetScrollingNotices(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, notice_text, created_at FROM scrolling_notices ORDER BY created_at DESC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notices"})
        return
    }
    defer rows.Close()

    var notices []models.ScrollingNotice
    for rows.Next() {
        var notice models.ScrollingNotice
        if err := rows.Scan(&notice.ID, &notice.NoticeText, &notice.CreatedAt); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan notice"})
            return
        }
        notices = append(notices, notice)
    }

    c.JSON(http.StatusOK, gin.H{"notices": notices})
}

// Get single notice by ID
func (h *ScrollingNoticeHandler) GetScrollingNoticeByID(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notice ID"})
        return
    }

    var notice models.ScrollingNotice
    query := "SELECT id, notice_text, created_at FROM scrolling_notices WHERE id = ?"
    row := h.DB.QueryRow(query, id)
    err = row.Scan(&notice.ID, &notice.NoticeText, &notice.CreatedAt)
    if err != nil {
        if err == sql.ErrNoRows {
            c.JSON(http.StatusNotFound, gin.H{"error": "Notice not found"})
        } else {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notice"})
        }
        return
    }

    c.JSON(http.StatusOK, notice)
}

// Create new notice
func (h *ScrollingNoticeHandler) CreateScrollingNotice(c *gin.Context) {
    var input struct {
        NoticeText string `json:"notice_text" binding:"required"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Notice text is required"})
        return
    }

    query := "INSERT INTO scrolling_notices (notice_text) VALUES (?)"
    res, err := h.DB.Exec(query, input.NoticeText)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert notice"})
        return
    }

    insertedID, _ := res.LastInsertId()
    c.JSON(http.StatusCreated, gin.H{"message": "Notice created", "id": insertedID})
}

// Update existing notice by ID
func (h *ScrollingNoticeHandler) UpdateScrollingNotice(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notice ID"})
        return
    }

    var input struct {
        NoticeText string `json:"notice_text" binding:"required"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Notice text is required"})
        return
    }

    query := "UPDATE scrolling_notices SET notice_text = ? WHERE id = ?"
    res, err := h.DB.Exec(query, input.NoticeText, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notice"})
        return
    }

    rowsAffected, _ := res.RowsAffected()
    if rowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Notice not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Notice updated"})
}

// Delete notice by ID
func (h *ScrollingNoticeHandler) DeleteScrollingNotice(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid notice ID"})
        return
    }

    query := "DELETE FROM scrolling_notices WHERE id = ?"
    res, err := h.DB.Exec(query, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete notice"})
        return
    }

    rowsAffected, _ := res.RowsAffected()
    if rowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Notice not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Notice deleted"})
}
