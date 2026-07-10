package main

import (
	"log"
	"mime"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"lldance_backend/config"
	"lldance_backend/internal/db"
	"lldance_backend/internal/minioclient"
	"lldance_backend/internal/models"
)

func main() {
	config.LoadConfig()
	db.ConnectToDB()
	sqlDB, err := db.DB.DB()
	if err != nil {
		log.Fatalf("Failed to get SQL DB: %v", err)
	}
	defer func() {
		if err := sqlDB.Close(); err != nil {
			log.Printf("Error closing DB: %v", err)
		}
	}()

	log.Printf("Connected to database: %v", db.DB.Dialector.Name())

	err = db.DB.AutoMigrate(
		&models.SiteSetting{},
		&models.Course{},
		&models.PricingPlan{},
		&models.GalleryItem{},
		&models.Advantage{},
		&models.Reel{},
		&models.Submission{},
		&models.Certificate{},
		&models.Teacher{},
		&models.Testimonial{},
		&models.Achievement{},
	)
	if err != nil {
		log.Fatal(err)
	}
	log.Println("All models migrated successfully")

	seed()
	seedAssets()
	backfillCourseImages()
}

func seed() {
	var settingCount int64
	db.DB.Model(&models.SiteSetting{}).Count(&settingCount)
	if settingCount == 0 {
		db.DB.Create(&models.SiteSetting{
			ID:            1,
			BusinessName:  "Let's Learn Dance Studio",
			Tagline:       "Learn • Perform • Shine",
			Phone:         "7558396516",
			Email:         "letslearn631@gmail.com",
			Location:      "Chhatrapati Sambhajinagar, Maharashtra",
			Logo:          "/logo.jpeg",
			HeroHeadline:  "In 12 years we have taught over 7000 people to dance. Try it!",
			HeroSub:       "Sign up for a free trial class in any style and lock in the price for your first membership.",
			PromoHeadline: "Discover the bright world of dance",
			PromoBody:     "Come to a free trial class and feel the energy of dance in one of the many styles of the center.",
			Stat1Label:    "Students Trained",
			Stat1Value:    "500",
			Stat1Suffix:   "+",
			Stat2Label:    "Years Experience",
			Stat2Value:    "10",
			Stat2Suffix:   "+",
			Stat3Label:    "Dance Styles",
			Stat3Value:    "8",
			Stat3Suffix:   "+",
		})
		log.Println("Seeded site settings")
	}

	var courseCount int64
	db.DB.Model(&models.Course{}).Count(&courseCount)
	if courseCount == 0 {
		courses := []models.Course{
			{Slug: "hip-hop", Title: "Hip Hop", Category: "adult", SortOrder: 1, Description: "Energetic street style with attitude."},
			{Slug: "choreography", Title: "Choreography", Category: "adult", SortOrder: 2, Description: "Expressive contemporary routines."},
			{Slug: "dancehall", Title: "Dancehall", Category: "adult", SortOrder: 3, Description: "Caribbean rhythms and vibe."},
			{Slug: "vogue", Title: "Vogue", Category: "adult", SortOrder: 4, Description: "Sharp, stylised runway movement."},
			{Slug: "kids-hip-hop", Title: "Kids Hip Hop", Category: "kids", SortOrder: 1, Description: "Fun & funky beats for ages 5+."},
			{Slug: "kids-bollywood", Title: "Kids Bollywood", Category: "kids", SortOrder: 2, Description: "Colourful Bollywood choreography for young dancers."},
			{Slug: "kids-contemporary", Title: "Kids Contemporary", Category: "kids", SortOrder: 3, Description: "Expressive movement for ages 8+."},
			{Slug: "kids-freestyle", Title: "Kids Freestyle", Category: "kids", SortOrder: 4, Description: "Confidence-building freestyle for teens."},
		}
		db.DB.Create(&courses)
		log.Println("Seeded courses")
	}

	var pricingCount int64
	db.DB.Model(&models.PricingPlan{}).Count(&pricingCount)
	if pricingCount == 0 {
		plans := []models.PricingPlan{
			{Name: "1 Month", Price: 1200, Duration: "1 month", SortOrder: 1},
			{Name: "3 Months", Price: 3300, Duration: "3 months", SaveAmount: "300", Highlight: true, SortOrder: 2},
			{Name: "6 Months", Price: 6300, Duration: "6 months", SaveAmount: "900", SortOrder: 3},
		}
		db.DB.Create(&plans)
		log.Println("Seeded pricing")
	}
}

