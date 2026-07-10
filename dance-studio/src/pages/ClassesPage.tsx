import { PageHero } from '../components/PageHero';
import { Directions } from '../components/Directions';
import { Advantages } from '../components/Advantages';
import { useSite } from '../lib/useSite';

export function ClassesPage() {
  const { data } = useSite();
  const { settings } = data;
  return (
    <>
      <PageHero
        eyebrow={settings.classesEyebrow || 'What We Teach'}
        title={settings.classesHeading || 'Classes'}
      />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {settings.classesIntro && (
          <p className="text-center text-brand-muted max-w-2xl mx-auto mb-8 -mt-8">{settings.classesIntro}</p>
        )}
        <Directions />
        <Advantages />
      </div>
    </>
  );
}
