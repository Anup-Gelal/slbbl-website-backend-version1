package models

type Service struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	CreatedAt   string `json:"created_at"`
}
