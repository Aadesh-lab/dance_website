import { Menu, ChevronDown, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SlotPickerModal } from './SlotPickerModal';
import { useSite } from '../lib/useSite';
import { Brand } from './Brand';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const GoogleMapsIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Classes', to: '/classes' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Teachers', to: '/teachers' },
  { label: 'Contact', to: '/contact' },
];

export function Navbar() {
  const { data } = useSite();
  const { settings } = data;
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const whatsappHref = `https://wa.me/${settings.whatsapp}`;
  const mapHref = settings.mapEmbed
    ? settings.mapEmbed
    : `https://maps.google.com/?q=${encodeURIComponent(settings.location)}`;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative text-[11px] tracking-[0.2em] uppercase transition-colors font-medium ${
      isActive
        ? 'text-brand-gold after:content-[""] after:absolute after:-bottom-1.5 after:left-0 after:right-0 after:h-[2px] after:bg-brand-gold'
        : 'text-brand-ink hover:text-brand-gold'
    }`;

  return (
    <>
      <nav className="relative z-40 max-w-[1400px] mx-auto px-6 lg:px-12 pt-6 pb-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Brand size="md" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.filter((l) => l.label !== 'Contact').map((l) => (
            <NavLink key={l.label} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          <div className="relative">
            <button
              onClick={() => setIsContactOpen((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.2em] uppercase text-brand-gold hover:text-brand-gold-dark transition-colors font-semibold"
            >
              Contact us
              <ChevronDown size={14} className={`transition-transform ${isContactOpen ? 'rotate-180' : ''}`} />
            </button>
            {isContactOpen && (
              <div className="absolute top-full right-0 mt-3 w-52 bg-white shadow-2xl border border-black/5 py-2 z-50">
                <Link
                  to="/contact"
                  onClick={() => setIsContactOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest text-brand-ink hover:bg-brand-pink-soft transition-colors"
                >
                  Contact Page
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest text-brand-ink hover:bg-brand-pink-soft transition-colors"
                >
                  <WhatsAppIcon /> WhatsApp
                </a>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest text-brand-ink hover:bg-brand-pink-soft transition-colors"
                >
                  <GoogleMapsIcon /> View on Map
                </a>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-[11px] tracking-[0.2em] uppercase bg-brand-gold text-white px-5 py-2.5 hover:bg-brand-gold-dark transition-colors font-semibold"
          >
            {settings.navCtaLabel || 'Book Free Trial'}
          </button>
        </div>

        <button className="md:hidden text-brand-ink p-2" onClick={() => setIsMenuOpen(true)}>
          <Menu size={26} />
        </button>
      </nav>

      <SlotPickerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-72 h-full bg-white p-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <Brand size="sm" />
              <button onClick={() => setIsMenuOpen(false)} className="text-brand-ink">
                <X size={24} />
              </button>
            </div>
            <div className="flex flex-col gap-5">
              {NAV_LINKS.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-xs uppercase tracking-[0.2em] font-semibold ${
                      isActive ? 'text-brand-gold' : 'text-brand-ink hover:text-brand-gold'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <hr className="my-2 border-black/10" />
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-brand-ink hover:text-brand-gold">
                <WhatsAppIcon /> WhatsApp
              </a>
              <a href={mapHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-sm text-brand-ink hover:text-brand-gold">
                <GoogleMapsIcon /> View on Map
              </a>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsModalOpen(true);
                }}
                className="mt-4 text-[11px] tracking-[0.2em] uppercase bg-brand-gold text-white px-5 py-3 hover:bg-brand-gold-dark transition-colors font-semibold"
              >
                {settings.navCtaLabel || 'Book Free Trial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
