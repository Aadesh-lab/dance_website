package admin

import (
	"crypto/subtle"
	"net/http"

	"lldance_backend/config"
	"lldance_backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type loginInput struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var in loginInput
	if err := c.ShouldBindJSON(&in); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cfg := config.AppConfig
	if cfg.AdminUsername == "" || cfg.AdminPassword == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "admin credentials not configured"})
		return
	}
	uOK := subtle.ConstantTimeCompare([]byte(in.Username), []byte(cfg.AdminUsername)) == 1
	pOK := subtle.ConstantTimeCompare([]byte(in.Password), []byte(cfg.AdminPassword)) == 1
	if !uOK || !pOK {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}
	token, err := utils.GenerateJWT(1, in.Username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token})
}

func Me(c *gin.Context) {
	username, _ := c.Get("email")
	c.JSON(http.StatusOK, gin.H{"username": username})
}
