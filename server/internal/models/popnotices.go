package models

import "time"

type PopupNotice struct {
    ID         uint      `json:"id"`
    NoticeName string    `json:"notice_name"`
    ImageURL   string    `json:"image_url"`
    CreatedAt  time.Time `json:"created_at"`
}
