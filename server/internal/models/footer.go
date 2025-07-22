package models

import "time"

type Download struct {
  ID        int       `json:"id"`
  Title     string    `json:"title"`
  FilePath  string    `json:"filePath"`
  CreatedAt time.Time `json:"createdAt"`
}

type Spokesperson struct {
  ID        int       `json:"id"`
  Name      string    `json:"name"`
  Role      string    `json:"role"`
  Phone     string    `json:"phone"`
  Email     string    `json:"email"`
  ImagePath string    `json:"imagePath"`
  CreatedAt time.Time `json:"createdAt"`
}
