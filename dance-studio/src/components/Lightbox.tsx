import { useEffect, useRef, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryItem } from '../lib/types';

interface LightboxProps {
  items: GalleryItem[];
  startIndex: number;
  onClose: () => void;
}

export function Lightbox({ items, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<Element | null>(null);

  const count = items.length;
  const current = items[index];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  // Body scroll lock, keyboard nav, focus mgmt
  useEffect(() => {
    lastFocusedRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus();
      }
    };
  }, [onClose, next, prev]);

  // Preload adjacent images
  useEffect(() => {
    if (count <= 1) return;
    const nxt = items[(index + 1) % count];
    const prv = items[(index - 1 + count) % count];
    if (nxt?.url) {
      const img = new Image();
      img.src = nxt.url;
    }
    if (prv?.url) {
      const img = new Image();
      img.src = prv.url;
    }
  }, [index, items, count]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center text-white hover:text-brand-gold transition-colors"
      >
        <X size={26} />
      </button>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={26} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <ChevronRight size={26} />
          </button>
        </>
      )}

      <div
        className="relative flex flex-col items-center max-w-[90vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white p-2 md:p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
          <img
            src={current.url}
            alt={current.caption ?? ''}
            className="block max-h-[80vh] max-w-[86vw] object-contain"
          />
        </div>
        {current.caption && (
          <div className="mt-4 text-center font-serif italic text-brand-gold text-sm md:text-base px-4">
            {current.caption}
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-xs tracking-[0.25em] uppercase font-semibold pointer-events-none">
          {index + 1} / {count}
        </div>
      )}
    </div>
  );
}
