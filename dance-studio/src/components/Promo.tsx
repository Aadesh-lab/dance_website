import { useSite } from '../lib/useSite';

export function Promo() {
  const { data } = useSite();
  const { settings } = data;

  return (
    <div className="relative py-20 md:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center relative">
        {/* Watercolor blob */}
        <div className="watercolor-blob left-[-100px] top-[-50px] w-[420px] h-[420px]" />

        {/* Giant serif numeral background */}
        <div className="absolute right-0 top-0 pointer-events-none select-none opacity-[0.06] font-serif text-[280px] md:text-[420px] leading-none text-brand-ink italic">
          {settings.promoNumeral || '№79'}
        </div>

        {/* Video / image side */}
        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-brand-pink-soft shadow-[0_30px_60px_-30px_rgba(0,0,0,0.3)]">
            {settings.promoVideo ? (
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={settings.promoVideo}
                autoPlay muted loop playsInline
              />
            ) : settings.promoImage ? (
              <img
                src={settings.promoImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>

        {/* Text side */}
        <div className="relative z-10">
          <div className="text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-4">{settings.promoEyebrow || 'Adult Open Division'}</div>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-ink leading-[1.05] mb-6">
            {settings.promoHeadline}
          </h2>
          <div className="h-px w-16 bg-brand-gold mb-6" />
          <p className="text-base text-brand-muted leading-relaxed max-w-md mb-10">
            {settings.promoBody}
          </p>
          <button className="bg-brand-gold text-white px-10 py-4 text-[11px] tracking-[0.3em] uppercase font-semibold hover:bg-brand-gold-dark transition-colors">
            {settings.promoCtaLabel || 'Try for free'}
          </button>
        </div>
      </div>
    </div>
  );
}
