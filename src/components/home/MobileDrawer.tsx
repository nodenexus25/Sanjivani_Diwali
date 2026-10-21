import { useEffect, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { ChevronDown, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { businesses, navigation } from '@/content/home';
import { cx } from '@/lib/cx';
import brandEmblem from '@/assets/images/brand-group-emblem.webp';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'en', labelKey: 'common.english' },
  { code: 'mr', labelKey: 'common.marathi' },
] as const;

const BUSINESSES_PANEL_ID = 'drawer-businesses';

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
  const { t, i18n } = useTranslation();
  const [businessesOpen, setBusinessesOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape is handled here rather than via `escapeDeactivates`; the document
  // listener also covers the moment before focus enters the trap.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const activeLanguage = i18n.resolvedLanguage ?? 'en';

  const handlePanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') onClose();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="mobile-drawer"
          id="site-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={t('drawer.aria')}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onKeyDown={handlePanelKeyDown}
          className="fixed inset-0 z-[60] bg-brown-950"
        >
          <FocusTrap
            focusTrapOptions={{
              escapeDeactivates: false,
              clickOutsideDeactivates: false,
              initialFocus: false,
              onDeactivate: onClose,
            }}
          >
            <div className="absolute inset-0 flex flex-col">
              <div className="flex items-center justify-between border-b border-ivory/12 px-[clamp(20px,5vw,32px)] py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-ivory">
                    <img
                      src={brandEmblem}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9 object-contain"
                    />
                  </span>
                  <span className="flex flex-col leading-none">
                    <span className="font-display text-[20px] font-semibold tracking-[0.06em] text-ivory">
                      {t('brand.name')}
                    </span>
                    <span className="mt-1 text-[10px] font-medium tracking-[0.22em] text-brown-300">
                      {t('brand.sub')}
                    </span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t('common.close')}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 text-ivory transition-colors duration-300 ease-brand hover:border-ivory/50"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <nav
                aria-label={t('drawer.aria')}
                className="flex-1 overflow-y-auto px-[clamp(20px,5vw,32px)] py-6"
              >
                <ul className="flex flex-col gap-1">
                  {navigation.map((item) =>
                    item.id === 'businesses' ? (
                      <li key={item.id}>
                        <button
                          type="button"
                          aria-expanded={businessesOpen}
                          aria-controls={BUSINESSES_PANEL_ID}
                          onClick={() => setBusinessesOpen((value) => !value)}
                          className="flex w-full items-center justify-between gap-4 py-2 text-left font-display text-[32px] leading-tight text-ivory"
                        >
                          {t('drawer.businesses')}
                          <ChevronDown
                            aria-hidden="true"
                            className={cx(
                              'h-6 w-6 shrink-0 text-brown-300 transition-transform duration-300 ease-brand',
                              businessesOpen && 'rotate-180'
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {businessesOpen ? (
                            <motion.div
                              key="drawer-businesses"
                              id={BUSINESSES_PANEL_ID}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <ul className="flex flex-col gap-1 pb-3 pt-2">
                                {businesses.map((business) => (
                                  <li key={business.id}>
                                    <a
                                      href={business.href}
                                      {...(business.external
                                        ? { target: '_blank', rel: 'noopener noreferrer' }
                                        : {})}
                                      onClick={onClose}
                                      className="flex min-h-[44px] items-center py-1.5 text-[16px] text-brown-200 transition-colors duration-300 ease-brand hover:text-ivory"
                                    >
                                      <span>{t(`businesses.${business.id}.title`)}</span>
                                      {business.external ? (
                                        <span className="sr-only">{t('common.external')}</span>
                                      ) : null}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </li>
                    ) : (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          onClick={onClose}
                          className="block py-2 font-display text-[32px] leading-tight text-ivory transition-opacity duration-300 ease-brand hover:opacity-80"
                        >
                          {t(`nav.${item.id}`)}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </nav>

              <div className="border-t border-ivory/12 px-[clamp(20px,5vw,32px)] py-6">
                <div
                  role="group"
                  aria-label={t('common.language')}
                  className="inline-flex items-center rounded-full border border-ivory/25"
                >
                  {LANGUAGES.map((language) => {
                    const isActive = activeLanguage === language.code;
                    return (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => void i18n.changeLanguage(language.code)}
                        aria-label={t('common.switchTo', { language: t(language.labelKey) })}
                        aria-current={isActive ? 'true' : undefined}
                        className={cx(
                          'inline-flex h-11 min-w-[64px] items-center justify-center rounded-full px-4 text-[14px] font-bold transition-colors duration-300 ease-brand',
                          isActive ? 'bg-green-500 text-brown-900' : 'text-ivory/80 hover:text-ivory'
                        )}
                      >
                        {t(language.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </FocusTrap>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
