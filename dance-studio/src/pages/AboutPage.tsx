import { PageHero } from '../components/PageHero';
import { Stats } from '../components/Stats';
import { Certificates } from '../components/Certificates';
import { Instructor } from '../components/Instructor';
import { useSite } from '../lib/useSite';

export function AboutPage() {
  const { data } = useSite();
  const { settings } = data;
  const aboutHeading = settings.aboutHeading || "About Let's Learn Dance Studio";
  const paragraphs = (settings.aboutBody || '').split(/\n+/).filter(Boolean);

  return (
    <>
      <PageHero eyebrow={settings.aboutEyebrow || 'Our Story'} title={aboutHeading} />

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative aspect-[4/5] overflow-hidden bg-brand-pink-soft order-2 md:order-1">
            {settings.aboutImage && (
              <img
                src={settings.aboutImage}
                alt={aboutHeading}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-brand-gold hidden md:block" />
          </div>
          <div className="order-1 md:order-2">
            <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-4">{settings.aboutWhoWeAreEyebrow || 'Who We Are'}</div>
            <h2 className="font-serif text-3xl md:text-5xl text-brand-ink leading-[1.1]">
              {aboutHeading}
            </h2>
            <div className="mt-6 h-px w-16 bg-brand-gold" />
            <div className="mt-6 space-y-4 text-brand-muted leading-relaxed">
              {paragraphs.length > 0 ? (
                paragraphs.map((p, i) => <p key={i}>{p}</p>)
              ) : (
                <p>A premier dance academy dedicated to nurturing dancers of every age and ability.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <Stats />
        <Instructor />
        <Certificates />
      </div>
    </>
  );
}
