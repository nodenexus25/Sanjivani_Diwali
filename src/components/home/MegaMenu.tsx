import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { businesses } from '@/content/home';

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

const ARROW_KEYS = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];

export function MegaMenu({ open, onClose, id }: MegaMenuProps) {
  const { t } = useTranslation();

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!ARROW_KEYS.includes(event.key)) return;

    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('[data-menu-item]')
    );
    if (items.length === 0) return;

    const active = document.activeElement;
    const currentIndex = active instanceof HTMLElement ? items.indexOf(active) : -1;
    const step = event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1;

    event.preventDefault();
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + step + items.length) % items.length;
    items[nextIndex]?.focus();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mega-menu"
          id={id}
          role="group"
          aria-label={t('megaMenu.aria')}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onKeyDown={handleKeyDown}
          className="absolute inset-x-0 top-full border-t border-sand-300 bg-paper"
        >
          <Container className="py-9">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
              <div>
                <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                  {businesses.map((business) => (
                    <li key={business.id}>
                      <a
                        href={business.href}
                        {...(business.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        data-menu-item
                        onClick={onClose}
                        className="group block rounded-[4px] border border-transparent p-3.5 transition-colors duration-300 ease-brand hover:border-sand-300 hover:bg-ivory focus-visible:border-sand-300 focus-visible:bg-ivory"
                      >
                        <span className="font-sans text-[12px] font-bold uppercase tracking-[0.14em] text-green-700">
                          {t(`businesses.${business.id}.tag`)}
                        </span>
                        <span className="mt-2.5 block font-display text-[20px] leading-snug text-brown-900">
                          {t(`businesses.${business.id}.title`)}
                        </span>
                        <span className="mt-1.5 block text-[14px] leading-relaxed text-brown-700">
                          {t(`businesses.${business.id}.desc`)}
                        </span>
                        <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold text-green-700 opacity-0 transition-opacity duration-300 ease-brand group-hover:opacity-100 group-focus-visible:opacity-100">
                          {t('businesses.explore')}
                          <ArrowRight aria-hidden="true" className="h-[14px] w-[14px]" />
                          {business.external ? (
                            <span className="sr-only">{t('common.external')}</span>
                          ) : null}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>

                <a
                  href="#businesses"
                  data-menu-item
                  onClick={onClose}
                  className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-bold text-green-700 transition-opacity duration-300 ease-brand hover:opacity-80"
                >
                  {t('megaMenu.all')}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </a>
              </div>

              <div className="rounded-[4px] border border-sand-300 bg-ivory p-[26px]">
                <Eyebrow tone="light">{t('megaMenu.featured.eyebrow')}</Eyebrow>
                <p className="mt-3.5 font-display text-[22px] leading-snug text-brown-900">
                  {t('megaMenu.featured.title')}
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-brown-700">
                  {t('megaMenu.featured.body')}
                </p>
                <Button variant="primary" size="sm" withArrow href="#sustainability" className="mt-5">
                  {t('megaMenu.featured.cta')}
                </Button>
              </div>
            </div>
          </Container>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
