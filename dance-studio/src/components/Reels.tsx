import { Play } from 'lucide-react';
import { useSite } from '../lib/useSite';

export function Reels() {
  const { data } = useSite();
  const { settings } = data;
  if (!data.reels || data.reels.length === 0) return null;

  return (
    <div id="reels" className="relative py-20 md:py-28">
      <div className="text-center mb-14">
        <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-4">{settings.reelsEyebrow || 'Watch'}</div>
        <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.05]">
          {settings.reelsHeading || 'Video Gallery'}
        </h2>
        <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.reels.map((r) => (
          <div key={r.id ?? r.videoUrl} className="relative aspect-video overflow-hidden bg-black group">
            <video
              src={r.videoUrl}
              poster={r.thumbnailUrl || undefined}
              muted
              loop
              playsInline
              preload="metadata"
              controls
              className="absolute inset-0 w-full h-full object-cover"
              onMouseEnter={(e) => { void e.currentTarget.play().catch(() => {}); }}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                <Play size={22} className="text-brand-gold ml-1" fill="currentColor" />
              </div>
            </div>
            {r.title && (
              <div className="absolute inset-x-0 bottom-0 p-4 text-white text-xs tracking-widest uppercase bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                {r.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
