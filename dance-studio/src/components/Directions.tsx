import { useEffect, useState } from 'react';
import { X, Music2 } from 'lucide-react';
import { useSite } from '../lib/useSite';
import { api } from '../lib/api';

export function Directions() {
  const { data } = useSite();
  const [tab, setTab] = useState<'adult' | 'kids'>('adult');
  const [broken, setBroken] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<{ image: string; title: string; description?: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const openModal = (style: string) => {
    setSelectedStyle(style);
    setStatus('idle'); setErrMsg(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ style?: string }>).detail;
      openModal(detail?.style || 'Trial');
    };
    window.addEventListener('lldance:open-trial', onOpen);
    return () => window.removeEventListener('lldance:open-trial', onOpen);
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus('sending'); setErrMsg(null);
    try {
      await api.post('/api/public/submissions', {
        name: fd.get('name'),
        phone: fd.get('phone'),
        age: fd.get('age')?.toString(),
        style: selectedStyle,
      });
      setStatus('done');
      setTimeout(() => setIsModalOpen(false), 1200);
    } catch (e: unknown) {
      setStatus('error');
      setErrMsg(e instanceof Error ? e.message : 'Submission failed');
    }
  };

  const visible = data.courses.filter((c) => c.category === tab);
  const { settings } = data;

  return (
    <div id="styles" className="relative py-20 md:py-28">
      <div className="relative text-center mb-14">
        <div className="watercolor-blob left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[280px]" />
        <div className="relative">
          <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-4">{settings.classesSectionEyebrow || 'Our Classes'}</div>
          <h2 className="font-serif text-4xl md:text-6xl text-brand-ink leading-[1.05]">
            {settings.classesSectionHeading || 'Choose your perfect style'}
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-brand-gold" />
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-16">
        <button
          onClick={() => setTab('adult')}
          className={`px-8 py-3 text-[11px] tracking-[0.25em] uppercase font-semibold transition-colors ${tab === 'adult' ? 'bg-brand-gold text-white' : 'bg-transparent text-brand-ink border border-brand-ink/20 hover:border-brand-gold'}`}
        >
          {settings.classesAdultTabLabel || 'Adult styles'}
        </button>
        <button
          onClick={() => setTab('kids')}
          className={`px-8 py-3 text-[11px] tracking-[0.25em] uppercase font-semibold transition-colors ${tab === 'kids' ? 'bg-brand-gold text-white' : 'bg-transparent text-brand-ink border border-brand-ink/20 hover:border-brand-gold'}`}
        >
          {settings.classesKidsTabLabel || 'Kids styles'}
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-24 text-brand-muted uppercase tracking-[0.3em] text-xs">
          Coming soon — new {tab} styles being added.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visible.map((dir) => {
            const hasImage = dir.image && !broken[dir.slug];
            return (
              <div
                key={dir.slug}
                className="group bg-brand-paper flex flex-col shadow-sm hover:shadow-xl transition-shadow"
              >
                <div
                  onClick={() => hasImage && setPreview({ image: dir.image, title: dir.title, description: dir.description })}
                  className={`relative h-[320px] md:h-[380px] overflow-hidden ${hasImage ? 'cursor-zoom-in' : ''}`}
                >
                  {hasImage ? (
                    <img
                      src={dir.image}
                      alt={dir.title}
                      onError={() => setBroken((b) => ({ ...b, [dir.slug]: true }))}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-pink-soft to-brand-pink flex items-center justify-center">
                      <Music2 size={120} strokeWidth={1} className="text-brand-gold/40" />
                    </div>
                  )}
                </div>

                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-3">
                    {dir.category === 'kids' ? 'Kids Division' : 'Adult Division'}
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-brand-ink mb-4 leading-tight">
                    {dir.title}
                  </h3>
                  {dir.description && (
                    <p className="text-sm text-brand-muted line-clamp-3 mb-6">
                      {dir.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-6">
                    <button
                      onClick={() => openModal(dir.title)}
                      className="text-[11px] tracking-[0.3em] uppercase text-brand-gold hover:text-brand-gold-dark font-semibold border-b border-brand-gold pb-0.5"
                    >
                      Know more
                    </button>
                    <button
                      onClick={() => openModal(dir.title)}
                      className="text-[11px] tracking-[0.3em] uppercase text-brand-ink hover:text-brand-gold font-semibold"
                    >
                      Trial class →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {preview && (
        <div
          onClick={() => setPreview(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md"
        >
          <button
            onClick={() => setPreview(null)}
            className="absolute top-6 right-6 md:top-8 md:right-8 text-white/80 hover:text-white z-10"
            aria-label="Close preview"
          >
            <X size={32} />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[90vh] flex flex-col items-center"
          >
            <img
              src={preview.image}
              alt={preview.title}
              className="max-w-full max-h-[75vh] object-contain shadow-2xl"
            />
            <div className="mt-6 text-center">
              <h3 className="font-serif text-3xl md:text-5xl text-white">
                {preview.title}
              </h3>
              {preview.description && (
                <p className="mt-3 text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                  {preview.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md p-10 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-brand-muted hover:text-brand-ink"
            >
              <X size={22} />
            </button>

            <div className="text-[11px] tracking-[0.3em] uppercase text-brand-muted mb-2">Trial class</div>
            <h3 className="font-serif text-3xl text-brand-ink mb-2">Sign up</h3>
            <p className="text-sm text-brand-muted mb-6">
              We will contact you to confirm your <span className="font-semibold text-brand-gold">{selectedStyle}</span> trial.
            </p>

            {status === 'done' ? (
              <div className="text-center py-6">
                <div className="font-serif text-2xl text-brand-gold mb-2">Thank you</div>
                <p className="text-sm text-brand-muted">We'll be in touch shortly.</p>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={submit}>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-2">Name</label>
                  <input name="name" type="text" required className="w-full bg-brand-paper border-b border-brand-ink/20 px-1 py-2 outline-none focus:border-brand-gold" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-2">Phone</label>
                  <input name="phone" type="tel" required className="w-full bg-brand-paper border-b border-brand-ink/20 px-1 py-2 outline-none focus:border-brand-gold" placeholder="+91" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-2">Age</label>
                  <input name="age" type="number" required min="3" max="100" className="w-full bg-brand-paper border-b border-brand-ink/20 px-1 py-2 outline-none focus:border-brand-gold" placeholder="Your age" />
                </div>

                {errMsg && <div className="text-sm text-red-500">{errMsg}</div>}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-brand-gold text-white py-4 text-[11px] tracking-[0.3em] uppercase font-semibold mt-4 hover:bg-brand-gold-dark disabled:opacity-60"
                >
                  {status === 'sending' ? 'Submitting…' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
