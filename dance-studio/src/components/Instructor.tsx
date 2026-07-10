import { Instagram } from 'lucide-react';
import { useSite } from '../lib/useSite';

export function Instructor() {
  const { data } = useSite();
  const { settings } = data;

  if (!settings.instructorName) return null;

  const paragraphs = (settings.instructorBio || '').split(/\n+/).filter(Boolean);

  return (
    <section id="instructor" className="py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
        <div className="flex justify-center md:justify-start">
          <div className="relative bg-white p-4 pb-16 shadow-xl rotate-[-2deg] max-w-sm w-full">
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-pink-soft">
              {settings.instructorImage && (
                <img
                  src={settings.instructorImage}
                  alt={settings.instructorName}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
            <div className="absolute bottom-4 left-0 right-0 text-center font-script text-2xl text-brand-ink">
              {settings.instructorName}
            </div>
          </div>
        </div>

        <div>
          <div className="text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-4 font-semibold">{settings.instructorEyebrow || 'Meet the Instructor'}</div>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-ink leading-[1.1]">
            {settings.instructorName}
          </h2>
          {settings.instructorTitle && (
            <div className="mt-2 font-serif italic text-brand-muted text-lg">
              {settings.instructorTitle}
            </div>
          )}
          <div className="mt-6 h-px w-16 bg-brand-gold" />
          <div className="mt-6 space-y-4 text-brand-muted leading-relaxed">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-script text-brand-gold text-2xl">— {settings.instructorName.split(' ')[0]}</span>
            {settings.instructorInstagram && (
              <a
                href={settings.instructorInstagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 border border-brand-gold text-brand-gold flex items-center justify-center hover:bg-brand-gold hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
