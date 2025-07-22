package models

type Vacancy struct {
	ID          int    `json:"id"`
	VacancyDate string `json:"vacancy_date"`
	PostedDate  string `json:"posted_date"`
	ExpiryDate  string `json:"expiry_date"`
	FileLink    string `json:"file_link"`
}
