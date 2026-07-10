import { useSite } from '../lib/useSite';

const DEFAULT_QUOTE =
  "You may be a skillful, effective employer but if you don't trust your personnel and the opposite.";
const DEFAULT_AUTHOR = 'FRANK SINATRA';

export function Advantages() {
  const { data } = useSite();
  const { advantages, settings } = data;

  const first = advantages[0];
  const second = advantages[1];

  const topImage = first?.image;
  const bottomImage = second?.image ?? first?.image;

  const heading = first?.title ?? 'Ballet Classes';
  const description = first?.description ?? '';
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const quote = (settings.advantagesQuote ?? '').trim() || DEFAULT_QUOTE;
  const author = (settings.advantagesQuoteAuthor ?? '').trim() || DEFAULT_AUTHOR;

  return (
    <div className="relative py-20 md:py-28 bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* LEFT — copy */}
        <div className="lg:col-span-5">
          <div className="text-[11px] tracking-[0.35em] uppercase text-brand-gold font-semibold mb-5">
            {settings.advantagesEyebrow || 'Our Studio'}
          </div>
          <h2 className="font-serif text-brand-ink leading-[1.05] text-4xl md:text-5xl lg:text-6xl">
            <span className="block font-bold">{settings.advantagesHeading || 'Ballet Classes'}</span>
            <span className="block font-normal italic text-brand-ink/90">
              {settings.advantagesSubheading || 'That will Make You Advance'}
            </span>
          </h2>
          <div className="mt-6 h-[2px] w-10 bg-brand-gold" />
          <div className="mt-4 text-[11px] tracking-[0.35em] uppercase text-brand-gold font-semibold">
            {heading || settings.advantagesSubEyebrow || 'Children & Adult Classes'}
          </div>

          <div className="mt-6 flex flex-col gap-4 text-[15px] leading-relaxed text-brand-muted max-w-md">
            {paragraphs.length > 0 ? (
              paragraphs.map((p, i) => <p key={i}>{p}</p>)
            ) : (
              <>
                <p>
                  From the very first plié our teachers craft an environment where technique
                  meets grace — where every student, no matter their age, finds their own voice
                  on the floor.
                </p>
                <p>
                  Small class sizes, personal attention, and an artistic philosophy rooted in
                  classical tradition make every session a step forward.
                </p>
              </>
            )}
          </div>
        </div>

        {/* MIDDLE — polaroid stack */}
        <div className="lg:col-span-4 relative order-first lg:order-none">
          <div className="relative mx-auto w-full max-w-[420px] aspect-[4/5]">
            {/* Top polaroid */}
            <div className="absolute left-0 top-0 w-[70%] bg-white p-3 pb-6 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.35)] rotate-[-4deg] z-20">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-pink-soft">
                {topImage ? (
                  <img
                    src={topImage}
                    alt={first?.title ?? ''}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </div>
            {/* Bottom polaroid */}
            <div className="absolute right-0 bottom-0 w-[70%] bg-white p-3 pb-6 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.35)] rotate-[4deg] z-30">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-pink-soft">
                {bottomImage ? (
                  <img
                    src={bottomImage}
                    alt={second?.title ?? first?.title ?? ''}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — pull-quote card */}
        <div className="lg:col-span-3">
          <div className="relative bg-brand-paper px-8 py-12 md:py-16 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.15)]">
            <div className="text-brand-gold font-serif text-5xl leading-none mb-4 select-none">
              &ldquo;
            </div>
            <blockquote className="font-serif italic text-brand-gold text-lg md:text-xl leading-relaxed">
              {quote}
            </blockquote>
            <div className="mt-6 text-[11px] tracking-[0.3em] uppercase text-brand-ink font-semibold">
              &mdash; {author}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
