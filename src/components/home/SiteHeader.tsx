import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Logo } from '@/components/ui/Logo';
import { MegaMenu } from '@/components/home/MegaMenu';
import { MobileDrawer } from '@/components/home/MobileDrawer';
import { navigation } from '@/content/home';
import { useScrolled } from '@/hooks/useScrolled';
import { cx } from '@/lib/cx';

const MEGA_MENU_ID = 'site-mega-menu';
const DRAWER_ID = 'site-drawer';
const HOVER_INTENT_MS = 150;

const LANGUAGES = [
  { code: 'en', labelKey: 'common.english' },
  { code: 'mr', labelKey: 'common.marathi' },
] as const;

/**
 * Two-state header sitting on top of the full-screen hero.
 *
 * State A (scrollY < 80) is transparent with the reverse logo; State B is the
 * paper bar with the full-colour logo. The festive strip publishes its height as
 * `--festive-strip-height`, so the header drops below it and rises when it is
 * dismissed.
 */
export function SiteHeader() {
  const { t, i18n } = useTranslation();
  const scrolled = useScrolled(80);

  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const businessesTriggerRef = useRef<HTMLButtonElement>(null);
  const hoverTimerRef = useRef<number | null>(null);

  const activeLanguage = i18n.resolvedLanguage ?? 'en';

  const closeMega = useCallback(() => setMegaOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const focusFirstMenuItem = useCallback(() => {
    const panel = document.getElementById(MEGA_MENU_ID);
    panel?.querySelector<HTMLElement>('[data-menu-item]')?.focus();
  }, []);

  // Track the section currently crossing the middle of the viewport.
  useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Hover intent on the mega-menu trigger.
  useEffect(
    () => () => {
      if (hoverTimerRef.current !== null) window.clearTimeout(hoverTimerRef.current);
    },
    []
  );

  const handleTriggerPointerEnter = () => {
    if (hoverTimerRef.current !== null) window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => setMegaOpen(true), HOVER_INTENT_MS);
  };

  const handleTriggerPointerLeave = () => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const handleTriggerClick = () => {
    setMegaOpen(true);
    window.requestAnimationFrame(focusFirstMenuItem);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    setMegaOpen(true);
    window.requestAnimationFrame(focusFirstMenuItem);
  };

  // Escape closes the mega menu and returns focus to its trigger.
  useEffect(() => {
    if (!megaOpen) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMegaOpen(false);
      businessesTriggerRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [megaOpen]);

  // Clicking outside the trigger or the panel closes the mega menu.
  useEffect(() => {
    if (!megaOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (businessesTriggerRef.current?.contains(target)) return;
      if (document.getElementById(MEGA_MENU_ID)?.contains(target)) return;
      setMegaOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [megaOpen]);

  // Any in-page navigation dismisses the mega menu and the drawer.
  useEffect(() => {
    const onHashChange = () => {
      setMegaOpen(false);
      setDrawerOpen(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  /** State A sits on photography, so every control is drawn in ivory. */
  const controlTone = scrolled
    ? 'border-sand-300 text-brown-900 hover:border-brown-900/40'
    : 'border-ivory/35 text-ivory hover:border-ivory/70';

  const navLinkTone = scrolled
    ? 'text-brown-900 hover:text-green-700'
    : 'text-ivory hover:text-green-300';

  const navUnderline = scrolled ? 'h-0.5 bg-green-600' : 'h-px bg-ivory';

  return (
    <header
      className={cx(
        'fixed inset-x-0 z-50 transition-colors duration-fast ease-brand',
        scrolled ? 'bg-paper shadow-header' : 'border-b border-ivory/16 bg-transparent'
      )}
      // The festive strip, when present, publishes its own height.
      style={{ top: 'var(--festive-strip-height, 0px)' }}
      // Leaving the header (which contains the panel) dismisses the hover menu.
      onPointerLeave={closeMega}
    >
      <Container className="flex h-[var(--header-height)] items-center justify-between gap-6">
        <a
          href="#top"
          aria-label={t('brand.name')}
          className="grid h-12 items-center lg:h-16"
        >
          {/* Both lockups share one grid cell so the header never reflows. */}
          <Logo
            variant="reverse"
            height={64}
            className={cx(
              'col-start-1 row-start-1 !h-12 transition-opacity duration-fast ease-brand lg:!h-16',
              scrolled ? 'opacity-0' : 'opacity-100'
            )}
          />
          <Logo
            variant="full"
            height={56}
            className={cx(
              'col-start-1 row-start-1 !h-12 transition-opacity duration-fast ease-brand lg:!h-14',
              scrolled ? 'opacity-100' : 'opacity-0'
            )}
          />
        </a>

        <nav aria-label={t('nav.aria')} className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navigation.map((item) => {
              const active = activeSection === item.id;

              if (item.id === 'businesses') {
                return (
                  <li key={item.id}>
                    <button
                      ref={businessesTriggerRef}
                      type="button"
                      aria-expanded={megaOpen}
                      aria-controls={MEGA_MENU_ID}
                      aria-current={active ? 'true' : undefined}
                      onPointerEnter={handleTriggerPointerEnter}
                      onPointerLeave={handleTriggerPointerLeave}
                      onClick={handleTriggerClick}
                      onKeyDown={handleTriggerKeyDown}
                      className={cx(
                        'relative inline-flex min-h-[44px] items-center px-1 text-nav font-medium transition-colors duration-fast ease-brand',
                        navLinkTone
                      )}
                    >
                      {t('nav.businesses')}
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute inset-x-1 bottom-2 origin-left transition-transform duration-fast ease-brand',
                          navUnderline,
                          active || megaOpen ? 'scale-x-100' : 'scale-x-0'
                        )}
                      />
                    </button>
                  </li>
                );
              }

              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    aria-current={active ? 'true' : undefined}
                    className={cx(
                      'relative inline-flex min-h-[44px] items-center px-1 text-nav font-medium transition-colors duration-fast ease-brand',
                      navLinkTone
                    )}
                  >
                    {t(`nav.${item.id}`)}
                    <span
                      aria-hidden="true"
                      className={cx(
                        'absolute inset-x-1 bottom-2 origin-left transition-transform duration-fast ease-brand',
                        navUnderline,
                        active ? 'scale-x-100' : 'scale-x-0'
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center lg:flex">
          <div
            role="group"
            aria-label={t('common.language')}
            className={cx(
              'inline-flex items-center rounded-full border',
              scrolled ? 'border-sand-300' : 'border-ivory/35'
            )}
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
                    'inline-flex h-11 min-w-[52px] items-center justify-center rounded-full px-3 text-caption font-bold transition-colors duration-fast ease-brand',
                    isActive
                      ? scrolled
                        ? 'bg-green-600 text-white'
                        : 'bg-green-500 text-brown-900'
                      : scrolled
                        ? 'text-brown-900/75 hover:text-brown-900'
                        : 'text-ivory/80 hover:text-ivory'
                  )}
                >
                  {t(language.labelKey)}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label={t('common.menu')}
          aria-expanded={drawerOpen}
          aria-controls={DRAWER_ID}
          className={cx(
            'inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-fast ease-brand lg:hidden',
            controlTone
          )}
        >
          <Menu aria-hidden="true" className="h-5 w-5" />
        </button>
      </Container>

      <MegaMenu open={megaOpen} onClose={closeMega} id={MEGA_MENU_ID} />
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
    </header>
  );
}
