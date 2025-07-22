package models

type HeadOfficeStaff struct {
  ID          uint   `json:"id"`
  Name        string `json:"name"`
  Designation string `json:"designation"`
  Department  string `json:"department"`
  Email       string `json:"email"`
  Phone       string `json:"phone"`
  Image       string `json:"image"`
}
