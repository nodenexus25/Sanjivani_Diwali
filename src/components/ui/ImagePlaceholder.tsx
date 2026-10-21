import { useTranslation } from 'react-i18next';
import { cx } from '@/lib/cx';

interface ImagePlaceholderProps {
  /** Surface the placeholder sits on. */
  tone?: 'dark' | 'light';
  /** CSS aspect-ratio, e.g. "16/10". */
  ratio: string;
  /** Human description of the shot the client still has to supply. */
  label: string;
  radius?: string;
  className?: string;
}

/**
 * Striped fill + label, shown until real photography arrives.
 * Never ships silently: the label always names the missing asset.
 */
export function ImagePlaceholder({
  tone = 'light',
  ratio,
  label,
  radius = '4px',
  className,
}: ImagePlaceholderProps) {
  const { t } = useTranslation();
  const isDark = tone === 'dark';

  return (
    <div
      className={cx(
        'relative isolate w-full overflow-hidden',
        isDark ? 'bg-brown-800 placeholder' : 'placeholder',
        className
      )}
      style={{ aspectRatio: ratio, borderRadius: radius }}
      role="img"
      aria-label={`${t('common.placeholderTag')}: ${label}`}
    >
      <p
        className={cx(
          'absolute bottom-3 left-4 max-w-[calc(100%-2rem)] text-[10px] font-bold uppercase leading-snug tracking-[0.16em]',
          isDark ? 'text-brown-300' : 'text-brown-700'
        )}
      >
        <span className="opacity-70">{t('common.placeholderTag')} · </span>
        {label}
      </p>
    </div>
  );
}
