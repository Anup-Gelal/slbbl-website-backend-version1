package models

import (
	"errors"
	"time"
)

type Role string

const (
	RoleAccessedUser Role = "accesseduser"
	RoleAdmin        Role = "admin"
	RoleDefault      Role = "accesseduser"
)

type User struct {
	ID           uint      `json:"id"`
	UserID       string    `json:"userid"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	Role         Role      `json:"role"`
	IsApproved   bool      `json:"is_approved"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type RegisterInput struct {
	UserID   string `json:"userid" binding:"required,min=4"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginInput struct {
	UserID   string `json:"userid" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (r *RegisterInput) Validate() error {
	if len(r.UserID) < 4 {
		return errors.New("userid must be at least 4 characters")
	}
	if len(r.Username) == 0 {
		return errors.New("username is required")
	}
	if len(r.Password) < 6 {
		return errors.New("password must be at least 6 characters")
	}
	return nil
}
