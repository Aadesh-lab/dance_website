package admin

import (
	"net/http"

	"lldance_backend/internal/db"
	"lldance_backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetSettings(c *gin.Context) {
	var s models.SiteSetting
	if err := db.DB.First(&s, 1).Error; err != nil {
		s = models.SiteSetting{ID: 1}
		db.DB.Create(&s)
	}
	c.JSON(http.StatusOK, s)
}

func UpdateSettings(c *gin.Context) {
	var in models.SiteSetting
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	in.ID = 1
	if err := db.DB.Save(&in).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, in)
}
