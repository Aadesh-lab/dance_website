import { useState } from 'react';
import { Expand } from 'lucide-react';
import { useSite } from '../lib/useSite';
import { Lightbox } from './Lightbox';
import type { GalleryCategory } from '../lib/types';

const SPANS = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-2',
  'md:col-span-2 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
];

type Filter = 'all' | GalleryCategory;

export function Gallery() {
  const { data } = useSite();
  const { settings } = data;
  const [filter, setFilter] = useState<Filter>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const TABS: { key: Filter; label: string }[] = [
    { key: 'all', label: settings.galleryAllLabel || 'All' },
    { key: 'studio', label: settings.galleryCatStudioLabel || 'Studio Photos' },
    { key: 'competitions', label: settings.galleryCatCompetitionsLabel || 'Competitions' },
    { key: 'certificates', label: settings.galleryCatCertificatesLabel || 'Certificates' },
    { key: 'events', label: settings.galleryCatEventsLabel || 'Events' },
  ];

  const items = data.gallery.filter((g) => filter === 'all' || (g.category ?? 'studio') === filter);

  return (
    <div id="gallery" className="relative py-16 md:py-24">
      <div className="text-center mb-10 md:mb-14">
        <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-4">{settings.galleryEyebrow || 'Portfolio'}</div>
        <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.05]">
          {settings.galleryHeading || 'Media Gallery'}
        </h2>
        <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
        {settings.galleryIntro && (
          <p className="mt-6 text-sm text-brand-muted max-w-xl mx-auto">{settings.galleryIntro}</p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mb-10 border-b border-brand-ink/10 pb-1">
        {TABS.map((t) => {
          const active = filter === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`relative px-2 pb-3 text-[11px] tracking-[0.25em] uppercase font-semibold transition-colors ${
                active ? 'text-brand-gold' : 'text-brand-muted hover:text-brand-ink'
              }`}
            >
              {t.label}
              {active && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-brand-gold" />}
            </button>
          );
        })}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-brand-ink/15">
          <div className="font-serif text-2xl text-brand-ink italic">Coming soon</div>
          <p className="text-sm text-brand-muted mt-2 tracking-wide">New photos will appear here shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-3">
          {items.map((g, i) => (
            <button
              key={g.id ?? g.url}
              type="button"
              onClick={() => setLightboxIndex(i)}
              aria-label={g.caption ? `Open image: ${g.caption}` : 'Open image'}
              className={`relative overflow-hidden group hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-gold ${SPANS[i % SPANS.length]}`}
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
              {g.caption && (
                <div className="absolute inset-x-0 bottom-0 p-3 text-white text-xs tracking-widest uppercase text-left bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  {g.caption}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
