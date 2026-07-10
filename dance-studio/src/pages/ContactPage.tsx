import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { useSite } from '../lib/useSite';
import { api } from '../lib/api';

type FormState = 'idle' | 'sending' | 'done' | 'error';

export function ContactPage() {
  const { data } = useSite();
  const { settings, teachers } = data;
  const [status, setStatus] = useState<FormState>('idle');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const mapSrc =
    settings.mapEmbed && settings.mapEmbed.includes('http')
      ? settings.mapEmbed
      : `https://maps.google.com/maps?q=${encodeURIComponent(settings.location)}&output=embed`;

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus('sending');
    setErrMsg(null);
    try {
      await api.post('/api/public/submissions', {
        name: fd.get('name'),
        phone: fd.get('phone') ?? '',
        email: fd.get('email'),
        subject: fd.get('subject'),
        message: fd.get('message'),
        style: `Contact: ${fd.get('subject') ?? ''}`,
      });
      setStatus('done');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus('error');
      setErrMsg(err instanceof Error ? err.message : 'Submission failed');
      // eslint-disable-next-line no-console
      console.error('Contact form failed', err);
    }
  };

  const staff = teachers?.[0];
  const cardImage = settings.contactCardImage || staff?.image;
  const cardHeadline = settings.contactCardHeadline || "Want to Dance Today?\nThen Let's Chat!";

  return (
    <>
      <PageHero eyebrow={settings.contactEyebrow || 'Get in Touch'} title={settings.contactHeading || 'Contact'} />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-20">
        {settings.contactIntro && (
          <p className="text-center text-brand-muted max-w-2xl mx-auto mb-12 -mt-8">{settings.contactIntro}</p>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT: form */}
          <div className="bg-brand-paper p-8 md:p-12">
            <div className="text-[11px] tracking-[0.35em] uppercase text-brand-gold font-semibold mb-3">
              {settings.contactFormEyebrow || 'Say hello'}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl text-brand-ink leading-tight mb-8">
              {settings.contactFormHeading || 'Send us a message'}
            </h2>

            {status === 'done' ? (
              <div className="py-12 text-center">
                <div className="font-serif text-3xl text-brand-gold mb-2">Thank you</div>
                <p className="text-sm text-brand-muted">{settings.contactFormSuccessMessage || "We'll get back to you shortly."}</p>
              </div>
            ) : (
              <form className="flex flex-col gap-6" onSubmit={submit}>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-2">{settings.contactFormNameLabel || 'Name'}</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full bg-transparent border-b border-brand-ink/20 px-1 py-2 outline-none focus:border-brand-gold"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-2">{settings.contactFormEmailLabel || 'Email'}</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full bg-transparent border-b border-brand-ink/20 px-1 py-2 outline-none focus:border-brand-gold"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-2">{settings.contactFormSubjectLabel || 'Subject'}</label>
                  <input
                    name="subject"
                    type="text"
                    className="w-full bg-transparent border-b border-brand-ink/20 px-1 py-2 outline-none focus:border-brand-gold"
                    placeholder="What's this about?"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-2">{settings.contactFormMessageLabel || 'Message'}</label>
                  <textarea
                    name="message"
                    rows={5}
                    required
                    className="w-full bg-transparent border-b border-brand-ink/20 px-1 py-2 outline-none focus:border-brand-gold resize-none"
                    placeholder="Say something nice…"
                  />
                </div>

                {errMsg && <div className="text-sm text-red-500">{errMsg}</div>}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="self-start bg-brand-gold text-white px-10 py-4 text-xs tracking-[0.3em] uppercase font-semibold hover:bg-brand-gold-dark disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending…' : (settings.contactFormSubmitLabel || 'Send')}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: contact card */}
          <div>
            {cardImage && (
              <div className="relative bg-white p-3 pb-6 shadow-[0_25px_50px_-15px_rgba(0,0,0,0.35)] max-w-[420px] mb-8">
                <div className="relative aspect-[4/5] overflow-hidden bg-brand-pink-soft">
                  <img src={cardImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </div>
            )}

            {(settings.contactCardName || settings.contactCardTitle) && (
              <div className="mb-6">
                {settings.contactCardName && (
                  <div className="font-serif text-2xl text-brand-ink">{settings.contactCardName}</div>
                )}
                {settings.contactCardTitle && (
                  <div className="text-xs tracking-widest uppercase text-brand-muted mt-1">{settings.contactCardTitle}</div>
                )}
              </div>
            )}

            <h3 className="font-serif text-3xl md:text-4xl text-brand-ink leading-tight mb-8 whitespace-pre-line">
              {cardHeadline}
            </h3>

            {settings.contactCardBody && (
              <p className="text-brand-muted leading-relaxed mb-8 max-w-md">{settings.contactCardBody}</p>
            )}

            <ul className="flex flex-col gap-5 text-sm text-brand-muted">
              <li className="flex items-start gap-4">
                <span className="w-9 h-9 rounded-full bg-brand-paper flex items-center justify-center text-brand-gold shrink-0">
                  <MapPin size={16} />
                </span>
                <span>{settings.location}</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-9 h-9 rounded-full bg-brand-paper flex items-center justify-center text-brand-gold shrink-0">
                  <Clock size={16} />
                </span>
                <span className="whitespace-pre-line">{settings.contactSchedule || 'Mon – Sat, 8am – 9pm'}</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-9 h-9 rounded-full bg-brand-paper flex items-center justify-center text-brand-gold shrink-0">
                  <Phone size={16} />
                </span>
                <a href={`tel:${settings.phone}`} className="hover:text-brand-gold">{settings.phone}</a>
              </li>
              <li className="flex items-start gap-4">
                <span className="w-9 h-9 rounded-full bg-brand-paper flex items-center justify-center text-brand-gold shrink-0">
                  <Mail size={16} />
                </span>
                <a href={`mailto:${settings.email}`} className="hover:text-brand-gold">{settings.email}</a>
              </li>
            </ul>

            <div className="flex items-center gap-3 mt-10">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center hover:bg-brand-gold-dark transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center hover:bg-brand-gold-dark transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-brand-gold text-white flex items-center justify-center hover:bg-brand-gold-dark transition-colors"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative w-full h-[420px] md:h-[520px]">
        <iframe
          title="Studio location"
          src={mapSrc}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto bg-white shadow-2xl px-6 py-5 flex items-center gap-4 max-w-md mx-4">
            <img src={settings.logo} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <div className="font-serif text-lg text-brand-ink leading-tight">{settings.businessName}</div>
              <div className="text-xs text-brand-muted mt-1">{settings.location}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
