package models



type SuccessStory struct {
	ID             int       `json:"id"`
	Title          string    `json:"title"`
	Description    string    `json:"description"`
	FullDescription string   `json:"full_description"`
	Images         []string `json:"images"`
	CreatedAt      string `json:"created_at"`
}