package models

import "time"

type ScrollingNotice struct {
    ID         int       `json:"id"`
    NoticeText string    `json:"notice_text"`
    CreatedAt  time.Time `json:"created_at"`
}
