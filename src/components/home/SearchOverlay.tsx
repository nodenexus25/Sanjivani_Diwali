import { useEffect, useState } from 'react';
import FocusTrap from 'focus-trap-react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { searchSuggestions } from '@/content/home';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

/** Suggestion ids map onto copy that already exists elsewhere on the page. */
const SUGGESTION_LABEL_KEYS: Record<string, string> = {
  cbg: 'milestone.title',
  university: 'pathways.admissions.title',
  sugar: 'businesses.sugar.title',
  careers: 'pathways.careers.title',
};

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[70] overflow-y-auto bg-brown-950/95 py-[clamp(48px,12vh,120px)]"
    >
      <Container>
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: false,
            initialFocus: false,
            onDeactivate: onClose,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t('search.aria')}
            onClick={(event) => event.stopPropagation()}
            className="relative rounded-[4px] border border-ivory/18 bg-brown-900 p-[clamp(24px,4vw,40px)]"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-ivory transition-colors duration-300 ease-brand hover:bg-ivory/10"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>

            <h2 className="font-display text-[28px] leading-tight text-ivory">{t('search.title')}</h2>

            <form onSubmit={(event) => event.preventDefault()} className="mt-6">
              <label htmlFor="site-search-input" className="sr-only">
                {t('search.title')}
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="site-search-input"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('search.placeholder')}
                  className="h-[52px] w-full rounded-full border border-ivory/30 bg-transparent px-6 text-[16px] text-ivory transition-colors duration-300 ease-brand placeholder:text-brown-300 focus-visible:border-ivory/70"
                />
                <Button type="submit" variant="primary" size="sm">
                  {t('search.submit')}
                </Button>
              </div>
            </form>

            <p className="mt-5 text-[14px] leading-relaxed text-brown-300">{t('search.hint')}</p>

            <h3 className="mt-8 text-[13px] font-bold uppercase tracking-[0.2em] text-green-500">
              {t('search.suggestions')}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {searchSuggestions.map((suggestion) => (
                <li key={suggestion.id}>
                  <a
                    href={suggestion.href}
                    onClick={onClose}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-ivory/25 px-4 text-[14px] font-semibold text-ivory transition-colors duration-300 ease-brand hover:border-ivory/60 hover:bg-ivory/5"
                  >
                    {t(SUGGESTION_LABEL_KEYS[suggestion.id] ?? suggestion.id)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </FocusTrap>
      </Container>
    </div>
  );
}
