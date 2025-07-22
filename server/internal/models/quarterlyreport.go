package models

type FinancialReport struct {
    ID         uint   `json:"id" gorm:"primaryKey"`
    ReportName string `json:"reportName"`
    FileLink   string `json:"fileLink"`
    CreatedAt  string `json:"createdAt"`
}
