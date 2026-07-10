package models

import "time"

type SiteSetting struct {
	ID uint `gorm:"primaryKey" json:"id"`

	// Global / business
	BusinessName     string `json:"businessName"`
	BrandLine1       string `json:"brandLine1"`
	BrandLine2       string `json:"brandLine2"`
	Tagline          string `json:"tagline"`
	Phone            string `json:"phone"`
	Email            string `json:"email"`
	Location         string `json:"location"`
	WhatsApp         string `json:"whatsapp"`
	MapEmbed         string `gorm:"type:text" json:"mapEmbed"`
	Logo             string `json:"logo"`
	NavCTALabel      string `json:"navCtaLabel"`
	AskQuestionLabel string `json:"askQuestionLabel"`

	// Hero (home)
	HeroHeadline       string `json:"heroHeadline"`
	HeroSubline        string `json:"heroSubline"`
	HeroSub            string `gorm:"type:text" json:"heroSub"`
	HeroVideo          string `json:"heroVideo"`
	HeroCTA            string `json:"heroCta"`
	HeroWelcomeEyebrow string `json:"heroWelcomeEyebrow"`
	HeroCollage1       string `json:"heroCollage1"`
	HeroCollage2       string `json:"heroCollage2"`
	HeroCollage3       string `json:"heroCollage3"`
	HeroCollage4       string `json:"heroCollage4"`

	// Home page — extra sections
	HomeClassesEyebrow  string `json:"homeClassesEyebrow"`
	HomeClassesHeading  string `json:"homeClassesHeading"`
	HomeClassesCTALabel string `json:"homeClassesCtaLabel"`
	HomeGalleryEyebrow  string `json:"homeGalleryEyebrow"`
	HomeGalleryHeading  string `json:"homeGalleryHeading"`
	HomeGalleryCTALabel string `json:"homeGalleryCtaLabel"`

	// About page
	AboutEyebrow         string `json:"aboutEyebrow"`
	AboutHeading         string `json:"aboutHeading"`
	AboutBody            string `gorm:"type:text" json:"aboutBody"`
	AboutImage           string `json:"aboutImage"`
	AboutWhoWeAreEyebrow string `json:"aboutWhoWeAreEyebrow"`

	// Classes page
	ClassesEyebrow        string `json:"classesEyebrow"`
	ClassesHeading        string `json:"classesHeading"`
	ClassesIntro          string `gorm:"type:text" json:"classesIntro"`
	ClassesAdultTabLabel  string `json:"classesAdultTabLabel"`
	ClassesKidsTabLabel   string `json:"classesKidsTabLabel"`
	ClassesSectionEyebrow string `json:"classesSectionEyebrow"`
	ClassesSectionHeading string `json:"classesSectionHeading"`

	// Pricing page / section
	PricingEyebrow         string `json:"pricingEyebrow"`
	PricingHeading         string `json:"pricingHeading"`
	PricingIntro           string `gorm:"type:text" json:"pricingIntro"`
	PricingChoosePlanLabel string `json:"pricingChoosePlanLabel"`

	// Gallery page
	GalleryEyebrow              string `json:"galleryEyebrow"`
	GalleryHeading              string `json:"galleryHeading"`
	GalleryIntro                string `gorm:"type:text" json:"galleryIntro"`
	GalleryAllLabel             string `json:"galleryAllLabel"`
	GalleryCatStudioLabel       string `json:"galleryCatStudioLabel"`
	GalleryCatCompetitionsLabel string `json:"galleryCatCompetitionsLabel"`
	GalleryCatCertificatesLabel string `json:"galleryCatCertificatesLabel"`
	GalleryCatEventsLabel       string `json:"galleryCatEventsLabel"`

	// Teachers page
	TeachersEyebrow  string `json:"teachersEyebrow"`
	TeachersHeading  string `json:"teachersHeading"`
	TeachersIntro    string `gorm:"type:text" json:"teachersIntro"`
	TeachersHeroImage string `json:"teachersHeroImage"`
	JoinTeamEyebrow  string `json:"joinTeamEyebrow"`
	JoinTeamHeading  string `json:"joinTeamHeading"`
	JoinTeamBody     string `gorm:"type:text" json:"joinTeamBody"`
	JoinTeamCTALabel string `json:"joinTeamCtaLabel"`
	JoinTeamImage    string `json:"joinTeamImage"`
	TeacherModalCTALabel string `json:"teacherModalCtaLabel"`

	// Contact page
	ContactEyebrow            string `json:"contactEyebrow"`
	ContactHeading            string `json:"contactHeading"`
	ContactIntro              string `gorm:"type:text" json:"contactIntro"`
	ContactFormEyebrow        string `json:"contactFormEyebrow"`
	ContactFormHeading        string `json:"contactFormHeading"`
	ContactFormNameLabel      string `json:"contactFormNameLabel"`
	ContactFormEmailLabel     string `json:"contactFormEmailLabel"`
	ContactFormSubjectLabel   string `json:"contactFormSubjectLabel"`
	ContactFormMessageLabel   string `json:"contactFormMessageLabel"`
	ContactFormSubmitLabel    string `json:"contactFormSubmitLabel"`
	ContactFormSuccessMessage string `gorm:"type:text" json:"contactFormSuccessMessage"`
	ContactCardName           string `json:"contactCardName"`
	ContactCardTitle          string `json:"contactCardTitle"`
	ContactCardImage          string `json:"contactCardImage"`
	ContactCardHeadline       string `gorm:"type:text" json:"contactCardHeadline"`
	ContactCardBody           string `gorm:"type:text" json:"contactCardBody"`
	ContactSchedule           string `gorm:"type:text" json:"contactSchedule"`

	// Promo section
	PromoEyebrow  string `json:"promoEyebrow"`
	PromoHeadline string `json:"promoHeadline"`
	PromoBody     string `gorm:"type:text" json:"promoBody"`
	PromoVideo    string `json:"promoVideo"`
	PromoImage    string `json:"promoImage"`
	PromoNumeral  string `json:"promoNumeral"`
	PromoCTALabel string `json:"promoCtaLabel"`

	// Advantages section
	AdvantagesEyebrow     string `json:"advantagesEyebrow"`
	AdvantagesHeading     string `json:"advantagesHeading"`
	AdvantagesSubheading  string `json:"advantagesSubheading"`
	AdvantagesSubEyebrow  string `json:"advantagesSubEyebrow"`
	AdvantagesQuote       string `gorm:"type:text" json:"advantagesQuote"`
	AdvantagesQuoteAuthor string `json:"advantagesQuoteAuthor"`

	// Stats
	StatsEyebrow string `json:"statsEyebrow"`
	StatsHeading string `json:"statsHeading"`
	Stat1Label   string `json:"stat1Label"`
	Stat1Value   string `json:"stat1Value"`
	Stat1Suffix  string `json:"stat1Suffix"`
	Stat2Label   string `json:"stat2Label"`
	Stat2Value   string `json:"stat2Value"`
	Stat2Suffix  string `json:"stat2Suffix"`
	Stat3Label   string `json:"stat3Label"`
	Stat3Value   string `json:"stat3Value"`
	Stat3Suffix  string `json:"stat3Suffix"`

	// Instructor
	InstructorEyebrow        string `json:"instructorEyebrow"`
	InstructorSectionHeading string `json:"instructorSectionHeading"`
	InstructorName           string `json:"instructorName"`
	InstructorTitle          string `json:"instructorTitle"`
	InstructorBio            string `gorm:"type:text" json:"instructorBio"`
	InstructorImage          string `json:"instructorImage"`
	InstructorInstagram      string `json:"instructorInstagram"`

	// Testimonials
	TestimonialsEyebrow string `json:"testimonialsEyebrow"`
	TestimonialsHeading string `json:"testimonialsHeading"`
	TestimonialsIntro   string `gorm:"type:text" json:"testimonialsIntro"`

	// Achievements
	AchievementsEyebrow string `json:"achievementsEyebrow"`
	AchievementsHeading string `json:"achievementsHeading"`
	AchievementsIntro   string `gorm:"type:text" json:"achievementsIntro"`

	// Certificates
	CertificatesEyebrow string `json:"certificatesEyebrow"`
	CertificatesHeading string `json:"certificatesHeading"`
	CertificatesIntro   string `gorm:"type:text" json:"certificatesIntro"`

	// Reels
	ReelsEyebrow string `json:"reelsEyebrow"`
	ReelsHeading string `json:"reelsHeading"`

	// Footer
	FooterTagline   string `json:"footerTagline"`
	FooterCopyright string `json:"footerCopyright"`

	// Slot Picker Modal
	SlotPickerHeading        string `json:"slotPickerHeading"`
	SlotPickerSubtext        string `gorm:"type:text" json:"slotPickerSubtext"`
	SlotPickerTimeHeading    string `json:"slotPickerTimeHeading"`
	SlotPickerDateHeading    string `json:"slotPickerDateHeading"`
	SlotPickerSubmitLabel    string `json:"slotPickerSubmitLabel"`
	SlotPickerSuccessMessage string `gorm:"type:text" json:"slotPickerSuccessMessage"`

	// Socials
	Facebook  string `json:"facebook"`
	Instagram string `json:"instagram"`
	Twitter   string `json:"twitter"`
	YouTube   string `json:"youtube"`
}

