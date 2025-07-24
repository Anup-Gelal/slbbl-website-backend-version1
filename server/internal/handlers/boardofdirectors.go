package handlers

import (
    "database/sql"
    "net/http"
    "path/filepath"
    "strconv"
    "strings"

    "github.com/gin-gonic/gin"
    "slbbl/internal/models"
)

type BodHandler struct {
    DB *sql.DB
}

func NewBodHandler(db *sql.DB) *BodHandler {
    return &BodHandler{DB: db}
}

func sanitizeIconPath(icon string) string {
    // Normalize path separators
    icon = filepath.ToSlash(icon)
    // Find "uploads/bods/" substring
    idx := strings.Index(icon, "uploads/bods/")
    if idx != -1 {
        return icon[idx:]
    }
    // Return original if not found
    return icon
}

// GET /bods - Public route to fetch all BODs
func (h *BodHandler) GetPublicBods(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, title, icon, icon_bg, description FROM board_of_directors")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    bods := []models.BoardOfDirector{}
    for rows.Next() {
        var bod models.BoardOfDirector
        if err := rows.Scan(&bod.ID, &bod.Title, &bod.Icon, &bod.IconBg, &bod.Description); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        bod.Icon = sanitizeIconPath(bod.Icon)
        bods = append(bods, bod)
    }
    c.JSON(http.StatusOK, bods)
}

// GET /admin/bods - List all BODs
func (h *BodHandler) GetAllBods(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, title, icon, icon_bg, description FROM board_of_directors")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    bods := []models.BoardOfDirector{}
    for rows.Next() {
        var bod models.BoardOfDirector
        if err := rows.Scan(&bod.ID, &bod.Title, &bod.Icon, &bod.IconBg, &bod.Description); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        bod.Icon = sanitizeIconPath(bod.Icon)
        bods = append(bods, bod)
    }
    c.JSON(http.StatusOK, bods)
}

// POST /admin/bods - Create a new BOD
func (h *BodHandler) CreateBod(c *gin.Context) {
    title := c.PostForm("title")
    iconBg := c.PostForm("icon_bg")
    description := c.PostForm("description")

    var iconPath string
    file, err := c.FormFile("icon")
    if err == nil {
        filename := filepath.Base(file.Filename)
        iconPath = "uploads/bods/" + filename
        if err := c.SaveUploadedFile(file, iconPath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload icon"})
            return
        }
    } else {
        iconPath = ""
    }

    res, err := h.DB.Exec("INSERT INTO board_of_directors (title, icon, icon_bg, description) VALUES (?, ?, ?, ?)",
        title, iconPath, iconBg, description)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    id, _ := res.LastInsertId()

    c.JSON(http.StatusCreated, gin.H{
        "id":          id,
        "title":       title,
        "icon":        sanitizeIconPath(iconPath),
        "icon_bg":     iconBg,
        "description": description,
    })
}

// PUT /admin/bods/:id - Update existing BOD
func (h *BodHandler) UpdateBod(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid BOD ID"})
        return
    }

    var exists bool
    err = h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM board_of_directors WHERE id=?)", id).Scan(&exists)
    if err != nil || !exists {
        c.JSON(http.StatusNotFound, gin.H{"error": "BOD not found"})
        return
    }

    title := c.PostForm("title")
    iconBg := c.PostForm("icon_bg")
    description := c.PostForm("description")

    var iconPath string
    file, err := c.FormFile("icon")
    if err == nil {
        filename := filepath.Base(file.Filename)
        iconPath = "uploads/bods/" + filename
        if err := c.SaveUploadedFile(file, iconPath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload icon"})
            return
        }
        _, err = h.DB.Exec("UPDATE board_of_directors SET title=?, icon=?, icon_bg=?, description=? WHERE id=?",
            title, iconPath, iconBg, description, id)
    } else {
        _, err = h.DB.Exec("UPDATE board_of_directors SET title=?, icon_bg=?, description=? WHERE id=?",
            title, iconBg, description, id)
    }

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "BOD updated successfully"})
}

