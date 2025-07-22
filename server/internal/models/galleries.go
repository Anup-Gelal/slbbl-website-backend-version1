package models

type Gallery struct {
  ID        int      `json:"id"`
  Title     string   `json:"title"`
  Date      string   `json:"date"`
  ImagePaths []string `json:"imagePaths"`
}