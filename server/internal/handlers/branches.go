package handlers

import (
	"database/sql"
	"net/http"
	"github.com/gin-gonic/gin"
	"slbbl/internal/models"
)

type BranchHandler struct {
	DB *sql.DB
}

func NewBranchHandler(db *sql.DB) *BranchHandler {
	return &BranchHandler{DB: db}
}


func (h *BranchHandler) GetAllBranches(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, province, name, address, manager, contact, email, created_at FROM branches")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var branches []models.Branch
	for rows.Next() {
		var b models.Branch
		if err := rows.Scan(&b.ID, &b.Province, &b.Name, &b.Address, &b.Manager, &b.Contact, &b.Email, &b.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		branches = append(branches, b)
	}

	c.JSON(http.StatusOK, branches)
}

// Admin-only: Get all branches
func (h *BranchHandler) GetAllBranchesAdmin(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, province, name, address, manager, contact, email, created_at FROM branches")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var branches []models.Branch
	for rows.Next() {
		var b models.Branch
		if err := rows.Scan(&b.ID, &b.Province, &b.Name, &b.Address, &b.Manager, &b.Contact, &b.Email, &b.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		branches = append(branches, b)
	}

	c.JSON(http.StatusOK, branches)
}

// Public: Get branches by province
func (h *BranchHandler) GetBranchesByProvince(c *gin.Context) {
	province := c.Param("province")
	rows, err := h.DB.Query("SELECT id, province, name, address, manager, contact, email, created_at FROM branches WHERE province = ?", province)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var branches []models.Branch
	for rows.Next() {
		var b models.Branch
		if err := rows.Scan(&b.ID, &b.Province, &b.Name, &b.Address, &b.Manager, &b.Contact, &b.Email, &b.CreatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		branches = append(branches, b)
	}

	c.JSON(http.StatusOK, branches)
}

func (h *BranchHandler) CreateBranch(c *gin.Context) {
	var input models.Branch
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec(`INSERT INTO branches (province, name, address, manager, contact, email) VALUES (?, ?, ?, ?, ?, ?)`,
		input.Province, input.Name, input.Address, input.Manager, input.Contact, input.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Branch created successfully"})
}

func (h *BranchHandler) UpdateBranch(c *gin.Context) {
	id := c.Param("id")
	var input models.Branch
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec(`UPDATE branches SET province=?, name=?, address=?, manager=?, contact=?, email=? WHERE id=?`,
		input.Province, input.Name, input.Address, input.Manager, input.Contact, input.Email, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Branch updated successfully"})
}

func (h *BranchHandler) DeleteBranch(c *gin.Context) {
	id := c.Param("id")
	_, err := h.DB.Exec("DELETE FROM branches WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Branch deleted successfully"})
}