type Course struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Slug        string `gorm:"uniqueIndex" json:"slug"`
	Title       string `json:"title"`
	Image       string `json:"image"`
	Category    string `json:"category"`
	Description string `gorm:"type:text" json:"description"`
	SortOrder   int    `json:"sortOrder"`
}

type PricingPlan struct {
	ID         uint   `gorm:"primaryKey" json:"id"`
	Name       string `json:"name"`
	Price      int    `json:"price"`
	Duration   string `json:"duration"`
	SaveAmount string `json:"saveAmount"`
	Highlight  bool   `json:"highlight"`
	SortOrder  int    `json:"sortOrder"`
}

type GalleryItem struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	URL       string `json:"url"`
	Caption   string `json:"caption"`
	Category  string `gorm:"default:studio" json:"category"`
	SortOrder int    `json:"sortOrder"`
}

type Advantage struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Title       string `json:"title"`
	Image       string `json:"image"`
	Description string `gorm:"type:text" json:"description"`
	SortOrder   int    `json:"sortOrder"`
}

type Reel struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	Title        string `json:"title"`
	VideoURL     string `json:"videoUrl"`
	ThumbnailURL string `json:"thumbnailUrl"`
	SortOrder    int    `json:"sortOrder"`
}

type Certificate struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Title       string `json:"title"`
	Image       string `json:"image"`
	Description string `gorm:"type:text" json:"description"`
	SortOrder   int    `json:"sortOrder"`
}

type Teacher struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `json:"name"`
	Specialty   string `json:"specialty"`
	Image       string `json:"image"`
	Bio         string `gorm:"type:text" json:"bio"`
	Quote       string `gorm:"type:text" json:"quote"`
	QuoteAuthor string `json:"quoteAuthor"`
	SortOrder   int    `json:"sortOrder"`
}

type Testimonial struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Name      string `json:"name"`
	Role      string `json:"role"`
	Quote     string `gorm:"type:text" json:"quote"`
	Image     string `json:"image"`
	Rating    int    `json:"rating"`
	SortOrder int    `json:"sortOrder"`
}

type Achievement struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Title       string `json:"title"`
	Description string `gorm:"type:text" json:"description"`
	Year        string `json:"year"`
	Image       string `json:"image"`
	SortOrder   int    `json:"sortOrder"`
}

type Submission struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `json:"name"`
	Phone     string    `json:"phone"`
	Age       string    `json:"age"`
	Style     string    `json:"style"`
	CreatedAt time.Time `json:"createdAt"`
}
