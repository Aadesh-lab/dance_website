package admin

import (
	"net/http"

	"lldance_backend/internal/db"
	"lldance_backend/internal/models"

	"github.com/gin-gonic/gin"
)

func ListAdvantages(c *gin.Context) {
	var items []models.Advantage
	db.DB.Order("sort_order asc, id asc").Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateAdvantage(c *gin.Context) {
	var in models.Advantage
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	in.ID = 0
	if err := db.DB.Create(&in).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, in)
}

func UpdateAdvantage(c *gin.Context) {
	id := c.Param("id")
	var existing models.Advantage
	if err := db.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	var in models.Advantage
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	in.ID = existing.ID
	if err := db.DB.Save(&in).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, in)
}

func DeleteAdvantage(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Advantage{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
