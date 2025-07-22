package handlers

import (
	"database/sql"
	"net/http"
	"slbbl/internal/models"

	"github.com/gin-gonic/gin"
)

type SavingInterestHandler struct {
	DB *sql.DB
}

func NewSavingInterestHandler(db *sql.DB) *SavingInterestHandler {
	return &SavingInterestHandler{DB: db}
}


func (h *SavingInterestHandler) GetAllPublicSavingRates(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, name, min_saving, interest_rate, remarks FROM saving_account_interest_rates ORDER BY id ASC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}
	defer rows.Close()

	var rates []models.SavingInterestRate
	for rows.Next() {
		var r models.SavingInterestRate
		err := rows.Scan(&r.ID, &r.Name, &r.MinSaving, &r.InterestRate, &r.Remarks)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan error"})
			return
		}
		rates = append(rates, r)
	}
	c.JSON(http.StatusOK, rates)
}


func (h *SavingInterestHandler) GetAllSavingRates(c *gin.Context) {
	rows, err := h.DB.Query(`SELECT id, name, min_saving, interest_rate, remarks FROM saving_account_interest_rates ORDER BY id ASC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
		return
	}
	defer rows.Close()

	var rates []models.SavingInterestRate
	for rows.Next() {
		var r models.SavingInterestRate
		err := rows.Scan(&r.ID, &r.Name, &r.MinSaving, &r.InterestRate, &r.Remarks)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Scan error"})
			return
		}
		rates = append(rates, r)
	}
	c.JSON(http.StatusOK, rates)
}

func (h *SavingInterestHandler) CreateSavingRate(c *gin.Context) {
	var r models.SavingInterestRate
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec(`INSERT INTO saving_account_interest_rates (name, min_saving, interest_rate, remarks) VALUES (?, ?, ?, ?)`,
		r.Name, r.MinSaving, r.InterestRate, r.Remarks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Insert failed"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Interest rate added"})
}

func (h *SavingInterestHandler) DeleteSavingRate(c *gin.Context) {
	id := c.Param("id")
	_, err := h.DB.Exec("DELETE FROM saving_account_interest_rates WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Delete failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}

func (h *SavingInterestHandler) UpdateSavingRate(c *gin.Context) {
	id := c.Param("id")
	var r models.SavingInterestRate
	if err := c.ShouldBindJSON(&r); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := h.DB.Exec(`UPDATE saving_account_interest_rates SET name=?, min_saving=?, interest_rate=?, remarks=? WHERE id=?`,
		r.Name, r.MinSaving, r.InterestRate, r.Remarks, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Update failed"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}
