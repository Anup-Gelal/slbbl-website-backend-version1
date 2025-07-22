package handlers

import (
    "database/sql"
    "net/http"
    "path/filepath"
    "strconv"

    "github.com/gin-gonic/gin"
    "slbbl/internal/models"
)

type SebonDisclosureHandler struct {
    DB         *sql.DB
    UploadPath string
}

func NewSebonDisclosureHandler(db *sql.DB, uploadPath string) *SebonDisclosureHandler {
    return &SebonDisclosureHandler{DB: db, UploadPath: uploadPath}
}

// GET /sebon-disclosures - public
func (h *SebonDisclosureHandler) GetAllPublicDisclosures(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, disclosure_name, file_link FROM sebon_disclosures ORDER BY id DESC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var disclosures []models.SebonDisclosure
    for rows.Next() {
        var d models.SebonDisclosure
        if err := rows.Scan(&d.ID, &d.DisclosureName, &d.FileLink); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        disclosures = append(disclosures, d)
    }

    c.JSON(http.StatusOK, disclosures)
}

func (h *SebonDisclosureHandler) GetAllDisclosures(c *gin.Context) {
    rows, err := h.DB.Query("SELECT id, disclosure_name, file_link FROM sebon_disclosures ORDER BY id DESC")
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    defer rows.Close()

    var disclosures []models.SebonDisclosure
    for rows.Next() {
        var d models.SebonDisclosure
        if err := rows.Scan(&d.ID, &d.DisclosureName, &d.FileLink); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        disclosures = append(disclosures, d)
    }

    c.JSON(http.StatusOK, disclosures)
}


// POST /admin/sebon-disclosures
func (h *SebonDisclosureHandler) CreateDisclosure(c *gin.Context) {
    name := c.PostForm("disclosureName")
    file, err := c.FormFile("file")
    if name == "" || err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Name and file are required"})
        return
    }

    filename := filepath.Base(file.Filename)
    fullPath := filepath.Join(h.UploadPath, filename)
    if err := c.SaveUploadedFile(file, fullPath); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
        return
    }

    fileLink := "/uploads/sebon_disclosures/" + filename
    res, err := h.DB.Exec("INSERT INTO sebon_disclosures (disclosure_name, file_link) VALUES (?, ?)", name, fileLink)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    id, _ := res.LastInsertId()
    c.JSON(http.StatusCreated, gin.H{"id": id, "disclosureName": name, "fileLink": fileLink})
}

// PUT /admin/sebon-disclosures/:id
func (h *SebonDisclosureHandler) UpdateDisclosure(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    name := c.PostForm("disclosureName")

    var fileLink string
    file, err := c.FormFile("file")
    if err == nil {
        filename := filepath.Base(file.Filename)
        fullPath := filepath.Join(h.UploadPath, filename)
        if err := c.SaveUploadedFile(file, fullPath); err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
            return
        }
        fileLink = "/uploads/sebon_disclosures/" + filename
        _, err = h.DB.Exec("UPDATE sebon_disclosures SET disclosure_name=?, file_link=? WHERE id=?", name, fileLink, id)
    } else {
        _, err = h.DB.Exec("UPDATE sebon_disclosures SET disclosure_name=? WHERE id=?", name, id)
    }

    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Disclosure updated successfully"})
}

// DELETE /admin/sebon-disclosures/:id
func (h *SebonDisclosureHandler) DeleteDisclosure(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    _, err := h.DB.Exec("DELETE FROM sebon_disclosures WHERE id=?", id)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Disclosure deleted successfully"})
}
