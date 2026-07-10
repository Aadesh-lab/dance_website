import { useEffect, useState, useRef } from 'react';
import { useSite } from '../lib/useSite';
import { statsFromSettings } from '../lib/types';

function Counter({ end, duration = 2000, suffix = null }: { end: number, duration?: number, suffix?: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null;
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(easeProgress * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function Stats() {
  const { data } = useSite();
  const stats = statsFromSettings(data.settings);

  if (stats.length === 0) return null;

  return (
    <div id="about" className="relative py-20 md:py-28 border-y border-brand-ink/10">
      <div className="text-center mb-14">
        <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-4">{data.settings.statsEyebrow || 'About us'}</div>
        <h2 className="font-serif text-3xl md:text-5xl text-brand-ink leading-[1.1] max-w-2xl mx-auto">
          {data.settings.statsHeading || data.settings.businessName}
        </h2>
        <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 max-w-4xl mx-auto">
        {stats.map((s, i) => (
          <div key={i} className="text-center">
            <div className="font-serif text-6xl md:text-7xl text-brand-gold leading-none">
              <Counter end={s.value} suffix={s.suffix ? <span className="text-3xl md:text-4xl ml-1">{s.suffix}</span> : null} />
            </div>
            <div className="mx-auto mt-4 h-px w-8 bg-brand-gold/60" />
            <div className="mt-4 text-xs tracking-[0.25em] uppercase text-brand-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
