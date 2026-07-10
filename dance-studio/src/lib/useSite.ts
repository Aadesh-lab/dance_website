import { useEffect, useState } from 'react';
import { api } from './api';
import type { SitePayload, Testimonial, Achievement, Teacher } from './types';

const FALLBACK_TEACHERS: Teacher[] = [
  {
    name: 'Isabella Rossi',
    specialty: 'Ballet',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=800&auto=format&fit=crop',
    bio: 'Principal ballet instructor with 15 years on stage across Europe and Asia.',
    quote: 'Dance is the hidden language of the soul — it lives in every step we take.',
    quoteAuthor: 'Isabella',
  },
  {
    name: 'Marcus Chen',
    specialty: 'Contemporary',
    image: 'https://images.unsplash.com/photo-1546427660-eb346c344ba5?q=80&w=800&auto=format&fit=crop',
    bio: 'Contemporary choreographer trained at Juilliard; loves working with beginners.',
  },
  {
    name: 'Sofia Alvarez',
    specialty: 'Merengue',
    image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=800&auto=format&fit=crop',
    bio: 'Latin dance champion and warm-hearted teacher for all ages.',
  },
];

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Bollywood Student, 2 years',
    quote: 'The instructors here are incredibly patient and passionate. I gained so much confidence in just a few months of joining.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
    rating: 5,
  },
  {
    name: 'Aarav Patel',
    role: 'Hip-Hop Student, 1 year',
    quote: 'Best dance studio in the city. Every class feels welcoming and energetic — I look forward to it every week.',
    image: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?q=80&w=400&auto=format&fit=crop',
    rating: 5,
  },
  {
    name: 'Meera Joshi',
    role: 'Parent of Ballet Student',
    quote: 'My daughter has blossomed since starting classes. The team truly cares about each student’s growth.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    rating: 5,
  },
];

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    title: 'Featured on Dance Deewane',
    description: 'Our studio and students were spotlighted on the popular national television dance show.',
    year: '2024',
  },
  {
    title: 'State Championship Winners',
    description: 'Group choreography team won gold at the Maharashtra State Dance Championship.',
    year: '2023',
  },
  {
    title: '7000+ Students Trained',
    description: 'Over a decade of teaching, we have shared the joy of dance with thousands of learners.',
    year: '2012–Present',
  },
];

