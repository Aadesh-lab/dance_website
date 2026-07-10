import { useState } from 'react';
import { SlotPickerModal } from './SlotPickerModal';
import { useSite } from '../lib/useSite';

export function Hero() {
  const { data } = useSite();
  const { settings, gallery } = data;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const collage = [
    settings.heroCollage1 || gallery[0]?.url,
    settings.heroCollage2 || gallery[1]?.url,
    settings.heroCollage3 || gallery[2]?.url,
    settings.heroCollage4 || gallery[3]?.url,
  ];

  return (
    <div id="top" className="relative w-full bg-white">
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pb-8">
        {/* Collage + overlaid headline */}
        <section className="relative w-full min-h-[70vh] md:min-h-[85vh] overflow-hidden">
          {/* Collage row (top 60%) */}
          <div className="absolute inset-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1 h-full w-full">
              {collage.map((src, i) => (
                <div key={i} className="relative overflow-hidden">
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                      // @ts-expect-error non-standard attribute supported by browsers
                      fetchpriority={i === 0 ? 'high' : 'auto'}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-800 to-neutral-950" />
                  )}
                </div>
              ))}
            </div>
            {/* Soft dark gradient overlay so the huge white serif headline is legible */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/55" />
          </div>

          {/* Overlaid centered content */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 md:px-6 text-center">
            <div className="text-[11px] md:text-xs tracking-[0.35em] uppercase text-brand-gold font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
              {settings.heroWelcomeEyebrow || 'Welcome'}
            </div>
            <div className="mt-3 h-px w-14 bg-brand-gold" />
            <h1 className="mt-6 font-serif font-bold text-white uppercase tracking-tight leading-none text-4xl sm:text-5xl md:text-7xl lg:text-8xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] max-w-5xl">
              {settings.heroHeadline}
            </h1>
            {settings.heroSubline && (
              <div className="mt-6 font-serif italic text-white/95 text-xl md:text-2xl tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                {settings.heroSubline}
              </div>
            )}
            {settings.heroSub && (
              <p className="mt-6 max-w-2xl text-white/90 text-sm md:text-base leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                {settings.heroSub}
              </p>
            )}
          </div>
        </section>

        {/* Bottom row: eyebrow + gold CTA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-16 mt-10">
          <div className="max-w-xl">
            <div className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-semibold mb-2">
              {settings.heroWelcomeEyebrow || 'Welcome'}
            </div>
            <div className="h-px w-12 bg-brand-gold" />
          </div>
          <div className="flex flex-col gap-4 max-w-sm w-full">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-gold text-white px-8 py-4 text-xs tracking-[0.25em] uppercase font-semibold hover:bg-brand-gold-dark transition-colors rounded-full"
            >
              {settings.heroCta || 'Book Your Free Trial Today'}
            </button>
          </div>
        </div>
      </div>

      <SlotPickerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
