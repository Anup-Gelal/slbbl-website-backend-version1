package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"slbbl/internal/models"
)

type VacancyHandler struct {
	DB *sql.DB
}

func NewVacancyHandler(db *sql.DB) *VacancyHandler {
	return &VacancyHandler{DB: db}
}

// POST /api/v1/vacancies
func (h *VacancyHandler) CreateVacancy(c *gin.Context) {
	vacancyDate := c.PostForm("vacancy_date")
	postedDate := c.PostForm("posted_date")
	expiryDate := c.PostForm("expiry_date")

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "PDF file required"})
		return
	}

	// Save the file
	filePath := fmt.Sprintf("uploads/vacancies/%s", filepath.Base(file.Filename))
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save file"})
		return
	}

	// Store in DB
	query := `INSERT INTO vacancies (vacancy_date, posted_date, expiry_date, file_link) VALUES (?, ?, ?, ?)`
	_, err = h.DB.Exec(query, vacancyDate, postedDate, expiryDate, "/"+filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save vacancy"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Vacancy posted successfully"})
}

// GET /api/v1/vacancies
func (h *VacancyHandler) GetVacancies(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, vacancy_date, posted_date, expiry_date, file_link FROM vacancies ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch vacancies"})
		return
	}
	defer rows.Close()

	var vacancies []models.Vacancy
	for rows.Next() {
		var v models.Vacancy
		if err := rows.Scan(&v.ID, &v.VacancyDate, &v.PostedDate, &v.ExpiryDate, &v.FileLink); err != nil {
			continue
		}
		vacancies = append(vacancies, v)
	}

	c.JSON(http.StatusOK, vacancies)
}

// DELETE /api/v1/vacancies/:id
func (h *VacancyHandler) DeleteVacancy(c *gin.Context) {
	id := c.Param("id")

	var fileLink string
	err := h.DB.QueryRow("SELECT file_link FROM vacancies WHERE id = ?", id).Scan(&fileLink)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vacancy not found"})
		return
	}

	// Delete file
	if err := os.Remove("." + fileLink); err != nil {
		fmt.Println("File not found or already deleted:", err)
	}

	_, err = h.DB.Exec("DELETE FROM vacancies WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete vacancy"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vacancy deleted successfully"})
}
