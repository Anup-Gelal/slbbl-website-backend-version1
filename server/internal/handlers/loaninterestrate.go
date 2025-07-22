// handlers/loan_interest_handler.go
package handlers

import (
    "database/sql"
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"
    "slbbl/internal/models"
)

type LoanInterestHandler struct {
    DB *sql.DB
}

func NewLoanInterestHandler(db *sql.DB) *LoanInterestHandler {
    return &LoanInterestHandler{DB: db}
}

// Get all loan interest rates
func (h *LoanInterestHandler) GetAllLoanInterestRatesPublic(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, product, rate, service_charge, remarks FROM loan_products_interest_rates ORDER BY id ASC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
        return
    }
    defer rows.Close()

    var rates []models.LoanProductInterestRate
    for rows.Next() {
        var rate models.LoanProductInterestRate
        if err := rows.Scan(&rate.ID, &rate.Product, &rate.Rate, &rate.ServiceCharge, &rate.Remarks); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan data"})
            return
        }
        rates = append(rates, rate)
    }

    c.JSON(http.StatusOK, rates)
}


// Get all loan interest rates
func (h *LoanInterestHandler) GetAllLoanInterestRates(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, product, rate, service_charge, remarks FROM loan_products_interest_rates ORDER BY id ASC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
        return
    }
    defer rows.Close()

    var rates []models.LoanProductInterestRate
    for rows.Next() {
        var rate models.LoanProductInterestRate
        if err := rows.Scan(&rate.ID, &rate.Product, &rate.Rate, &rate.ServiceCharge, &rate.Remarks); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan data"})
            return
        }
        rates = append(rates, rate)
    }

    c.JSON(http.StatusOK, rates)
}

// Get single loan interest rate by ID
func (h *LoanInterestHandler) GetLoanInterestRateByID(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    var rate models.LoanProductInterestRate
    err = h.DB.QueryRow("SELECT id, product, rate, service_charge, remarks FROM loan_products_interest_rates WHERE id = ?", id).
        Scan(&rate.ID, &rate.Product, &rate.Rate, &rate.ServiceCharge, &rate.Remarks)

    if err == sql.ErrNoRows {
        c.JSON(http.StatusNotFound, gin.H{"error": "Record not found"})
        return
    } else if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch data"})
        return
    }

    c.JSON(http.StatusOK, rate)
}

// Create new loan interest rate
func (h *LoanInterestHandler) CreateLoanInterestRate(c *gin.Context) {
    var rate models.LoanProductInterestRate
    if err := c.ShouldBindJSON(&rate); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    res, err := h.DB.Exec(
        "INSERT INTO loan_products_interest_rates (product, rate, service_charge, remarks) VALUES (?, ?, ?, ?)",
        rate.Product, rate.Rate, rate.ServiceCharge, rate.Remarks,
    )
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert data"})
        return
    }

    lastID, err := res.LastInsertId()
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve last insert ID"})
        return
    }

    rate.ID = int(lastID)
    c.JSON(http.StatusCreated, rate)
}

// Update existing loan interest rate by ID
func (h *LoanInterestHandler) UpdateLoanInterestRate(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    var rate models.LoanProductInterestRate
    if err := c.ShouldBindJSON(&rate); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
        return
    }

    res, err := h.DB.Exec(
        "UPDATE loan_products_interest_rates SET product=?, rate=?, service_charge=?, remarks=? WHERE id=?",
        rate.Product, rate.Rate, rate.ServiceCharge, rate.Remarks, id,
    )
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update data"})
        return
    }

    affected, err := res.RowsAffected()
    if err != nil || affected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "No record updated"})
        return
    }

    rate.ID = id
    c.JSON(http.StatusOK, rate)
}

// Delete loan interest rate by ID
func (h *LoanInterestHandler) DeleteLoanInterestRate(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    res, err := h.DB.Exec("DELETE FROM loan_products_interest_rates WHERE id = ?", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete data"})
        return
    }

    affected, err := res.RowsAffected()
    if err != nil || affected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "No record deleted"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Record deleted"})
}
