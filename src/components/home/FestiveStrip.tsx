import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { useFestive } from '@/hooks/useFestive';

/** Session-scoped so the strip returns on a fresh visit. */
const STORAGE_KEY = 'sanjivani.festive-dismissed';

function readDismissed(): boolean {
  // The prerender pass runs this initialiser in Node, where there is no DOM.
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    // sessionStorage can be unavailable (private mode, blocked storage).
    return false;
  }
}

/**
 * Fixed promo bar above the header. It overlays the hero and publishes its own
 * height as `--festive-strip-height`, which is what keeps the fixed header
 * directly beneath it — including while the bar animates open or closed.
 */
export function FestiveStrip() {
  const { t } = useTranslation();
  const festive = useFestive();
  const [dismissed, setDismissed] = useState<boolean>(readDismissed);
  const [height, setHeight] = useState(0);

  const observerRef = useRef<ResizeObserver | null>(null);

  const visible = festive && !dismissed;

  const attachObserver = useCallback((node: HTMLDivElement | null) => {
    observerRef.current?.disconnect();
    observerRef.current = null;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    observer.observe(node);
    observerRef.current = observer;
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--festive-strip-height', `${height}px`);
  }, [height]);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Ignore write failures.
    }
  };

  return (
    <AnimatePresence initial={false} onExitComplete={() => setHeight(0)}>
      {visible ? (
        <motion.div
          key="festive-strip"
          ref={attachObserver}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-40 overflow-hidden bg-marigold text-brown-900"
        >
          <Container className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center">
            <p className="text-[14px] font-semibold leading-snug">
              {t('festiveStrip.message')}{' '}
              <a
                href="#deepavali"
                className="underline decoration-1 underline-offset-2 transition-opacity duration-300 ease-brand hover:opacity-80"
              >
                {t('festiveStrip.link')}
              </a>
            </p>
            <button
              type="button"
              onClick={handleDismiss}
              aria-label={t('festiveStrip.dismiss')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ease-brand hover:bg-brown-900/10"
            >
              <X aria-hidden="true" className="h-4 w-4" />
            </button>
          </Container>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
