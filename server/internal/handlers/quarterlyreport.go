package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"slbbl/internal/models"
	"time"

	"github.com/gin-gonic/gin"
)

type FinancialReportHandler struct {
	DB             *sql.DB
	UploadBasePath string 
}

func NewFinancialReportHandler(db *sql.DB, uploadBasePath string) *FinancialReportHandler {
	return &FinancialReportHandler{
		DB:             db,
		UploadBasePath: uploadBasePath,
	}
}

// Helper to save uploaded file, returns saved relative path or error
func (h *FinancialReportHandler) saveUploadedFile(c *gin.Context, formFileKey string) (string, error) {
	file, err := c.FormFile(formFileKey)
	if err != nil {
		return "", err
	}

	// Ensure upload directory exists
	err = os.MkdirAll(h.UploadBasePath, os.ModePerm)
	if err != nil {
		return "", err
	}

	// Save file with a timestamp prefix to avoid conflicts
	filename := fmt.Sprintf("%d_%s", time.Now().UnixNano(), filepath.Base(file.Filename))
	savePath := filepath.Join(h.UploadBasePath, filename)

	err = c.SaveUploadedFile(file, savePath)
	if err != nil {
		return "", err
	}

	// Return relative path or URL for client
	return "/uploads/financial_reports/" + filename, nil
}

// POST /admin/financial-reports
func (h *FinancialReportHandler) CreateFinancialReport(c *gin.Context) {
	reportName := c.PostForm("reportName")
	if reportName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reportName is required"})
		return
	}

	filePath, err := h.saveUploadedFile(c, "file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "File upload failed: " + err.Error()})
		return
	}

	_, err = h.DB.Exec(`INSERT INTO financial_reports (report_name, file_link) VALUES (?, ?)`, reportName, filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Insert failed"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Report added successfully"})
}

// PUT /admin/financial-reports/:id
func (h *FinancialReportHandler) UpdateFinancialReport(c *gin.Context) {
	id := c.Param("id")
	reportName := c.PostForm("reportName")
	if reportName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "reportName is required"})
		return
	}

	// Get existing file_link from DB
	var existingFileLink string
	err := h.DB.QueryRow(`SELECT file_link FROM financial_reports WHERE id = ?`, id).Scan(&existingFileLink)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
		return
	}

	// Try to get uploaded file, if any
	file, err := c.FormFile("file")
	var filePath string
	if err == nil && file != nil {
		// New file uploaded, save it
		filePath, err = h.saveUploadedFile(c, "file")
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "File upload failed: " + err.Error()})
			return
		}
	} else {
		// No new file uploaded, keep existing file link
		filePath = existingFileLink
	}

	_, err = h.DB.Exec(`UPDATE financial_reports SET report_name = ?, file_link = ? WHERE id = ?`,
		reportName, filePath, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Report updated successfully"})
}

func (h *FinancialReportHandler) GetAllPublicFinancialReports(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, report_name, file_link FROM financial_reports ORDER BY id DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
		return
	}
	defer rows.Close()

	var reports []models.FinancialReport
	for rows.Next() {
		var r models.FinancialReport
		if err := rows.Scan(&r.ID, &r.ReportName, &r.FileLink); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan error"})
			return
		}
		reports = append(reports, r)
	}
	c.JSON(http.StatusOK, reports)
}

func (h *FinancialReportHandler) GetAllFinancialReports(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, report_name, file_link FROM financial_reports ORDER BY id DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch reports"})
		return
	}
	defer rows.Close()

	var reports []models.FinancialReport
	for rows.Next() {
		var r models.FinancialReport
		if err := rows.Scan(&r.ID, &r.ReportName, &r.FileLink); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan error"})
			return
		}
		reports = append(reports, r)
	}
	c.JSON(http.StatusOK, reports)
}

func (h *FinancialReportHandler) DeleteFinancialReport(c *gin.Context) {
	id := c.Param("id")

	// Get file path to optionally delete the file
	var filePath string
	err := h.DB.QueryRow(`SELECT file_link FROM financial_reports WHERE id = ?`, id).Scan(&filePath)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Report not found"})
		return
	}

	// Delete DB record
	_, err = h.DB.Exec("DELETE FROM financial_reports WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}

	// Delete the file (optional)
	fullPath := "." + filePath // because it starts with /uploads
	os.Remove(fullPath)        // ignore error

	c.JSON(http.StatusOK, gin.H{"message": "Report deleted successfully"})
}

