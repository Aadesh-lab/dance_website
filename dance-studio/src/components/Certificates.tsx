import { useState } from 'react';
import { X } from 'lucide-react';
import { useSite } from '../lib/useSite';
import type { Certificate } from '../lib/types';

export function Certificates() {
  const { data } = useSite();
  const { settings } = data;
  const [preview, setPreview] = useState<Certificate | null>(null);

  if (!data.certificates || data.certificates.length === 0) return null;

  return (
    <div id="certificates" className="relative py-20 md:py-28">
      <div className="text-center mb-14">
        <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-4">{settings.certificatesEyebrow || 'Recognition'}</div>
        <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.05]">
          {settings.certificatesHeading || 'Awards & Certificates'}
        </h2>
        <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
        {settings.certificatesIntro && (
          <p className="mt-6 text-sm text-brand-muted max-w-xl mx-auto">
            {settings.certificatesIntro}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {data.certificates.map((cert) => (
          <button
            key={cert.id ?? cert.image}
            onClick={() => setPreview(cert)}
            className="group text-left bg-brand-paper border border-brand-ink/10 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-zoom-in"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-brand-pink-soft">
              <img
                src={cert.image}
                alt={cert.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <div className="text-[10px] tracking-[0.3em] uppercase text-brand-gold mb-2">Award</div>
              <h3 className="font-serif text-xl text-brand-ink line-clamp-1">
                {cert.title}
              </h3>
              {cert.description && (
                <p className="mt-2 text-sm text-brand-muted line-clamp-2">{cert.description}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md"
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/80 hover:text-white z-10"
            aria-label="Close preview"
          >
            <X size={32} />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center"
          >
            <img
              src={preview.image}
              alt={preview.title}
              className="max-w-full max-h-[75vh] object-contain shadow-2xl bg-white"
            />
            <div className="mt-6 text-center">
              <h3 className="font-serif text-2xl md:text-4xl text-white">
                {preview.title}
              </h3>
              {preview.description && (
                <p className="mt-3 text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                  {preview.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
