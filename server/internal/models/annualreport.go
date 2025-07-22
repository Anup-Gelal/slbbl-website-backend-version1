package models

import "time"

type AnnualReport struct {
    ID         int       `json:"id"`
    ReportName string    `json:"reportName"`
    FileLink   string    `json:"fileLink"`
    CreatedAt  time.Time `json:"createdAt"`
}
