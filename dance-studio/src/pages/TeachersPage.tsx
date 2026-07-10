import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeacherModal } from '../components/TeacherModal';
import { SlotPickerModal } from '../components/SlotPickerModal';
import { useSite } from '../lib/useSite';
import type { Teacher } from '../lib/types';

function SmallTeacherCard({ t, onKnowMore }: { t: Teacher; onKnowMore: (t: Teacher) => void }) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative bg-white p-2 pb-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] shrink-0">
        <div className="relative w-28 h-28 md:w-32 md:h-32 overflow-hidden bg-brand-pink-soft">
          {t.image && (
            <img src={t.image} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
      </div>
      <div className="min-w-0">
        <h3 className="font-serif text-2xl md:text-3xl text-brand-ink leading-tight">{t.name}</h3>
        <div className="mt-1 text-brand-muted text-sm">{t.specialty}</div>
        <button
          type="button"
          onClick={() => onKnowMore(t)}
          className="mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-brand-gold font-semibold hover:text-brand-gold-dark"
        >
          Know More
          <span className="w-6 h-6 rounded-full border border-brand-gold flex items-center justify-center">
            <ArrowUpRight size={12} />
          </span>
        </button>
      </div>
    </div>
  );
}

function FeaturedTeacherRow({ t, onKnowMore }: { t: Teacher; onKnowMore: (t: Teacher) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-center">
      {/* Left: name + specialty */}
      <div className="text-center md:text-right">
        <h3 className="font-serif text-3xl md:text-4xl text-brand-ink leading-tight">{t.name}</h3>
        <div className="mt-2 text-brand-muted">{t.specialty}</div>
        <button
          type="button"
          onClick={() => onKnowMore(t)}
          className="mt-5 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-brand-gold font-semibold hover:text-brand-gold-dark"
        >
          Know More
          <span className="w-6 h-6 rounded-full border border-brand-gold flex items-center justify-center">
            <ArrowUpRight size={12} />
          </span>
        </button>
      </div>

      {/* Center: photo */}
      <div className="relative bg-white p-3 pb-6 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.35)] mx-auto">
        <div className="relative w-56 h-56 md:w-64 md:h-64 overflow-hidden bg-brand-pink-soft">
          {t.image && (
            <img src={t.image} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>
      </div>

      {/* Right: pull-quote */}
      {t.quote && (
        <div className="flex flex-col justify-center">
          <blockquote className="font-serif italic text-brand-gold text-xl md:text-2xl leading-relaxed">
            {t.quote}
          </blockquote>
          <div className="mt-4 text-xs uppercase tracking-widest text-brand-muted">
            &mdash; {t.quoteAuthor ?? t.name}
          </div>
        </div>
      )}
    </div>
  );
}

export function TeachersPage() {
  const { data } = useSite();
  const { settings } = data;
  const teachers = data.teachers ?? [];
  const heroImage = settings.teachersHeroImage || teachers[0]?.image;
  const joinImage = settings.joinTeamImage || teachers[0]?.image;

  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [slotOpen, setSlotOpen] = useState(false);

  // Featured = the first teacher with a quote, else the middle one
  const featuredIdx = (() => {
    const q = teachers.findIndex((t) => t.quote);
    if (q >= 0) return q;
    if (teachers.length === 0) return -1;
    return Math.floor(teachers.length / 2);
  })();
  const featured = featuredIdx >= 0 ? teachers[featuredIdx] : null;
  const others = teachers.filter((_, i) => i !== featuredIdx);

  // Split others into pairs, put half before featured and half after (matches reference)
  const half = Math.ceil(others.length / 2);
  const before = others.slice(0, half);
  const after = others.slice(half);

  const chunk = (arr: Teacher[]) => {
    const rows: Teacher[][] = [];
    for (let i = 0; i < arr.length; i += 2) rows.push(arr.slice(i, i + 2));
    return rows;
  };

  return (
    <>
      {/* Custom hero: pink watercolor wash on right with dancer photo */}
      <section className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden">
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[300px] md:min-h-[400px]">
          <div className="relative z-10">
            {settings.teachersEyebrow && (
              <div className="text-[11px] tracking-[0.35em] uppercase text-brand-gold font-semibold mb-4">
                {settings.teachersEyebrow}
              </div>
            )}
            <h1 className="font-serif text-brand-ink text-5xl md:text-7xl leading-[1.02]">
              {settings.teachersHeading || 'Teachers'}
            </h1>
            {settings.teachersIntro && (
              <p className="mt-6 text-brand-muted leading-relaxed max-w-md">
                {settings.teachersIntro}
              </p>
            )}
            <div className="mt-6 h-px w-16 bg-brand-gold" />
          </div>

          <div className="relative">
            {/* Pink watercolor blob behind photo */}
            <div
              aria-hidden
              className="absolute -inset-8 rounded-full opacity-70 blur-2xl pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, var(--color-brand-pink) 0%, var(--color-brand-pink-soft) 45%, transparent 75%)',
              }}
            />
            {heroImage && (
              <div className="relative z-10 mx-auto max-w-md">
                <img
                  src={heroImage}
                  alt=""
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24">
        <div className="flex flex-col gap-16 md:gap-24">
          {chunk(before).map((row, i) => (
            <div key={`b-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {row.map((t) => (
                <SmallTeacherCard key={t.id ?? t.name} t={t} onKnowMore={setSelectedTeacher} />
              ))}
            </div>
          ))}

          {featured && (
            <FeaturedTeacherRow t={featured} onKnowMore={setSelectedTeacher} />
          )}

          {chunk(after).map((row, i) => (
            <div key={`a-${i}`} className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {row.map((t) => (
                <SmallTeacherCard key={t.id ?? t.name} t={t} onKnowMore={setSelectedTeacher} />
              ))}
            </div>
          ))}
        </div>

        {/* Join team CTA */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-[35%_1fr] gap-10 md:gap-16 items-center">
          <div className="relative">
            {/* watercolor blob behind silhouette */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-full opacity-60 blur-2xl pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at 50% 50%, var(--color-brand-pink) 0%, var(--color-brand-pink-soft) 40%, transparent 70%)',
              }}
            />
            {joinImage && (
              <img src={joinImage} alt="" className="relative z-10 w-full max-w-[280px] mx-auto h-auto object-contain" />
            )}
          </div>
          <div>
            <div className="text-[11px] tracking-[0.3em] uppercase text-brand-gold font-semibold mb-3">
              {settings.joinTeamEyebrow || 'We are Looking for You'}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-ink leading-tight mb-4">
              {settings.joinTeamHeading || 'to Join Our Team'}
            </h2>
            <p className="text-brand-muted leading-relaxed mb-6 max-w-md">
              {settings.joinTeamBody ||
                "Are you passionate about movement and love sharing what you know? We're always looking for teachers who can inspire the next generation of dancers at our studio."}
            </p>
            <Link
              to="/contact"
              className="inline-block bg-brand-gold text-white px-8 py-3 text-xs tracking-[0.3em] uppercase font-semibold hover:bg-brand-gold-dark transition-colors rounded-full"
            >
              {settings.joinTeamCtaLabel || 'Join Team'}
            </Link>
          </div>
        </div>
      </div>

      <TeacherModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
        onBookClick={() => {
          setSelectedTeacher(null);
          setSlotOpen(true);
        }}
      />
      <SlotPickerModal isOpen={slotOpen} onClose={() => setSlotOpen(false)} />
    </>
  );
}
