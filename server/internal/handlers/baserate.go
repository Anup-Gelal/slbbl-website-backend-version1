package handlers

import (
	"database/sql"
	"net/http"
	"slbbl/internal/models"

	"github.com/gin-gonic/gin"
)

type BaseRateHandler struct {
	DB *sql.DB
}

func NewBaseRateHandler(db *sql.DB) *BaseRateHandler {
	return &BaseRateHandler{DB: db}
}

// Public
func (h *BaseRateHandler) GetAllBaseRatesPublic(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, month, rate FROM base_rates ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch base rates"})
		return
	}
	defer rows.Close()

	var rates []models.BaseRate
	for rows.Next() {
		var r models.BaseRate
		if err := rows.Scan(&r.ID, &r.Month, &r.Rate); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan error"})
			return
		}
		rates = append(rates, r)
	}
	c.JSON(http.StatusOK, rates)
}

// Admin

func (h *BaseRateHandler) GetAllBaseRates(c *gin.Context) {
	rows, err := h.DB.Query("SELECT id, month, rate FROM base_rates ORDER BY id DESC")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch base rates"})
		return
	}
	defer rows.Close()

	var rates []models.BaseRate
	for rows.Next() {
		var r models.BaseRate
		if err := rows.Scan(&r.ID, &r.Month, &r.Rate); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan error"})
			return
		}
		rates = append(rates, r)
	}
	c.JSON(http.StatusOK, rates)
}

func (h *BaseRateHandler) UpdateBaseRate(c *gin.Context) {
	id := c.Param("id")
	var r models.BaseRate

	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec("UPDATE base_rates SET month = ?, rate = ? WHERE id = ?", r.Month, r.Rate, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Base rate updated"})
}


func (h *BaseRateHandler) CreateBaseRate(c *gin.Context) {
	var r models.BaseRate
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec("INSERT INTO base_rates (month, rate) VALUES (?, ?)", r.Month, r.Rate)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Insert failed"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Base rate added"})
}

func (h *BaseRateHandler) DeleteBaseRate(c *gin.Context) {
	id := c.Param("id")
	_, err := h.DB.Exec("DELETE FROM base_rates WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Base rate deleted"})
}
