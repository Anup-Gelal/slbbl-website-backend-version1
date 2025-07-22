package models

import "time"

type LoginLog struct {
	ID        uint      `json:"id"`
	UserID    string    `json:"user_id"`
	Timestamp time.Time `json:"timestamp"`
	IP        string    `json:"ip"`
}

type AdminActionLog struct {
	ID        uint      `json:"id"`
	AdminID   string    `json:"admin_id"`
	Action    string    `json:"action"`
	TargetID  string    `json:"target_id"`
	Timestamp time.Time `json:"timestamp"`
}
