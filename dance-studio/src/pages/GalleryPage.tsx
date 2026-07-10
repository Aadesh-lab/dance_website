import { PageHero } from '../components/PageHero';
import { Gallery } from '../components/Gallery';
import { Reels } from '../components/Reels';
import { useSite } from '../lib/useSite';

export function GalleryPage() {
  const { data } = useSite();
  const { settings } = data;
  return (
    <>
      <PageHero
        eyebrow={settings.galleryEyebrow || 'Portfolio'}
        title={settings.galleryHeading || 'Media Gallery'}
      />
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <Gallery />
        <Reels />
      </div>
    </>
  );
}
