package models

type BaseRate struct {
	ID     int     `json:"id"`
	Month  string  `json:"month"`
	Rate   float64 `json:"rate"`
}
