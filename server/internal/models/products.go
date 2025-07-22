package models

type Product struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Icon        string `json:"icon"`
	Description string `json:"description"`
}
