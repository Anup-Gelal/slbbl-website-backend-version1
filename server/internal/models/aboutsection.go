package models

// CEO Message
type Message struct {
	ID          int    `json:"id"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
}

// Vision, Objective, and About Text (Singleton: id = 1)
type AboutVision struct {
	ID        int    `json:"id"` // Should always be 1
	Vision    string `json:"vision"`
	Objective string `json:"objective"`
	About     string `json:"about"`
}

// Stats Card
type AboutStat struct {
	ID      int    `json:"id"`
	Title   string `json:"title"`
	Value   string `json:"value"`
	IconURL string `json:"icon_url"`
}

// Slideshow Image
type Slide struct {
	ID       int    `json:"id"`
	ImageURL string `json:"image_url"`
}
