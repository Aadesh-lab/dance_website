import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Expand } from 'lucide-react';
import { Hero } from '../components/Hero';
import { Advantages } from '../components/Advantages';
import { Promo } from '../components/Promo';
import { Stats } from '../components/Stats';
import { Instructor } from '../components/Instructor';
import { Testimonials } from '../components/Testimonials';
import { Achievements } from '../components/Achievements';
import { Lightbox } from '../components/Lightbox';
import { useSite } from '../lib/useSite';

export function HomePage() {
  const { data } = useSite();
  const { settings } = data;
  const previewCourses = data.courses.slice(0, 4);
  const previewGallery = data.gallery.slice(0, 4);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <Hero />

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <Advantages />
      </section>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <Instructor />
      </div>

      <Promo />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        {previewCourses.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="text-center mb-12 md:mb-14">
              <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-4">{settings.homeClassesEyebrow || 'Our Classes'}</div>
              <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.05]">
                {settings.homeClassesHeading || 'A taste of what we teach'}
              </h2>
              <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {previewCourses.map((c) => (
                <Link
                  key={c.slug}
                  to="/classes"
                  className="group relative aspect-[3/4] overflow-hidden bg-brand-pink-soft"
                >
                  {c.image && (
                    <img
                      src={c.image}
                      alt={c.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="text-[10px] tracking-[0.3em] uppercase text-white/70 mb-1">
                      {c.category === 'kids' ? 'Kids' : 'Adult'}
                    </div>
                    <div className="font-serif text-xl">{c.title}</div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/classes"
                className="inline-block bg-brand-gold text-white px-8 py-4 text-xs tracking-[0.25em] uppercase font-semibold hover:bg-brand-gold-dark transition-colors"
              >
                {settings.homeClassesCtaLabel || 'See all classes'}
              </Link>
            </div>
          </section>
        )}

        <Stats />

        {data.gallery.length > 0 && (
          <section className="py-16">
            <div className="text-center mb-10">
              <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-3">{settings.homeGalleryEyebrow || 'Portfolio'}</div>
              <h2 className="font-serif text-4xl md:text-5xl text-brand-ink leading-[1.05]">
                {settings.homeGalleryHeading || 'Life at the studio'}
              </h2>
              <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {previewGallery.map((g, i) => (
                <button
                  key={g.id ?? g.url}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  aria-label={g.caption ? `Open image: ${g.caption}` : 'Open image'}
                  className="relative aspect-square overflow-hidden group hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-gold"
                >
                  <img
                    src={g.url}
                    alt={g.caption ?? ''}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-brand-ink flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Expand size={14} />
                  </div>
                </button>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/gallery"
                className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-semibold border-b border-brand-gold pb-0.5 hover:text-brand-gold-dark"
              >
                {settings.homeGalleryCtaLabel || 'Open full gallery'}
              </Link>
            </div>
          </section>
        )}
      </div>

      <Testimonials />
      <Achievements />

      {lightboxIndex !== null && (
        <Lightbox
          items={previewGallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
