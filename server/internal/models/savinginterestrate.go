package models

type SavingInterestRate struct {
	ID           int     `json:"id"`
	Name         string  `json:"name"`
	MinSaving    *float64 `json:"minSaving"`       // Nullable
	InterestRate *string  `json:"interestRate"`    // Nullable
	Remarks      *string  `json:"remarks"`         // Nullable
}
