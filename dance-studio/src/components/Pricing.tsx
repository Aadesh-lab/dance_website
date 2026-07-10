import { useSite } from '../lib/useSite';

export function Pricing() {
  const { data } = useSite();
  const { settings } = data;
  if (data.pricing.length === 0) return null;

  const choose = (planName: string) => {
    window.dispatchEvent(new CustomEvent('lldance:open-trial', { detail: { style: planName } }));
    document.getElementById('styles')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div id="pricing" className="relative py-20 md:py-28">
      <div className="text-center mb-16">
        <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-4">{settings.pricingEyebrow || 'Fees'}</div>
        <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.05]">
          {settings.pricingHeading || 'Simple, elegant pricing'}
        </h2>
        <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
        {settings.pricingIntro && (
          <p className="mt-6 text-sm text-brand-muted max-w-xl mx-auto">{settings.pricingIntro}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
        {data.pricing.map((p) => {
          const hasSave = p.saveAmount && p.saveAmount !== '0' && p.saveAmount !== '';
          const highlight = !!p.highlight;
          return (
            <div
              key={p.id ?? p.name}
              className={`p-10 flex flex-col h-full text-center border ${highlight ? 'bg-brand-paper border-brand-gold shadow-[0_20px_50px_-25px_rgba(201,160,122,0.6)]' : 'bg-white border-brand-ink/10'}`}
            >
              <div className="text-[10px] tracking-[0.3em] uppercase text-brand-muted">{p.duration}</div>
              <h3 className="font-serif text-2xl text-brand-ink mt-3 mb-6">{p.name}</h3>
              <div className={`font-serif text-6xl leading-none ${highlight ? 'text-brand-gold' : 'text-brand-ink'}`}>
                ₹{p.price.toLocaleString('en-IN')}
              </div>
              <div className={`mt-4 text-xs tracking-widest uppercase min-h-[1rem] ${highlight ? 'text-brand-gold-dark' : 'text-brand-muted'}`}>
                {hasSave ? `Save ₹${p.saveAmount}` : ' '}
              </div>
              <div className="mx-auto mt-4 mb-8 h-px w-10 bg-brand-gold" />

              <button
                onClick={() => choose(p.name)}
                className={`mt-auto py-4 text-[11px] tracking-[0.3em] uppercase font-semibold transition-colors ${
                  highlight ? 'bg-brand-gold text-white hover:bg-brand-gold-dark' : 'bg-brand-ink text-white hover:bg-brand-gold'
                }`}
              >
                {settings.pricingChoosePlanLabel || 'Choose plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
