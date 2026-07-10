import { useSite } from '../lib/useSite';

type Size = 'sm' | 'md' | 'lg';
type Variant = 'light' | 'dark';
type Orientation = 'horizontal' | 'vertical';

type BrandProps = {
  size?: Size;
  variant?: Variant;
  showImage?: boolean;
  orientation?: Orientation;
  className?: string;
};

const IMAGE_SIZE: Record<Size, string> = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
  lg: 'h-20 w-20',
};

const LINE1_SIZE: Record<Size, string> = {
  sm: 'text-2xl',
  md: 'text-3xl md:text-4xl',
  lg: 'text-5xl md:text-6xl',
};

const LINE2_SIZE: Record<Size, string> = {
  sm: 'text-[9px]',
  md: 'text-[10px] md:text-[11px]',
  lg: 'text-xs md:text-sm',
};

export function Brand({
  size = 'md',
  variant = 'dark',
  showImage = true,
  orientation = 'horizontal',
  className = '',
}: BrandProps) {
  const { data } = useSite();
  const { settings } = data;

  const line1 = settings.brandLine1 || "Let's Learn";
  const line2 = settings.brandLine2 || 'Dance Studio';

  const line1Color = variant === 'light' ? 'text-white' : 'text-brand-ink';
  const line2Color = variant === 'light' ? 'text-white/80' : 'text-brand-gold';

  const containerLayout =
    orientation === 'vertical'
      ? 'flex flex-col items-center gap-3'
      : 'flex items-center gap-3';

  // For horizontal, hide the wordmark text on very small screens if size is md
  const wordmarkVisibility =
    orientation === 'horizontal' && size !== 'lg' ? 'hidden sm:flex' : 'flex';

  return (
    <div className={`${containerLayout} ${className}`}>
      {showImage && settings.logo && (
        <img
          src={settings.logo}
          alt={`${settings.businessName} logo`}
          loading="eager"
          decoding="async"
          className={`${IMAGE_SIZE[size]} object-contain rounded-full drop-shadow-md shrink-0`}
        />
      )}
      <div
        className={`${wordmarkVisibility} flex-col leading-tight ${
          orientation === 'vertical' ? 'items-center text-center' : 'items-start text-left'
        }`}
      >
        <span className={`font-script ${LINE1_SIZE[size]} ${line1Color} leading-[0.95]`}>
          {line1}
        </span>
        <span
          className={`font-serif ${LINE2_SIZE[size]} ${line2Color} uppercase tracking-[0.25em] mt-1 font-medium`}
        >
          {line2}
        </span>
      </div>
    </div>
  );
}
