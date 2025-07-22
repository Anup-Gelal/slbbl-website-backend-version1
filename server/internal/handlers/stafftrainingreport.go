package handlers

import (
    "database/sql"
    "net/http"
    "path/filepath"
    "strconv"
    "os"
    "slbbl/internal/models"

    "github.com/gin-gonic/gin"
)

type StaffTrainingHandler struct {
    DB         *sql.DB
    UploadPath string
}

func NewStaffTrainingHandler(db *sql.DB, uploadPath string) *StaffTrainingHandler {
    return &StaffTrainingHandler{DB: db, UploadPath: uploadPath}
}

func (h *StaffTrainingHandler) GetAllPublicStaffTrainingReports(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, report_name, file_link FROM staff_training_reports ORDER BY id DESC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var list []models.StaffTrainingReport
    for rows.Next() {
        var r models.StaffTrainingReport
        if err := rows.Scan(&r.ID, &r.ReportName, &r.FileLink); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        list = append(list, r)
    }
    c.JSON(http.StatusOK, list)
}

func (h *StaffTrainingHandler) GetAllAdminStaffTrainingReports(c *gin.Context) {
    h.GetAllPublicStaffTrainingReports(c)
}

func (h *StaffTrainingHandler) CreateStaffTrainingReports(c *gin.Context) {
    name := c.PostForm("reportName")
    if name == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "disclosureName is required"})
        return
    }
    file, err := c.FormFile("file")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "File is required"})
        return
    }
    filename := filepath.Base(file.Filename)
    os.MkdirAll(h.UploadPath, os.ModePerm)
    fullPath := filepath.Join(h.UploadPath, filename)
    if err := c.SaveUploadedFile(file, fullPath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
        return
    }
    fileLink := "/uploads/staff_training_reports/" + filename
    res, err := h.DB.Exec("INSERT INTO staff_training_reports (report_name, file_link) VALUES (?, ?)", name, fileLink)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    id, _ := res.LastInsertId()
    c.JSON(http.StatusCreated, gin.H{"id": id, "reportName": name, "fileLink": fileLink})
}

func (h *StaffTrainingHandler) UpdateStaffTrainingReports(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }
    name := c.PostForm("reportName")
    if name == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "reportName required"})
        return
    }

    var existingLink string
    if err := h.DB.QueryRow("SELECT file_link FROM staff_training_reports WHERE id=?", id).Scan(&existingLink); err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "report not found"})
        return
    }
    fileLink := existingLink
    if file, err := c.FormFile("file"); err == nil {
        filename := filepath.Base(file.Filename)
        os.MkdirAll(h.UploadPath, os.ModePerm)
        fullPath := filepath.Join(h.UploadPath, filename)
        c.SaveUploadedFile(file, fullPath)
        fileLink = "/uploads/staff_training_reports/" + filename
    }
    _, err = h.DB.Exec("UPDATE staff_training_reports SET report_name=?, file_link=? WHERE id=?", name, fileLink, id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "updated successfully"})
}

func (h *StaffTrainingHandler) DeleteStaffTrainingReports(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
        return
    }
    _, err = h.DB.Exec("DELETE FROM staff_training_reports WHERE id=?", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "deleted successfully"})
}
