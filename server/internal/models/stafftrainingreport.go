package models

type StaffTrainingReport struct {
    ID          int    `json:"id"`
    ReportName  string `json:"reportName"`
    FileLink    string `json:"fileLink"`
}
