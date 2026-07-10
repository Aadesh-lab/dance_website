package admin

import (
	"net/http"

	"lldance_backend/internal/db"
	"lldance_backend/internal/models"

	"github.com/gin-gonic/gin"
)

func ListTeachers(c *gin.Context) {
	var items []models.Teacher
	db.DB.Order("sort_order asc, id asc").Find(&items)
	c.JSON(http.StatusOK, items)
}

func CreateTeacher(c *gin.Context) {
	var in models.Teacher
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

func UpdateTeacher(c *gin.Context) {
	id := c.Param("id")
	var existing models.Teacher
	if err := db.DB.First(&existing, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	var in models.Teacher
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

func DeleteTeacher(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Teacher{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
