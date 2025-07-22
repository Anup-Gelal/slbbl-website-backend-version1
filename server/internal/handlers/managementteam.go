package handlers

import (
    "database/sql"
    "net/http"
    "path/filepath"
    "strconv"

    "github.com/gin-gonic/gin"
    "slbbl/internal/models"
)

type ManagementHandler struct {
    DB *sql.DB
}

func NewManagementHandler(db *sql.DB) *ManagementHandler {
    return &ManagementHandler{DB: db}
}



// GET /managements - Public route to fetch all managements
func (h *ManagementHandler) GetPublicManagement(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, title, icon, icon_bg, description FROM management_team")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    bods := []models.Management{}
    for rows.Next() {
        var bod models.Management
        if err := rows.Scan(&bod.ID, &bod.Title, &bod.Icon, &bod.IconBg, &bod.Description); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        bods = append(bods, bod)
    }
    c.JSON(http.StatusOK, bods)
}


// GET /admin/managements
func (h *ManagementHandler) GetAllMgteams(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, title, icon, icon_bg, description FROM management_team")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var list []models.Management
    for rows.Next() {
        var m models.Management
        if err := rows.Scan(&m.ID, &m.Title, &m.Icon, &m.IconBg, &m.Description); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        list = append(list, m)
    }

    c.JSON(http.StatusOK, list)
}

// POST /admin/managements
func (h *ManagementHandler) CreateMgTeam(c *gin.Context) {
    title := c.PostForm("title")
    iconBg := c.PostForm("icon_bg")
    desc := c.PostForm("description")

    var iconPath string
    file, err := c.FormFile("icon")
    if err == nil {
        filename := filepath.Base(file.Filename)
        iconPath = "uploads/managements/" + filename
        if err := c.SaveUploadedFile(file, iconPath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
            return
        }
    }

    res, err := h.DB.Exec("INSERT INTO management_team (title, icon, icon_bg, description) VALUES (?, ?, ?, ?)",
        title, iconPath, iconBg, desc)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    id, _ := res.LastInsertId()
    c.JSON(http.StatusCreated, gin.H{"id": id})
}

// PUT /admin/managements/:id
func (h *ManagementHandler) UpdateMgTeam(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    title := c.PostForm("title")
    iconBg := c.PostForm("icon_bg")
    desc := c.PostForm("description")

    var iconPath string
    file, err := c.FormFile("icon")
    if err == nil {
        filename := filepath.Base(file.Filename)
        iconPath = "uploads/managements/" + filename
        if err := c.SaveUploadedFile(file, iconPath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image"})
            return
        }

        _, err = h.DB.Exec("UPDATE management_team SET title=?, icon=?, icon_bg=?, description=? WHERE id=?",
            title, iconPath, iconBg, desc, id)
    } else {
        _, err = h.DB.Exec("UPDATE management_team SET title=?, icon_bg=?, description=? WHERE id=?",
            title, iconBg, desc, id)
    }

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

// DELETE /admin/managements/:id
func (h *ManagementHandler) DeleteMgTeam(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    _, err := h.DB.Exec("DELETE FROM management_team WHERE id=?", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Deleted successfully"})
}
