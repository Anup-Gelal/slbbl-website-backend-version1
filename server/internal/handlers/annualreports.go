package handlers

import (
    "database/sql"
    "net/http"
    "path/filepath"
    "strconv"

    "github.com/gin-gonic/gin"
    "slbbl/internal/models"
)

type AnnualReportHandler struct {
    DB             *sql.DB
    UploadBasePath string
}

func NewAnnualReportHandler(db *sql.DB, uploadBasePath string) *AnnualReportHandler {
    return &AnnualReportHandler{DB: db, UploadBasePath: uploadBasePath}
}

// GET /annual-reports - Public route to fetch all annual reports
func (h *AnnualReportHandler) GetPublicAnnualReports(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, report_name, file_link FROM annual_reports ORDER BY id DESC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    reports := []models.AnnualReport{}
    for rows.Next() {
        var r models.AnnualReport
        if err := rows.Scan(&r.ID, &r.ReportName, &r.FileLink); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        reports = append(reports, r)
    }
    c.JSON(http.StatusOK, reports)
}

// GET /admin/annual-reports - Admin: list all annual reports
func (h *AnnualReportHandler) GetAllAnnualReports(c *gin.Context) {
    h.GetPublicAnnualReports(c) // same as public, can customize if needed
}

// POST /admin/annual-reports - Create annual report with PDF upload
func (h *AnnualReportHandler) CreateAnnualReport(c *gin.Context) {
    reportName := c.PostForm("reportName")
    if reportName == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "reportName is required"})
        return
    }

    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "PDF file is required"})
        return
    }

    filename := filepath.Base(file.Filename)
    savePath := filepath.Join(h.UploadBasePath, filename)

    if err := c.SaveUploadedFile(file, savePath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload PDF"})
        return
    }

    fileLink := "/uploads/annual_reports/" + filename

    res, err := h.DB.Exec("INSERT INTO annual_reports (report_name, file_link) VALUES (?, ?)", reportName, fileLink)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    id, _ := res.LastInsertId()
    c.JSON(http.StatusCreated, gin.H{
        "id":         id,
        "reportName": reportName,
        "fileLink":   fileLink,
    })
}

// PUT /admin/annual-reports/:id - Update annual report (optional PDF upload)
func (h *AnnualReportHandler) UpdateAnnualReport(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid annual report ID"})
        return
    }

    // Check if exists
    var existingFileLink string
    err = h.DB.QueryRow("SELECT file_link FROM annual_reports WHERE id = ?", id).Scan(&existingFileLink)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Annual report not found"})
        return
    }

    reportName := c.PostForm("reportName")
    if reportName == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "reportName is required"})
        return
    }

    file, err := c.FormFile("file")
    var fileLink string
    if err == nil && file != nil {
        filename := filepath.Base(file.Filename)
        savePath := filepath.Join(h.UploadBasePath, filename)
        if err := c.SaveUploadedFile(file, savePath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload PDF"})
            return
        }
        fileLink = "/uploads/annual_reports/" + filename
    } else {
        fileLink = existingFileLink
    }

    _, err = h.DB.Exec("UPDATE annual_reports SET report_name=?, file_link=? WHERE id=?", reportName, fileLink, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Annual report updated successfully"})
}

// DELETE /admin/annual-reports/:id - Delete annual report by ID
func (h *AnnualReportHandler) DeleteAnnualReport(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid annual report ID"})
        return
    }

    _, err = h.DB.Exec("DELETE FROM annual_reports WHERE id=?", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Annual report deleted successfully"})
}
