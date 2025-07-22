package models

type Management struct {
    ID          int    `json:"id"`
    Title       string `json:"title"`
    Icon        string `json:"icon"`
    IconBg      string `json:"iconBg"`
    Description string `json:"description"`
}