const FALLBACK: SitePayload = {
  settings: {
    businessName: "Let's Learn Dance Studio",
    brandLine1: "Let's Learn",
    brandLine2: 'Dance Studio',
    tagline: 'Learn • Perform • Shine',
    phone: '7558396516',
    email: 'letslearn631@gmail.com',
    location: 'Chhatrapati Sambhajinagar, Maharashtra',
    whatsapp: '917558396516',
    mapEmbed: '',
    logo: '/logo.jpeg',
    navCtaLabel: 'Book Free Trial',
    askQuestionLabel: 'Ask a Pre-Sale Question',
    heroWelcomeEyebrow: 'Welcome',
    heroCollage1: '',
    heroCollage2: '',
    heroCollage3: '',
    heroCollage4: '',
    homeClassesEyebrow: 'Our Classes',
    homeClassesHeading: 'A taste of what we teach',
    homeClassesCtaLabel: 'See all classes',
    homeGalleryEyebrow: 'Portfolio',
    homeGalleryHeading: 'Life at the studio',
    homeGalleryCtaLabel: 'Open full gallery',
    aboutEyebrow: 'Our Story',
    aboutWhoWeAreEyebrow: 'Who We Are',
    classesEyebrow: 'What We Teach',
    classesHeading: 'Classes',
    classesIntro: '',
    classesAdultTabLabel: 'Adult styles',
    classesKidsTabLabel: 'Kids styles',
    classesSectionEyebrow: 'Our Classes',
    classesSectionHeading: 'Choose your perfect style',
    pricingEyebrow: 'Memberships',
    pricingHeading: 'Pricing',
    pricingIntro: '',
    pricingChoosePlanLabel: 'Choose plan',
    galleryEyebrow: 'Portfolio',
    galleryHeading: 'Media Gallery',
    galleryIntro: '',
    galleryAllLabel: 'All',
    galleryCatStudioLabel: 'Studio Photos',
    galleryCatCompetitionsLabel: 'Competitions',
    galleryCatCertificatesLabel: 'Certificates',
    galleryCatEventsLabel: 'Events',
    teachersEyebrow: 'Meet the Team',
    teachersHeading: 'Teachers',
    teachersIntro: '',
    teachersHeroImage: '',
    joinTeamEyebrow: 'We are Looking for You',
    joinTeamHeading: 'to Join Our Team',
    joinTeamBody:
      "Are you passionate about movement and love sharing what you know? We're always looking for teachers who can inspire the next generation of dancers at our studio.",
    joinTeamCtaLabel: 'Join Team',
    joinTeamImage: '',
    teacherModalCtaLabel: 'Book a Class',
    contactEyebrow: 'Get in Touch',
    contactHeading: 'Contact',
    contactIntro: '',
    contactFormEyebrow: 'Say hello',
    contactFormHeading: 'Send us a message',
    contactFormNameLabel: 'Name',
    contactFormEmailLabel: 'Email',
    contactFormSubjectLabel: 'Subject',
    contactFormMessageLabel: 'Message',
    contactFormSubmitLabel: 'Send',
    contactFormSuccessMessage: "Thank you — we'll get back to you shortly.",
    contactCardName: '',
    contactCardTitle: '',
    contactCardImage: '',
    contactCardHeadline: "Want to Dance Today?\nThen Let's Chat!",
    contactCardBody: '',
    contactSchedule: 'Mon – Sat, 8am – 9pm',
    promoEyebrow: 'Adult Open Division',
    promoNumeral: '№79',
    promoImage: '',
    promoCtaLabel: 'Try for free',
    advantagesEyebrow: 'Our Studio',
    advantagesHeading: 'Ballet Classes',
    advantagesSubheading: 'That will Make You Advance',
    advantagesSubEyebrow: 'Children & Adult Classes',
    statsEyebrow: 'About us',
    statsHeading: '',
    instructorEyebrow: 'Meet the Instructor',
    instructorSectionHeading: '',
    testimonialsEyebrow: 'Student Reviews',
    testimonialsHeading: 'What Our Students Say',
    testimonialsIntro: '',
    achievementsEyebrow: 'Our Achievements',
    achievementsHeading: 'Recognitions & Milestones',
    achievementsIntro: '',
    certificatesEyebrow: 'Recognition',
    certificatesHeading: 'Awards & Certificates',
    certificatesIntro: 'Milestones and achievements collected along the journey.',
    reelsEyebrow: 'Watch',
    reelsHeading: 'Reels',
    footerTagline: '',
    footerCopyright: '',
    slotPickerHeading: 'Book Free Trial',
    slotPickerSubtext: 'Pick a time and dates that suit you — we will confirm your trial.',
    slotPickerTimeHeading: 'Select Time',
    slotPickerDateHeading: 'Select Dates',
    slotPickerSubmitLabel: 'Secure slots',
    slotPickerSuccessMessage: "Thank you — we'll be in touch shortly.",
    heroHeadline: 'Learn Dance with Confidence',
    heroSubline: 'Kids • Teens • Adults',
    heroSub: 'From your very first step to the spotlight — join a welcoming studio where every dancer belongs.',
    heroVideo: 'https://res.cloudinary.com/dm3scoj2q/video/upload/v1782554444/make_it_a_dance_video_giving_t_bg13fl.mp4',
    heroCta: 'Book Your Free Trial Today',
    aboutHeading: "About Let's Learn Dance Studio",
    aboutBody:
      "Let's Learn Dance Studio is a premier dance academy in Chhatrapati Sambhajinagar, dedicated to nurturing dancers of every age and ability. For over a decade, we have blended technical excellence with joyful expression across styles ranging from classical to contemporary and hip-hop.\n\nOur mission is simple — to help every student discover their own rhythm and shine, whether on stage, in competitions, or simply for the love of movement. We believe dance is for everyone, and our welcoming instructors make sure each class feels like home.\n\nWhat sets us apart is our community: a passionate team of teachers, a warm space to learn in, and a shared belief that confidence begins the moment you step onto the floor.",
    aboutImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1000&auto=format&fit=crop',
    promoHeadline: 'Discover the bright world of dance',
    promoBody: 'Come to a free trial class and feel the energy of dance in one of the many styles of the center.',
    promoVideo: 'https://res.cloudinary.com/dm3scoj2q/video/upload/v1782553792/mak_them_dance_lering_well_and_e8ynjs.mp4',
    advantagesQuote: "You may be a skillful, effective employer but if you don't trust your personnel and the opposite.",
    advantagesQuoteAuthor: 'FRANK SINATRA',
    stat1Label: 'Students', stat1Value: '500', stat1Suffix: '+',
    stat2Label: 'Experience', stat2Value: '10', stat2Suffix: '+ yrs',
    stat3Label: 'Dance Styles', stat3Value: '12', stat3Suffix: '',
    instructorName: 'Sneha Kulkarni',
    instructorTitle: 'Founder & Head Choreographer',
    instructorBio:
      "With over 15 years of professional experience, Sneha founded Let's Learn Dance Studio to share her passion for movement with the community. Trained in classical Indian dance, contemporary and hip-hop, she has choreographed for stage and screen alike.\n\nHer approach combines discipline with joy — pushing students to grow while making every class feel like celebration.",
    instructorImage: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
    instructorInstagram: '',
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
  },
  courses: [
    { slug: 'hiphop', title: 'HIP-HOP', category: 'adult', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/B-boy_breakdancing.jpg' },
    { slug: 'choreo', title: 'CHOREO', category: 'adult', image: 'https://images.unsplash.com/photo-1546427660-eb346c344ba5?q=80&w=800&auto=format&fit=crop' },
    { slug: 'dancehall', title: 'DANCEHALL', category: 'adult', image: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?q=80&w=800&auto=format&fit=crop' },
    { slug: 'vogue', title: 'VOGUE', category: 'adult', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKaDwDf7wlrywhjlOUmxVM1f1M633mQDIu7qafU6hivpxEmQvjIkWeppiE&s=10' },
  ],
  pricing: [
    { name: 'Monthly Plan', duration: '1 Month', price: 1200 },
    { name: '3 Months Plan', duration: '3 Months', price: 3300, saveAmount: '300', highlight: true },
    { name: '6 Months Plan', duration: '6 Months', price: 6300, saveAmount: '900' },
  ],
  gallery: [],
  reels: [],
  certificates: [],
  teachers: FALLBACK_TEACHERS,
  testimonials: FALLBACK_TESTIMONIALS,
  achievements: FALLBACK_ACHIEVEMENTS,
  advantages: [
    { title: 'AGE DOES NOT MATTER', image: 'https://images.unsplash.com/photo-1502519144081-acca18599776?q=80&w=600&auto=format&fit=crop', description: 'We have styles for adults, teenagers, and children from 3 years old' },
    { title: 'OUR PHILOSOPHY', image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=600&auto=format&fit=crop', description: 'Our center is led by a world-renowned choreographer and dancer, inspiring our artistic philosophy.' },
    { title: 'COMFORT', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=600&auto=format&fit=crop', description: 'The center has 6 comfortable halls with stylish design and the most modern equipment' },
  ],
};

let cached: SitePayload | null = null;

export function useSite(): { data: SitePayload; loading: boolean; refetch: () => void } {
  const [data, setData] = useState<SitePayload>(cached ?? FALLBACK);
  const [loading, setLoading] = useState(cached === null);

  const load = () => {
    setLoading(true);
    api.get<SitePayload>('/api/public/site')
      .then((d) => {
        const merged: SitePayload = {
          ...d,
          settings: { ...FALLBACK.settings, ...d.settings },
          teachers: d.teachers && d.teachers.length > 0 ? d.teachers : FALLBACK.teachers,
          testimonials: d.testimonials && d.testimonials.length > 0 ? d.testimonials : FALLBACK.testimonials,
          achievements: d.achievements && d.achievements.length > 0 ? d.achievements : FALLBACK.achievements,
        };
        cached = merged;
        setData(merged);
      })
      .catch(() => { /* keep fallback */ })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);
  return { data, loading, refetch: load };
}
