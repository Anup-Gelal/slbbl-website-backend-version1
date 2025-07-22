package handlers

import (
  "database/sql"
  "net/http"
  "path/filepath"

  "github.com/gin-gonic/gin"
  "slbbl/internal/models"
)

type ProductHandler struct {
  DB         *sql.DB
  UploadPath string
}

func NewProductHandler(db *sql.DB, uploadPath string) *ProductHandler {
  return &ProductHandler{DB: db, UploadPath: uploadPath}
}

func (h *ProductHandler) GetAllProductsPublic(c *gin.Context) {
  rows, err := h.DB.Query("SELECT id, title, icon, description FROM products ORDER BY id DESC")
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var products []models.Product
  for rows.Next() {
    var p models.Product
    if err := rows.Scan(&p.ID, &p.Title, &p.Icon, &p.Description); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }
    products = append(products, p)
  }
  c.JSON(http.StatusOK, products)
}
// Public and admin GET share same logic
func (h *ProductHandler) GetAllProducts(c *gin.Context) {
  rows, err := h.DB.Query("SELECT id, title, icon, description FROM products ORDER BY id DESC")
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  defer rows.Close()

  var products []models.Product
  for rows.Next() {
    var p models.Product
    if err := rows.Scan(&p.ID, &p.Title, &p.Icon, &p.Description); err != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
      return
    }
    products = append(products, p)
  }
  c.JSON(http.StatusOK, products)
}

func (h *ProductHandler) CreateProduct(c *gin.Context) {
  title := c.PostForm("title")
  description := c.PostForm("description")
  file, err := c.FormFile("icon")
  if title == "" || description == "" || err != nil {
    c.JSON(http.StatusBadRequest, gin.H{"error": "title, description and icon image are required"})
    return
  }

  filename := filepath.Base(file.Filename)
  dest := filepath.Join(h.UploadPath, filename)
  if err := c.SaveUploadedFile(file, dest); err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save icon image"})
    return
  }
  link := "/uploads/products/" + filename

  _, err = h.DB.Exec(
    "INSERT INTO products (title, icon, description) VALUES (?, ?, ?)",
    title, link, description,
  )
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }

  c.JSON(http.StatusCreated, gin.H{"message": "Product created successfully"})
}

func (h *ProductHandler) UpdateProduct(c *gin.Context) {
  id := c.Param("id")
  title := c.PostForm("title")
  description := c.PostForm("description")

  if title == "" || description == "" {
    c.JSON(http.StatusBadRequest, gin.H{"error": "title and description are required"})
    return
  }

  // optionally override icon
  file, err := c.FormFile("icon")
  if err == nil {
    filename := filepath.Base(file.Filename)
    dest := filepath.Join(h.UploadPath, filename)
    if saveErr := c.SaveUploadedFile(file, dest); saveErr != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save icon image"})
      return
    }
    link := "/uploads/products/" + filename
    _, execErr := h.DB.Exec(
      "UPDATE products SET title=?, description=?, icon=? WHERE id=?",
      title, description, link, id,
    )
    if execErr != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": execErr.Error()})
      return
    }
  } else {
    _, execErr := h.DB.Exec(
      "UPDATE products SET title=?, description=? WHERE id=?",
      title, description, id,
    )
    if execErr != nil {
      c.JSON(http.StatusInternalServerError, gin.H{"error": execErr.Error()})
      return
    }
  }

  c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}

func (h *ProductHandler) DeleteProduct(c *gin.Context) {
  id := c.Param("id")
  _, err := h.DB.Exec("DELETE FROM products WHERE id=?", id)
  if err != nil {
    c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
    return
  }
  c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
