package handlers

import (
	"database/sql"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"slbbl/internal/models"
)

type PrincipalIndicatorHandler struct {
	DB         *sql.DB
	UploadPath string
}

func NewPrincipalIndicatorHandler(db *sql.DB, uploadPath string) *PrincipalIndicatorHandler {
	return &PrincipalIndicatorHandler{
		DB:         db,
		UploadPath: uploadPath,
	}
}

// ✅ Public GET
func (h *PrincipalIndicatorHandler) GetPublicPrincipalIndicators(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, report_name, file_link FROM principal_indicators ORDER BY created_at DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var indicators []models.PrincipalIndicator
	for rows.Next() {
		var pi models.PrincipalIndicator
		if err := rows.Scan(&pi.ID, &pi.ReportName, &pi.FileLink); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		indicators = append(indicators, pi)
	}
	c.JSON(http.StatusOK, indicators)
}

// ✅ Admin GET
func (h *PrincipalIndicatorHandler) GetAllIndicators(c *gin.Context) {
	h.GetPublicPrincipalIndicators(c)
}

// ✅ Admin POST
func (h *PrincipalIndicatorHandler) CreateIndicator(c *gin.Context) {
	reportName := c.PostForm("reportName")

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PDF file is required"})
		return
	}

	filename := filepath.Base(file.Filename)
	savePath := filepath.Join(h.UploadPath, filename)
	fileLink := "/uploads/principal_indicators/" + filename

	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	_, err = h.DB.Exec("INSERT INTO principal_indicators (report_name, file_link) VALUES (?, ?)", reportName, fileLink)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save record"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Indicator added"})
}

// ✅ Admin PUT
func (h *PrincipalIndicatorHandler) UpdateIndicator(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	reportName := c.PostForm("reportName")
	var fileLink string

	file, err := c.FormFile("file")
	if err == nil {
		filename := filepath.Base(file.Filename)
		savePath := filepath.Join(h.UploadPath, filename)
		fileLink = "/uploads/principal_indicators/" + filename

		if err := c.SaveUploadedFile(file, savePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "File upload failed"})
			return
		}

		_, err = h.DB.Exec("UPDATE principal_indicators SET report_name=?, file_link=? WHERE id=?", reportName, fileLink, id)
	} else {
		_, err = h.DB.Exec("UPDATE principal_indicators SET report_name=? WHERE id=?", reportName, id)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

// ✅ Admin DELETE
func (h *PrincipalIndicatorHandler) DeleteIndicator(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	_, err = h.DB.Exec("DELETE FROM principal_indicators WHERE id=?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
