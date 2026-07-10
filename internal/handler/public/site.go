package public

import (
	"net/http"

	"lldance_backend/internal/db"
	"lldance_backend/internal/models"

	"github.com/gin-gonic/gin"
)

func GetSite(c *gin.Context) {
	var setting models.SiteSetting
	db.DB.First(&setting, 1)

	var courses []models.Course
	db.DB.Order("sort_order asc, id asc").Find(&courses)

	var pricing []models.PricingPlan
	db.DB.Order("sort_order asc, id asc").Find(&pricing)

	var gallery []models.GalleryItem
	db.DB.Order("sort_order asc, id asc").Find(&gallery)

	var advantages []models.Advantage
	db.DB.Order("sort_order asc, id asc").Find(&advantages)

	var reels []models.Reel
	db.DB.Order("sort_order asc, id asc").Find(&reels)

	var certificates []models.Certificate
	db.DB.Order("sort_order asc, id asc").Find(&certificates)

	var teachers []models.Teacher
	db.DB.Order("sort_order asc, id asc").Find(&teachers)

	var testimonials []models.Testimonial
	db.DB.Order("sort_order asc, id asc").Find(&testimonials)

	var achievements []models.Achievement
	db.DB.Order("sort_order asc, id asc").Find(&achievements)

	c.JSON(http.StatusOK, gin.H{
		"settings":     setting,
		"courses":      courses,
		"pricing":      pricing,
		"gallery":      gallery,
		"advantages":   advantages,
		"reels":        reels,
		"certificates": certificates,
		"teachers":     teachers,
		"testimonials": testimonials,
		"achievements": achievements,
	})
}
