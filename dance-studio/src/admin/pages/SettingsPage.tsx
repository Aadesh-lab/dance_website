import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { api } from '../../lib/api';
import { Button, Card, Field, ImageUpload, PageHeader, TextArea, TextInput } from '../ui';
import type { SiteSettings } from '../../lib/types';

type UpdFn = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => void;

function Section({
  title,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  description?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="lg:col-span-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <h2 className="font-semibold text-brand-ink">{title}</h2>
          {description && <p className="text-xs text-brand-muted mt-1">{description}</p>}
        </div>
        <ChevronDown
          size={20}
          className={`text-brand-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-6 border-t border-brand-ink/10 pt-6">{children}</div>}
    </Card>
  );
}

function StringField({
  s,
  upd,
  k,
  label,
  placeholder,
  textarea,
  rows,
}: {
  s: SiteSettings;
  upd: UpdFn;
  k: keyof SiteSettings;
  label: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const val = (s[k] as string | undefined) ?? '';
  return (
    <Field label={label}>
      {textarea ? (
        <TextArea
          rows={rows ?? 3}
          value={val}
          placeholder={placeholder}
          onChange={(e) => upd(k, e.target.value as SiteSettings[typeof k])}
        />
      ) : (
        <TextInput
          value={val}
          placeholder={placeholder}
          onChange={(e) => upd(k, e.target.value as SiteSettings[typeof k])}
        />
      )}
    </Field>
  );
}

function ImageField({
  s,
  upd,
  k,
  label,
}: {
  s: SiteSettings;
  upd: UpdFn;
  k: keyof SiteSettings;
  label: string;
}) {
  const val = (s[k] as string | undefined) ?? '';
  return (
    <Field label={label}>
      <ImageUpload value={val} onChange={(url) => upd(k, url as SiteSettings[typeof k])} />
    </Field>
  );
}

export function SettingsPage() {
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    api.get<SiteSettings>('/api/admin/settings', true).then(setS).catch(() => {});
  }, []);

  if (!s) return <div>Loading…</div>;

  const upd: UpdFn = (k, v) => setS({ ...s, [k]: v });

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.put('/api/admin/settings', s, true);
      setMsg('Saved.');
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const statBlock = (i: 1 | 2 | 3) => {
    const labelKey = `stat${i}Label` as const;
    const valueKey = `stat${i}Value` as const;
    const suffixKey = `stat${i}Suffix` as const;
    return (
      <div className="flex flex-col gap-3 p-4 bg-brand-paper rounded-lg">
        <div className="text-xs uppercase tracking-widest text-brand-gold font-semibold">Stat {i}</div>
        <Field label="Value">
          <TextInput value={s[valueKey]} onChange={(e) => upd(valueKey, e.target.value)} />
        </Field>
        <Field label="Suffix">
          <TextInput value={s[suffixKey]} onChange={(e) => upd(suffixKey, e.target.value)} />
        </Field>
        <Field label="Label">
          <TextInput value={s[labelKey]} onChange={(e) => upd(labelKey, e.target.value)} />
        </Field>
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="Site Settings"
        subtitle="Content shown on the public site — every text and image is editable here."
        action={<Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>}
      />

      {msg && <div className="mb-4 text-sm text-brand-gold">{msg}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Global / Business" description="Business identity, contact and brand" defaultOpen>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="businessName" label="Business Name" />
            <StringField s={s} upd={upd} k="tagline" label="Tagline" />
            <StringField s={s} upd={upd} k="brandLine1" label="Wordmark Line 1 (script)" placeholder="Let's Learn" />
            <StringField s={s} upd={upd} k="brandLine2" label="Wordmark Line 2 (serif)" placeholder="Dance Studio" />
            <StringField s={s} upd={upd} k="phone" label="Phone" />
            <StringField s={s} upd={upd} k="email" label="Email" />
            <StringField s={s} upd={upd} k="location" label="Location" />
            <div>
              <StringField s={s} upd={upd} k="whatsapp" label="WhatsApp (with country code)" placeholder="919876543210" />
              <p className="text-xs text-brand-muted mt-1">Enter country code + number, no + or spaces. Example: 919876543210</p>
            </div>
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="mapEmbed" label="Google Map Embed URL" textarea rows={2} />
            </div>
            <ImageField s={s} upd={upd} k="logo" label="Logo" />
            <StringField s={s} upd={upd} k="navCtaLabel" label="Nav CTA Button Label" placeholder="Book Free Trial" />
            <StringField s={s} upd={upd} k="askQuestionLabel" label="Ask-a-Question Label" placeholder="Ask a Pre-Sale Question" />
          </div>
        </Section>

        <Section title="Hero (Home)" description="Top of the home page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="heroHeadline" label="Headline (line 1)" textarea rows={2} />
            </div>
            <StringField s={s} upd={upd} k="heroSubline" label="Subline (italic)" />
            <StringField s={s} upd={upd} k="heroWelcomeEyebrow" label="Welcome Eyebrow" placeholder="Welcome" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="heroSub" label="Sub-copy (line 3)" textarea rows={2} />
            </div>
            <StringField s={s} upd={upd} k="heroCta" label="CTA button label" placeholder="Book Your Free Trial Today" />
            <ImageField s={s} upd={upd} k="heroVideo" label="Background video / image" />
            <div className="md:col-span-2 mt-2">
              <div className="text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Hero Collage (4 photos across the top)</div>
            </div>
            <ImageField s={s} upd={upd} k="heroCollage1" label="Collage Photo 1" />
            <ImageField s={s} upd={upd} k="heroCollage2" label="Collage Photo 2" />
            <ImageField s={s} upd={upd} k="heroCollage3" label="Collage Photo 3" />
            <ImageField s={s} upd={upd} k="heroCollage4" label="Collage Photo 4" />
          </div>
        </Section>

        <Section title="Home Page — Extra Sections" description="Class preview & gallery preview blocks on home">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="homeClassesEyebrow" label="Classes Preview Eyebrow" />
            <StringField s={s} upd={upd} k="homeClassesHeading" label="Classes Preview Heading" />
            <StringField s={s} upd={upd} k="homeClassesCtaLabel" label="Classes Preview CTA Label" />
            <StringField s={s} upd={upd} k="homeGalleryEyebrow" label="Gallery Preview Eyebrow" />
            <StringField s={s} upd={upd} k="homeGalleryHeading" label="Gallery Preview Heading" />
            <StringField s={s} upd={upd} k="homeGalleryCtaLabel" label="Gallery Preview CTA Label" />
          </div>
        </Section>

        <Section title="About Page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="aboutEyebrow" label="Page Eyebrow" placeholder="Our Story" />
            <StringField s={s} upd={upd} k="aboutHeading" label="Heading" />
            <StringField s={s} upd={upd} k="aboutWhoWeAreEyebrow" label="Section Eyebrow" placeholder="Who We Are" />
            <ImageField s={s} upd={upd} k="aboutImage" label="Image" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="aboutBody" label="Body (blank line = paragraph)" textarea rows={6} />
            </div>
          </div>
        </Section>

        <Section title="Classes Page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="classesEyebrow" label="Page Eyebrow" />
            <StringField s={s} upd={upd} k="classesHeading" label="Page Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="classesIntro" label="Intro" textarea rows={2} />
            </div>
            <StringField s={s} upd={upd} k="classesSectionEyebrow" label="Section Eyebrow" placeholder="Our Classes" />
            <StringField s={s} upd={upd} k="classesSectionHeading" label="Section Heading" placeholder="Choose your perfect style" />
            <StringField s={s} upd={upd} k="classesAdultTabLabel" label="Adult Tab Label" />
            <StringField s={s} upd={upd} k="classesKidsTabLabel" label="Kids Tab Label" />
          </div>
        </Section>

        <Section title="Pricing Page / Section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="pricingEyebrow" label="Eyebrow" />
            <StringField s={s} upd={upd} k="pricingHeading" label="Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="pricingIntro" label="Intro" textarea rows={2} />
            </div>
            <StringField s={s} upd={upd} k="pricingChoosePlanLabel" label="Choose-Plan Button Label" />
          </div>
        </Section>

        <Section title="Gallery Page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="galleryEyebrow" label="Eyebrow" />
            <StringField s={s} upd={upd} k="galleryHeading" label="Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="galleryIntro" label="Intro" textarea rows={2} />
            </div>
            <StringField s={s} upd={upd} k="galleryAllLabel" label="Category — All" />
            <StringField s={s} upd={upd} k="galleryCatStudioLabel" label="Category — Studio" />
            <StringField s={s} upd={upd} k="galleryCatCompetitionsLabel" label="Category — Competitions" />
            <StringField s={s} upd={upd} k="galleryCatCertificatesLabel" label="Category — Certificates" />
            <StringField s={s} upd={upd} k="galleryCatEventsLabel" label="Category — Events" />
          </div>
        </Section>

        <Section title="Teachers Page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="teachersEyebrow" label="Eyebrow" />
            <StringField s={s} upd={upd} k="teachersHeading" label="Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="teachersIntro" label="Intro" textarea rows={2} />
            </div>
            <ImageField s={s} upd={upd} k="teachersHeroImage" label="Hero Image (page top)" />
            <div className="md:col-span-2 mt-2">
              <div className="text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Join Team CTA</div>
            </div>
            <StringField s={s} upd={upd} k="joinTeamEyebrow" label="Join Team Eyebrow" />
            <StringField s={s} upd={upd} k="joinTeamHeading" label="Join Team Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="joinTeamBody" label="Join Team Body" textarea rows={4} />
            </div>
            <StringField s={s} upd={upd} k="joinTeamCtaLabel" label="Join Team CTA Label" />
            <ImageField s={s} upd={upd} k="joinTeamImage" label="Join Team Image" />
            <StringField s={s} upd={upd} k="teacherModalCtaLabel" label="Teacher Modal CTA Label" />
          </div>
        </Section>

        <Section title="Contact Page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="contactEyebrow" label="Eyebrow" />
            <StringField s={s} upd={upd} k="contactHeading" label="Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="contactIntro" label="Intro" textarea rows={2} />
            </div>

            <div className="md:col-span-2 mt-2">
              <div className="text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Contact Form</div>
            </div>
            <StringField s={s} upd={upd} k="contactFormEyebrow" label="Form Eyebrow" />
            <StringField s={s} upd={upd} k="contactFormHeading" label="Form Heading" />
            <StringField s={s} upd={upd} k="contactFormNameLabel" label="Name field label" />
            <StringField s={s} upd={upd} k="contactFormEmailLabel" label="Email field label" />
            <StringField s={s} upd={upd} k="contactFormSubjectLabel" label="Subject field label" />
            <StringField s={s} upd={upd} k="contactFormMessageLabel" label="Message field label" />
            <StringField s={s} upd={upd} k="contactFormSubmitLabel" label="Submit label" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="contactFormSuccessMessage" label="Success Message" textarea rows={2} />
            </div>

            <div className="md:col-span-2 mt-2">
              <div className="text-xs uppercase tracking-widest text-brand-gold font-semibold mb-3">Contact Card</div>
            </div>
            <StringField s={s} upd={upd} k="contactCardName" label="Card — Name" />
            <StringField s={s} upd={upd} k="contactCardTitle" label="Card — Title" />
            <ImageField s={s} upd={upd} k="contactCardImage" label="Card — Image" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="contactCardHeadline" label="Card — Headline" textarea rows={2} />
            </div>
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="contactCardBody" label="Card — Body" textarea rows={3} />
            </div>
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="contactSchedule" label="Schedule (multi-line ok)" textarea rows={2} />
            </div>
          </div>
        </Section>

        <Section title="Instructor Section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="instructorEyebrow" label="Eyebrow" placeholder="Meet the Instructor" />
            <StringField s={s} upd={upd} k="instructorSectionHeading" label="Section Heading (optional)" />
            <StringField s={s} upd={upd} k="instructorName" label="Name" />
            <StringField s={s} upd={upd} k="instructorTitle" label="Title / Specialty" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="instructorBio" label="Bio" textarea rows={5} />
            </div>
            <ImageField s={s} upd={upd} k="instructorImage" label="Photo" />
            <StringField s={s} upd={upd} k="instructorInstagram" label="Instagram URL" />
          </div>
        </Section>

        <Section title="Testimonials Section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="testimonialsEyebrow" label="Eyebrow" />
            <StringField s={s} upd={upd} k="testimonialsHeading" label="Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="testimonialsIntro" label="Intro" textarea rows={2} />
            </div>
          </div>
        </Section>

        <Section title="Achievements Section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="achievementsEyebrow" label="Eyebrow" />
            <StringField s={s} upd={upd} k="achievementsHeading" label="Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="achievementsIntro" label="Intro" textarea rows={2} />
            </div>
          </div>
        </Section>

        <Section title="Certificates Section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="certificatesEyebrow" label="Eyebrow" />
            <StringField s={s} upd={upd} k="certificatesHeading" label="Heading" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="certificatesIntro" label="Intro" textarea rows={2} />
            </div>
          </div>
        </Section>

        <Section title="Reels Section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="reelsEyebrow" label="Eyebrow" />
            <StringField s={s} upd={upd} k="reelsHeading" label="Heading" />
          </div>
        </Section>

        <Section title="Advantages Section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="advantagesEyebrow" label="Eyebrow" placeholder="Our Studio" />
            <StringField s={s} upd={upd} k="advantagesHeading" label="Heading" placeholder="Ballet Classes" />
            <StringField s={s} upd={upd} k="advantagesSubheading" label="Subheading (italic)" />
            <StringField s={s} upd={upd} k="advantagesSubEyebrow" label="Sub-Eyebrow" placeholder="Children & Adult Classes" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="advantagesQuote" label="Pull-Quote" textarea rows={3} />
            </div>
            <StringField s={s} upd={upd} k="advantagesQuoteAuthor" label="Quote Author" />
          </div>
        </Section>

        <Section title="Promo Section">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="promoEyebrow" label="Eyebrow" placeholder="Adult Open Division" />
            <StringField s={s} upd={upd} k="promoNumeral" label="Background Numeral" placeholder="№79" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="promoHeadline" label="Headline" textarea rows={2} />
            </div>
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="promoBody" label="Body" textarea rows={2} />
            </div>
            <ImageField s={s} upd={upd} k="promoVideo" label="Background video (preferred)" />
            <ImageField s={s} upd={upd} k="promoImage" label="Background image (fallback)" />
            <StringField s={s} upd={upd} k="promoCtaLabel" label="CTA Label" placeholder="Try for free" />
          </div>
        </Section>

        <Section title="Stats (3 counters)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <StringField s={s} upd={upd} k="statsEyebrow" label="Eyebrow" placeholder="About us" />
            <StringField s={s} upd={upd} k="statsHeading" label="Heading (fallback: business name)" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statBlock(1)}
            {statBlock(2)}
            {statBlock(3)}
          </div>
        </Section>

        <Section title="Footer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="footerTagline" label="Tagline (optional)" />
            <StringField s={s} upd={upd} k="footerCopyright" label="Copyright override (leave blank to auto-generate)" />
          </div>
        </Section>

        <Section title="Slot Picker Modal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="slotPickerHeading" label="Heading" />
            <StringField s={s} upd={upd} k="slotPickerTimeHeading" label="Time Heading" />
            <StringField s={s} upd={upd} k="slotPickerDateHeading" label="Date Heading" />
            <StringField s={s} upd={upd} k="slotPickerSubmitLabel" label="Submit Label" />
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="slotPickerSubtext" label="Subtext" textarea rows={2} />
            </div>
            <div className="md:col-span-2">
              <StringField s={s} upd={upd} k="slotPickerSuccessMessage" label="Success Message" textarea rows={2} />
            </div>
          </div>
        </Section>

        <Section title="Social Media">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StringField s={s} upd={upd} k="instagram" label="Instagram URL" />
            <StringField s={s} upd={upd} k="facebook" label="Facebook URL" />
            <StringField s={s} upd={upd} k="twitter" label="Twitter URL" />
            <StringField s={s} upd={upd} k="youtube" label="YouTube URL" />
          </div>
        </Section>
      </div>
    </div>
  );
}
