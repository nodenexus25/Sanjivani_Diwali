import type { KeyboardEvent } from 'react';
import { useEffect } from 'react';
import FocusTrap from 'focus-trap-react';
import { motion, useReducedMotion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Lazy-loaded Deepavali film modal. No film exists yet, so the body shows the
 * client placeholder; the real player is mounted here (and only while `open`)
 * once the MP4 or YouTube ID is supplied.
 */
export function VideoModal({ open, onClose }: VideoModalProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-brown-950/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      />

      <FocusTrap
        focusTrapOptions={{ escapeDeactivates: false, initialFocus: false, onDeactivate: onClose }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={t('video.aria')}
          onKeyDown={handleKeyDown}
          className="relative flex aspect-[16/9] w-full max-w-[960px] flex-col overflow-hidden rounded-[4px] border border-ivory/[0.18] bg-brown-900"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.32, ease: EASE }}
        >
          <div className="flex items-center justify-between gap-4 border-b border-ivory/[0.18] px-5 py-3 sm:px-6 sm:py-4">
            <h2 className="font-display text-[22px] leading-tight text-ivory">{t('video.title')}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('common.close')}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-brown-200 transition-colors duration-300 ease-brand hover:bg-ivory/10 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          {/* Once the client delivers the film, replace this placeholder with the
              <iframe>/<video> player. It mounts here on open only, so no
              third-party embed is ever created on page load. */}
          <div className="m-4 flex flex-1 flex-col items-center justify-center gap-4 rounded-[4px] border border-ivory/[0.18] bg-brown-800 p-6 text-center sm:m-5">
            <Play aria-hidden="true" className="h-8 w-8 text-green-500" />
            <p className="max-w-[440px] text-[15px] text-brown-200">{t('video.unavailable')}</p>
          </div>
        </motion.div>
      </FocusTrap>
    </div>
  );
}

export default VideoModal;