// seedAssets uploads files from ASSETS_DIR to MinIO and populates the
// Gallery (images) / Reels (videos) tables — only when both tables are empty,
// so it runs at most once (e.g. on the first Railway deploy).
func seedAssets() {
	dir := os.Getenv("ASSETS_DIR")
	if dir == "" {
		dir = "./assets"
	}
	info, err := os.Stat(dir)
	if err != nil || !info.IsDir() {
		log.Printf("Asset seed: directory %q not found, skipping", dir)
		return
	}

	var galleryCount, reelCount int64
	db.DB.Model(&models.GalleryItem{}).Count(&galleryCount)
	db.DB.Model(&models.Reel{}).Count(&reelCount)
	if galleryCount > 0 && reelCount > 0 {
		log.Println("Asset seed: gallery + reels already populated, skipping")
		return
	}

	if err := minioclient.Init(); err != nil {
		log.Printf("Asset seed: MinIO init failed: %v", err)
		return
	}
	if minioclient.Client == nil {
		log.Println("Asset seed: MinIO not configured, skipping")
		return
	}

	entries, err := os.ReadDir(dir)
	if err != nil {
		log.Printf("Asset seed: read dir failed: %v", err)
		return
	}

	names := make([]string, 0, len(entries))
	for _, e := range entries {
		if !e.IsDir() {
			names = append(names, e.Name())
		}
	}
	sort.Strings(names)

	imgIdx, vidIdx := 0, 0
	for _, name := range names {
		full := filepath.Join(dir, name)
		f, err := os.Open(full)
		if err != nil {
			log.Printf("Asset seed: open %s: %v", name, err)
			continue
		}
		ct := mime.TypeByExtension(strings.ToLower(filepath.Ext(name)))
		if ct == "" {
			ct = "application/octet-stream"
		}
		url, err := minioclient.Upload(f, name, ct)
		f.Close()
		if err != nil {
			log.Printf("Asset seed: upload %s: %v", name, err)
			continue
		}

		if strings.HasPrefix(ct, "video/") {
			if reelCount == 0 {
				vidIdx++
				db.DB.Create(&models.Reel{
					Title:     "Studio Reel " + itoa(vidIdx),
					VideoURL:  url,
					SortOrder: vidIdx,
				})
			}
		} else {
			if galleryCount == 0 {
				imgIdx++
				db.DB.Create(&models.GalleryItem{
					URL:       url,
					Caption:   "",
					SortOrder: imgIdx,
				})
			}
		}
	}
	log.Printf("Asset seed: %d images, %d videos uploaded", imgIdx, vidIdx)
}

// backfillCourseImages assigns the first few uploaded gallery images to any
// courses that don't yet have an image set. Runs every boot but is cheap.
func backfillCourseImages() {
	var courses []models.Course
	if err := db.DB.Where("image = '' OR image IS NULL").Order("sort_order asc, id asc").Find(&courses).Error; err != nil {
		return
	}
	if len(courses) == 0 {
		return
	}

	var pool []models.GalleryItem
	db.DB.Order("id asc").Limit(len(courses)).Find(&pool)
	if len(pool) == 0 {
		return
	}

	for i, c := range courses {
		if i >= len(pool) {
			break
		}
		c.Image = pool[i].URL
		db.DB.Save(&c)
	}
	log.Printf("Backfill: attached images to %d courses", min(len(courses), len(pool)))
}

func itoa(n int) string {
	if n == 0 {
		return "0"
	}
	s := ""
	for n > 0 {
		s = string(rune('0'+n%10)) + s
		n /= 10
	}
	return s
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
