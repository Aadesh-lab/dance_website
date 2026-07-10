package public

import (
	"net/http"
	"strings"

	"lldance_backend/internal/db"
	"lldance_backend/internal/models"

	"github.com/gin-gonic/gin"
)

type submissionInput struct {
	Name  string `json:"name" binding:"required"`
	Phone string `json:"phone" binding:"required"`
	Age   string `json:"age"`
	Style string `json:"style"`
}

func CreateSubmission(c *gin.Context) {
	var in submissionInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	s := models.Submission{
		Name:  strings.TrimSpace(in.Name),
		Phone: strings.TrimSpace(in.Phone),
		Age:   strings.TrimSpace(in.Age),
		Style: strings.TrimSpace(in.Style),
	}
	if err := db.DB.Create(&s).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, s)
}
