// models/loan_product_interest_rate.go

package models

type LoanProductInterestRate struct {
    ID            int    `json:"id" db:"id"`
    Product       string `json:"product" db:"product"`
    Rate          string `json:"rate" db:"rate"`
    ServiceCharge string `json:"serviceCharge" db:"service_charge"`
    Remarks       string `json:"remarks" db:"remarks"`
}
