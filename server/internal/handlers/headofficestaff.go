package handlers

import (
	"database/sql"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"slbbl/internal/models"
)

type HeadOfficeStaffHandler struct {
	DB *sql.DB
}

func NewHeadOfficeStaffHandler(db *sql.DB) *HeadOfficeStaffHandler {
	return &HeadOfficeStaffHandler{DB: db}
}

// GET /head-office-staff - Public route to fetch all head office staff
func (h *HeadOfficeStaffHandler) GetAllPublicStaff(c *gin.Context) {
	staff := []models.HeadOfficeStaff{}

rows, err := h.DB.Query("SELECT id, name, designation, department, email, phone, image FROM head_office_staff")
if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
}
defer rows.Close()

for rows.Next() {
    var s models.HeadOfficeStaff
    if err := rows.Scan(&s.ID, &s.Name, &s.Designation, &s.Department, &s.Email, &s.Phone, &s.Image); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    staff = append(staff, s)
}

c.JSON(http.StatusOK, staff)

}

// GET /admin/head-office-staff - Admin route to fetch all head office staff
func (h *HeadOfficeStaffHandler) GetAllStaff(c *gin.Context) {
	// same as public for now, you can add more fields or filtering later
	h.GetAllPublicStaff(c)
}

// POST /admin/head-office-staff - create new staff member
func (h *HeadOfficeStaffHandler) CreateStaff(c *gin.Context) {
	name := c.PostForm("name")
	designation := c.PostForm("designation")
	department := c.PostForm("department")
	email := c.PostForm("email")
	phone := c.PostForm("phone")

	var imagePath string
	file, err := c.FormFile("image")
	if err == nil {
		filename := filepath.Base(file.Filename)
		imagePath = "uploads/head-office-staff/" + filename
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
			return
		}
	}

	res, err := h.DB.Exec("INSERT INTO head_office_staff (name, designation, department, email, phone, image) VALUES (?, ?, ?, ?, ?, ?)",
		name, designation, department, email, phone, imagePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	id, _ := res.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{"id": id})
}

// PUT /admin/head-office-staff/:id - update staff
func (h *HeadOfficeStaffHandler) UpdateStaff(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	name := c.PostForm("name")
	designation := c.PostForm("designation")
	department := c.PostForm("department")
	email := c.PostForm("email")
	phone := c.PostForm("phone")

	var imagePath string
	file, err := c.FormFile("image")
	if err == nil {
		filename := filepath.Base(file.Filename)
		imagePath = "uploads/head-office-staff/" + filename
		if err := c.SaveUploadedFile(file, imagePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
			return
		}

		_, err = h.DB.Exec("UPDATE head_office_staff SET name=?, designation=?, department=?, email=?, phone=?, image=? WHERE id=?",
			name, designation, department, email, phone, imagePath, id)
	} else {
		_, err = h.DB.Exec("UPDATE head_office_staff SET name=?, designation=?, department=?, email=?, phone=? WHERE id=?",
			name, designation, department, email, phone, id)
	}

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

// DELETE /admin/head-office-staff/:id - delete staff
func (h *HeadOfficeStaffHandler) DeleteStaff(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	_, err := h.DB.Exec("DELETE FROM head_office_staff WHERE id=?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
