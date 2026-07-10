package admin

import (
	"net/http"

	"lldance_backend/internal/db"
	"lldance_backend/internal/models"

	"github.com/gin-gonic/gin"
)

func ListSubmissions(c *gin.Context) {
	var items []models.Submission
	db.DB.Order("created_at desc").Find(&items)
	c.JSON(http.StatusOK, items)
}

func DeleteSubmission(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Submission{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
