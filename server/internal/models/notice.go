package models
import (
	"time"
)

type Notice struct {
    ID           uint      `json:"id"`
    NoticeName   string    `json:"noticeName"`
    FileLink     string    `json:"fileLink"`
    DateOfIssue  string `json:"dateofissue"`
    CreatedAt    time.Time `json:"createdAt"`
}