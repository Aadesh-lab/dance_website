import { Trophy } from 'lucide-react';
import { useSite } from '../lib/useSite';

export function Achievements() {
  const { data } = useSite();
  const { settings } = data;
  if (!data.achievements || data.achievements.length === 0) return null;

  return (
    <section id="achievements" className="py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="text-center mb-12 md:mb-16">
          <div className="text-[11px] tracking-[0.3em] uppercase text-brand-gold mb-4 font-semibold">{settings.achievementsEyebrow || 'Our Achievements'}</div>
          <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.05]">
            {settings.achievementsHeading || 'Recognitions & Milestones'}
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
          {settings.achievementsIntro && (
            <p className="mt-6 text-sm text-brand-muted max-w-xl mx-auto">{settings.achievementsIntro}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.achievements.map((a, i) => (
            <div
              key={a.id ?? i}
              className="relative bg-white border border-brand-ink/10 p-6 md:p-8 flex flex-col hover:border-brand-gold transition-colors group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 flex items-center justify-center border border-brand-gold/40 text-brand-gold group-hover:bg-brand-gold group-hover:text-white transition-colors">
                  {a.image ? (
                    <img src={a.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  ) : (
                    <Trophy size={22} />
                  )}
                </div>
                {a.year && (
                  <span className="text-[10px] tracking-[0.3em] uppercase text-brand-gold font-semibold border border-brand-gold/40 px-2 py-1">
                    {a.year}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl text-brand-ink leading-tight">{a.title}</h3>
              <p className="mt-3 text-sm text-brand-muted leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
