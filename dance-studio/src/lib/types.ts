export type Course = {
  id?: number;
  slug: string;
  title: string;
  image: string;
  category: 'adult' | 'kids';
  description?: string;
  sortOrder?: number;
};

export type PricingPlan = {
  id?: number;
  name: string;
  price: number;
  duration: string;
  saveAmount?: string;
  highlight?: boolean;
  sortOrder?: number;
};

export type GalleryCategory = 'studio' | 'competitions' | 'certificates' | 'events';

export type GalleryItem = {
  id?: number;
  url: string;
  caption?: string;
  category?: GalleryCategory;
  sortOrder?: number;
};

export type Advantage = {
  id?: number;
  title: string;
  image: string;
  description: string;
  sortOrder?: number;
};

export type Reel = {
  id?: number;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  sortOrder?: number;
};

export type Certificate = {
  id?: number;
  title: string;
  image: string;
  description?: string;
  sortOrder?: number;
};

export type Teacher = {
  id?: number;
  name: string;
  specialty: string;
  image: string;
  bio?: string;
  quote?: string;
  quoteAuthor?: string;
  sortOrder?: number;
};

export type Testimonial = {
  id?: number;
  name: string;
  role?: string;
  quote: string;
  image?: string;
  rating?: number;
  sortOrder?: number;
};

export type Achievement = {
  id?: number;
  title: string;
  description: string;
  year?: string;
  image?: string;
  sortOrder?: number;
};

export type Submission = {
  id: number;
  name: string;
  phone: string;
  age?: string;
  style?: string;
  createdAt: string;
};

export type SiteSettings = {
  id?: number;
  // Global / business
  businessName: string;
  brandLine1?: string;
  brandLine2?: string;
  tagline: string;
  phone: string;
  email: string;
  location: string;
  whatsapp: string;
  mapEmbed: string;
  logo: string;
  navCtaLabel?: string;
  askQuestionLabel?: string;

  // Hero (home)
  heroHeadline: string;
  heroSubline: string;
  heroSub: string;
  heroVideo: string;
  heroCta?: string;
  heroWelcomeEyebrow?: string;
  heroCollage1?: string;
  heroCollage2?: string;
  heroCollage3?: string;
  heroCollage4?: string;

  // Home page — extra sections
  homeClassesEyebrow?: string;
  homeClassesHeading?: string;
  homeClassesCtaLabel?: string;
  homeGalleryEyebrow?: string;
  homeGalleryHeading?: string;
  homeGalleryCtaLabel?: string;

  // About page
  aboutEyebrow?: string;
  aboutHeading: string;
  aboutBody: string;
  aboutImage?: string;
  aboutWhoWeAreEyebrow?: string;

  // Classes page
  classesEyebrow?: string;
  classesHeading?: string;
  classesIntro?: string;
  classesAdultTabLabel?: string;
  classesKidsTabLabel?: string;
  classesSectionEyebrow?: string;
  classesSectionHeading?: string;

  // Pricing page / section
  pricingEyebrow?: string;
  pricingHeading?: string;
  pricingIntro?: string;
  pricingChoosePlanLabel?: string;

  // Gallery page
  galleryEyebrow?: string;
  galleryHeading?: string;
  galleryIntro?: string;
  galleryAllLabel?: string;
  galleryCatStudioLabel?: string;
  galleryCatCompetitionsLabel?: string;
  galleryCatCertificatesLabel?: string;
  galleryCatEventsLabel?: string;

  // Teachers page
  teachersEyebrow?: string;
  teachersHeading?: string;
  teachersIntro?: string;
  teachersHeroImage?: string;
  joinTeamEyebrow?: string;
  joinTeamHeading?: string;
  joinTeamBody?: string;
  joinTeamCtaLabel?: string;
  joinTeamImage?: string;
  teacherModalCtaLabel?: string;

  // Contact page
  contactEyebrow?: string;
  contactHeading?: string;
  contactIntro?: string;
  contactFormEyebrow?: string;
  contactFormHeading?: string;
  contactFormNameLabel?: string;
  contactFormEmailLabel?: string;
  contactFormSubjectLabel?: string;
  contactFormMessageLabel?: string;
  contactFormSubmitLabel?: string;
  contactFormSuccessMessage?: string;
  contactCardName?: string;
  contactCardTitle?: string;
  contactCardImage?: string;
  contactCardHeadline?: string;
  contactCardBody?: string;
  contactSchedule?: string;

  // Promo section
  promoEyebrow?: string;
  promoHeadline: string;
  promoBody: string;
  promoVideo: string;
  promoImage?: string;
  promoNumeral?: string;
  promoCtaLabel?: string;

  // Advantages section
  advantagesEyebrow?: string;
  advantagesHeading?: string;
  advantagesSubheading?: string;
  advantagesSubEyebrow?: string;
  advantagesQuote?: string;
  advantagesQuoteAuthor?: string;

  // Stats
  statsEyebrow?: string;
  statsHeading?: string;
  stat1Label: string;
  stat1Value: string;
  stat1Suffix: string;
  stat2Label: string;
  stat2Value: string;
  stat2Suffix: string;
  stat3Label: string;
  stat3Value: string;
  stat3Suffix: string;

  // Instructor
  instructorEyebrow?: string;
  instructorSectionHeading?: string;
  instructorName?: string;
  instructorTitle?: string;
  instructorBio?: string;
  instructorImage?: string;
  instructorInstagram?: string;

  // Testimonials
  testimonialsEyebrow?: string;
  testimonialsHeading?: string;
  testimonialsIntro?: string;

  // Achievements
  achievementsEyebrow?: string;
  achievementsHeading?: string;
  achievementsIntro?: string;

  // Certificates
  certificatesEyebrow?: string;
  certificatesHeading?: string;
  certificatesIntro?: string;

  // Reels
  reelsEyebrow?: string;
  reelsHeading?: string;

  // Footer
  footerTagline?: string;
  footerCopyright?: string;

  // Slot Picker Modal
  slotPickerHeading?: string;
  slotPickerSubtext?: string;
  slotPickerTimeHeading?: string;
  slotPickerDateHeading?: string;
  slotPickerSubmitLabel?: string;
  slotPickerSuccessMessage?: string;

  // Socials
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
};

export type SitePayload = {
  settings: SiteSettings;
  courses: Course[];
  pricing: PricingPlan[];
  gallery: GalleryItem[];
  advantages: Advantage[];
  reels: Reel[];
  certificates: Certificate[];
  teachers: Teacher[];
  testimonials: Testimonial[];
  achievements: Achievement[];
};

export type StatTuple = { label: string; value: number; suffix?: string };

export function statsFromSettings(s: SiteSettings): StatTuple[] {
  return [
    { label: s.stat1Label, value: parseInt(s.stat1Value || '0', 10), suffix: s.stat1Suffix || undefined },
    { label: s.stat2Label, value: parseInt(s.stat2Value || '0', 10), suffix: s.stat2Suffix || undefined },
    { label: s.stat3Label, value: parseInt(s.stat3Value || '0', 10), suffix: s.stat3Suffix || undefined },
  ].filter((s) => s.label);
}
