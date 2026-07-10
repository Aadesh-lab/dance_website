import { Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../lib/useSite';
import { Brand } from './Brand';

const FOOTER_LINKS: { label: string; to: string }[] = [
  { label: 'About', to: '/about' },
  { label: 'Classes', to: '/classes' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Teachers', to: '/teachers' },
  { label: 'Contact', to: '/contact' },
];

export function Footer() {
  const { data } = useSite();
  const { settings } = data;

  const socials = [
    { url: settings.instagram, icon: Instagram, label: 'Instagram' },
    { url: settings.facebook, icon: Facebook, label: 'Facebook' },
    { url: settings.twitter, icon: Twitter, label: 'Twitter' },
    { url: settings.youtube, icon: Youtube, label: 'YouTube' },
  ].filter((s) => s.url);

  return (
    <footer id="contact" className="w-full bg-brand-footer text-white/90 mt-20 pt-16 md:pt-20 pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center gap-8 md:gap-10 text-center">
        <Link to="/" className="flex">
          <Brand size="lg" variant="light" orientation="vertical" />
        </Link>

        <div className="flex flex-wrap justify-center gap-x-6 md:gap-x-8 gap-y-3">
          {FOOTER_LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="text-[11px] tracking-[0.3em] uppercase text-white/80 hover:text-white transition-colors font-medium">
              {l.label}
            </Link>
          ))}
        </div>

        {socials.length > 0 && (
          <div className="flex items-center gap-4">
            {socials.map(({ url, icon: Icon, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-10 h-10 border border-white/30 flex items-center justify-center hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 text-xs text-white/70">
          {settings.location && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(settings.location)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors"
            >
              <MapPin size={14} className="text-brand-gold" />
              <span>{settings.location}</span>
            </a>
          )}
          {settings.phone && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={14} className="text-brand-gold" />
              <span>{settings.phone}</span>
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={14} className="text-brand-gold" />
              <span>{settings.email}</span>
            </a>
          )}
        </div>

        {settings.footerTagline && (
          <div className="text-xs text-white/60 tracking-widest uppercase">{settings.footerTagline}</div>
        )}

        <div className="pt-6 border-t border-white/10 w-full max-w-md">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/50">
            {settings.footerCopyright || `© ${new Date().getFullYear()} ${settings.businessName}. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
