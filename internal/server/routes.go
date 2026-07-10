package server

import (
	"lldance_backend/internal/handler"
	"lldance_backend/internal/handler/admin"
	"lldance_backend/internal/handler/public"
	"lldance_backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/health", handler.HealthCheck)

		pub := api.Group("/public")
		{
			pub.GET("/site", public.GetSite)
			pub.POST("/submissions", public.CreateSubmission)
		}

		adm := api.Group("/admin")
		{
			adm.POST("/login", admin.Login)

			auth := adm.Group("")
			auth.Use(middleware.AuthMiddleware())
			{
				auth.GET("/me", admin.Me)

				auth.GET("/settings", admin.GetSettings)
				auth.PUT("/settings", admin.UpdateSettings)

				auth.GET("/courses", admin.ListCourses)
				auth.POST("/courses", admin.CreateCourse)
				auth.PUT("/courses/:id", admin.UpdateCourse)
				auth.DELETE("/courses/:id", admin.DeleteCourse)

				auth.GET("/pricing", admin.ListPricing)
				auth.POST("/pricing", admin.CreatePricing)
				auth.PUT("/pricing/:id", admin.UpdatePricing)
				auth.DELETE("/pricing/:id", admin.DeletePricing)

				auth.GET("/gallery", admin.ListGallery)
				auth.POST("/gallery", admin.CreateGallery)
				auth.PUT("/gallery/:id", admin.UpdateGallery)
				auth.DELETE("/gallery/:id", admin.DeleteGallery)

				auth.GET("/advantages", admin.ListAdvantages)
				auth.POST("/advantages", admin.CreateAdvantage)
				auth.PUT("/advantages/:id", admin.UpdateAdvantage)
				auth.DELETE("/advantages/:id", admin.DeleteAdvantage)

				auth.GET("/reels", admin.ListReels)
				auth.POST("/reels", admin.CreateReel)
				auth.PUT("/reels/:id", admin.UpdateReel)
				auth.DELETE("/reels/:id", admin.DeleteReel)

				auth.GET("/certificates", admin.ListCertificates)
				auth.POST("/certificates", admin.CreateCertificate)
				auth.PUT("/certificates/:id", admin.UpdateCertificate)
				auth.DELETE("/certificates/:id", admin.DeleteCertificate)

				auth.GET("/teachers", admin.ListTeachers)
				auth.POST("/teachers", admin.CreateTeacher)
				auth.PUT("/teachers/:id", admin.UpdateTeacher)
				auth.DELETE("/teachers/:id", admin.DeleteTeacher)

				auth.GET("/testimonials", admin.ListTestimonials)
				auth.POST("/testimonials", admin.CreateTestimonial)
				auth.PUT("/testimonials/:id", admin.UpdateTestimonial)
				auth.DELETE("/testimonials/:id", admin.DeleteTestimonial)

				auth.GET("/achievements", admin.ListAchievements)
				auth.POST("/achievements", admin.CreateAchievement)
				auth.PUT("/achievements/:id", admin.UpdateAchievement)
				auth.DELETE("/achievements/:id", admin.DeleteAchievement)

				auth.GET("/submissions", admin.ListSubmissions)
				auth.DELETE("/submissions/:id", admin.DeleteSubmission)

				auth.POST("/upload", admin.Upload)
			}
		}
	}
}
