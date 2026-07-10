import { PageHero } from '../components/PageHero';
import { Pricing } from '../components/Pricing';
import { useSite } from '../lib/useSite';

export function PricingPage() {
  const { data } = useSite();
  const { settings } = data;
  return (
    <>
      <PageHero
        eyebrow={settings.pricingEyebrow || 'Memberships'}
        title={settings.pricingHeading || 'Pricing'}
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <Pricing />
      </div>
    </>
  );
}
