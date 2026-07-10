import { Quote, Star } from 'lucide-react';
import { useSite } from '../lib/useSite';

export function Testimonials() {
  const { data } = useSite();
  const { settings } = data;
  if (!data.testimonials || data.testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-16 md:py-24 bg-brand-pink-soft/40">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <div className="text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-4 font-semibold">{settings.testimonialsEyebrow || 'Student Reviews'}</div>
          <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.05]">
            {settings.testimonialsHeading || 'What Our Students Say'}
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
          {settings.testimonialsIntro && (
            <p className="mt-6 text-sm text-brand-muted max-w-xl mx-auto">{settings.testimonialsIntro}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {data.testimonials.map((t, i) => (
            <div key={t.id ?? i} className="relative bg-white p-8 shadow-sm border border-brand-ink/5 flex flex-col">
              <Quote size={28} className="text-brand-gold/60 mb-4" />
              <p className="font-serif italic text-brand-ink text-lg leading-relaxed flex-1">
                “{t.quote}”
              </p>
              {t.rating ? (
                <div className="flex gap-1 mt-4 text-brand-gold">
                  {Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}
                </div>
              ) : null}
              <div className="mt-6 pt-6 border-t border-brand-ink/10 flex items-center gap-3">
                {t.image ? (
                  <img
                    src={t.image}
                    alt={t.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center font-serif text-brand-gold">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="font-serif text-brand-ink">{t.name}</div>
                  {t.role && <div className="text-xs tracking-widest uppercase text-brand-muted mt-0.5">{t.role}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
