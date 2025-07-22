package models

type BoardOfDirector struct {
    ID     uint   `json:"id" gorm:"primaryKey"`
    Title  string `json:"title" binding:"required"`
    Icon   string `json:"icon"`      // Image path (URL)
    IconBg string `json:"icon_bg"`   // Hex color
    Description   string `json:"description"`      // Role like CHAIRPERSON
}
