type PageHeroProps = {
  title: string;
  eyebrow?: string;
  image?: string;
};

export function PageHero({ title, eyebrow, image }: PageHeroProps) {
  return (
    <section className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-8 pb-16 md:pt-14 md:pb-24">
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative flex-1 text-center md:text-left">
          <div className="watercolor-blob left-1/2 md:left-24 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[260px]" />
          <div className="relative">
            {eyebrow && (
              <div className="text-[11px] tracking-[0.35em] uppercase text-brand-gold font-semibold mb-4">
                {eyebrow}
              </div>
            )}
            <h1 className="font-serif text-brand-ink text-5xl md:text-7xl leading-[1.02]">
              {title}
            </h1>
            <div className="mt-6 h-px w-16 bg-brand-gold mx-auto md:mx-0" />
          </div>
        </div>
        {image && (
          <div className="w-full max-w-sm md:max-w-xs">
            <div className="relative bg-white p-3 pb-6 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.35)] rotate-[3deg]">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-pink-soft">
                <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
