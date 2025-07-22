
package models
import (
	"time"
)

type Branch struct {
	ID       int    `json:"id"`
	Province string `json:"province"`
	Name     string `json:"name"`
	Address  string `json:"address"`
	Manager  string `json:"manager"`
	Contact  string `json:"contact"`
	Email    string `json:"email"`
	CreatedAt    time.Time `json:"created_at"`
}
