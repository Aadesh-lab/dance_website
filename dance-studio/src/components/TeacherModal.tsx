import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Teacher } from '../lib/types';
import { useSite } from '../lib/useSite';

interface TeacherModalProps {
  teacher: Teacher | null;
  onClose: () => void;
  onBookClick: () => void;
}

export function TeacherModal({ teacher, onClose, onBookClick }: TeacherModalProps) {
  const { data } = useSite();
  const { settings } = data;
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!teacher) return;
    lastFocusedRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    // Focus close button after paint
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (lastFocusedRef.current instanceof HTMLElement) {
        lastFocusedRef.current.focus();
      }
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  const paragraphs = (teacher.bio ?? '').split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  const ctaLabel = settings.teacherModalCtaLabel || 'Book a Class';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="teacher-modal-name"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-5xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-brand-ink hover:text-brand-gold transition-colors"
        >
          <X size={22} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-12">
          <div className="relative bg-white p-3 pb-6 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.35)] max-w-[440px] w-full mx-auto">
            <div className="relative aspect-[4/5] overflow-hidden bg-brand-pink-soft">
              {teacher.image && (
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="text-[10px] tracking-[0.35em] uppercase text-brand-gold font-semibold mb-3">
              {teacher.specialty}
            </div>
            <h2
              id="teacher-modal-name"
              className="font-serif text-3xl md:text-5xl text-brand-ink leading-tight mb-5"
            >
              {teacher.name}
            </h2>
            <div className="h-px w-16 bg-brand-gold mb-6" />

            {paragraphs.length > 0 && (
              <div className="space-y-4 text-sm text-brand-muted leading-relaxed">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}

            {teacher.quote && (
              <div className="mt-6">
                <blockquote className="font-serif italic text-brand-gold text-lg md:text-xl leading-relaxed">
                  &ldquo;{teacher.quote}&rdquo;
                </blockquote>
                <div className="mt-3 text-[11px] tracking-[0.3em] uppercase text-brand-ink font-semibold">
                  &mdash; {teacher.quoteAuthor ?? teacher.name}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={onBookClick}
                className="inline-block bg-brand-gold text-white px-8 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:bg-brand-gold-dark transition-colors rounded-full"
              >
                {ctaLabel}
              </button>
              <Link
                to="/contact"
                onClick={onClose}
                className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-semibold border-b border-brand-gold pb-0.5 hover:text-brand-gold-dark"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