// DELETE /admin/bods/:id - Delete BOD by ID
func (h *BodHandler) DeleteBod(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid BOD ID"})
        return
    }
    _, err = h.DB.Exec("DELETE FROM board_of_directors WHERE id=?", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "BOD deleted successfully"})
}

/*
package handlers

import (
    "database/sql"
    "net/http"
    "path/filepath"
    "strconv"

    "github.com/gin-gonic/gin"
    "slbbl/internal/models"
)


type BodHandler struct {
    DB *sql.DB
}

func NewBodHandler(db *sql.DB) *BodHandler {
    return &BodHandler{DB: db}
}

// GET /bods - Public route to fetch all BODs
func (h *BodHandler) GetPublicBods(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, title, icon, icon_bg, description FROM board_of_directors")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    bods := []models.BoardOfDirector{}
    for rows.Next() {
        var bod models.BoardOfDirector
        if err := rows.Scan(&bod.ID, &bod.Title, &bod.Icon, &bod.IconBg, &bod.Description); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        bods = append(bods, bod)
    }
    c.JSON(http.StatusOK, bods)
}


// GET /admin/bods - List all BODs
func (h *BodHandler) GetAllBods(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, title, icon, icon_bg, description FROM board_of_directors")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    bods := []models.BoardOfDirector{}
    for rows.Next() {
        var bod models.BoardOfDirector
        if err := rows.Scan(&bod.ID, &bod.Title, &bod.Icon, &bod.IconBg, &bod.Description); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        bods = append(bods, bod)
    }
    c.JSON(http.StatusOK, bods)
}

// POST /admin/bods - Create a new BOD
func (h *BodHandler) CreateBod(c *gin.Context) {
    title := c.PostForm("title")
    iconBg := c.PostForm("icon_bg")
    description := c.PostForm("description")

    // Handle file upload for icon
    var iconPath string
    file, err := c.FormFile("icon")
    if err == nil {
        filename := filepath.Base(file.Filename)
        iconPath = "uploads/bods/" + filename
        if err := c.SaveUploadedFile(file, iconPath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload icon"})
            return
        }
    } else {
        iconPath = "" // Or set default icon path
    }

    res, err := h.DB.Exec("INSERT INTO board_of_directors (title, icon, icon_bg, description) VALUES (?, ?, ?, ?)",
        title, iconPath, iconBg, description)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    id, _ := res.LastInsertId()

    c.JSON(http.StatusCreated, gin.H{
        "id":          id,
        "title":       title,
        "icon":        iconPath,
        "icon_bg":     iconBg,
        "description": description,
    })
}

// PUT /admin/bods/:id - Update existing BOD
func (h *BodHandler) UpdateBod(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid BOD ID"})
        return
    }

    // Check if BOD exists
    var exists bool
    err = h.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM board_of_directors WHERE id=?)", id).Scan(&exists)
    if err != nil || !exists {
        c.JSON(http.StatusNotFound, gin.H{"error": "BOD not found"})
        return
    }

    title := c.PostForm("title")
    iconBg := c.PostForm("icon_bg")
    description := c.PostForm("description")

    var iconPath string
    file, err := c.FormFile("icon")
    if err == nil {
        filename := filepath.Base(file.Filename)
        iconPath = "uploads/bods/" + filename
        if err := c.SaveUploadedFile(file, iconPath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload icon"})
            return
        }
        // Update including icon
        _, err = h.DB.Exec("UPDATE board_of_directors SET title=?, icon=?, icon_bg=?, description=? WHERE id=?",
            title, iconPath, iconBg, description, id)
    } else {
        // Update without icon
        _, err = h.DB.Exec("UPDATE board_of_directors SET title=?, icon_bg=?, description=? WHERE id=?",
            title, iconBg, description, id)
    }

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "BOD updated successfully"})
}

// DELETE /admin/bods/:id - Delete BOD by ID
func (h *BodHandler) DeleteBod(c *gin.Context) {
    idStr := c.Param("id")
    id, err := strconv.Atoi(idStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid BOD ID"})
        return
    }
    _, err = h.DB.Exec("DELETE FROM board_of_directors WHERE id=?", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "BOD deleted successfully"})
}
*/