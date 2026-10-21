import type { CSSProperties } from 'react';
import { cx } from '@/lib/cx';

export type LogoVariant = 'full' | 'reverse' | 'mark' | 'mark-reverse';

interface LogoProps {
  variant?: LogoVariant;
  /** Rendered height in px; the width follows the artwork's native ratio. */
  height?: number;
  /** Rendered width in px, for width-driven slots such as the footer lockup. */
  width?: number;
  className?: string;
}

/** Native aspect ratios of the supplied artwork. */
const RATIO: Record<LogoVariant, number> = {
  full: 813 / 550,
  reverse: 813 / 550,
  mark: 314 / 342,
  'mark-reverse': 314 / 342,
};

/** `public/brand/` filenames, e.g. `sanjivani-logo-full.png`. */
const FILENAME: Record<LogoVariant, string> = {
  full: 'sanjivani-logo-full.png',
  reverse: 'sanjivani-logo-reverse.png',
  mark: 'sanjivani-mark-full.png',
  'mark-reverse': 'sanjivani-mark-reverse.png',
};

/**
 * The official Sanjivani Group lockup. The source PNGs live in `public/brand/`
 * and are never recoloured, stretched or rebuilt — the reverse variants are the
 * client's ivory-and-green lockup, for brown and dark grounds only.
 *
 * Size is driven by `height` (or `width`) and can be overridden per breakpoint by
 * a `h-*` / `w-*` class in `className`.
 */
export function Logo({ variant = 'full', height = 64, width, className }: LogoProps) {
  const h = width ? Math.round(width / RATIO[variant]) : height;
  const w = width ?? Math.round(height * RATIO[variant]);

  const style = width
    ? ({ '--logo-width': `${width}px` } as CSSProperties)
    : ({ '--logo-height': `${height}px` } as CSSProperties);

  return (
    <img
      src={`/brand/${FILENAME[variant]}`}
      alt="Sanjivani Group"
      width={w}
      height={h}
      decoding="async"
      className={cx(
        'block shrink-0',
        width ? 'h-auto w-[var(--logo-width)]' : 'h-[var(--logo-height)] w-auto',
        className
      )}
      style={style}
    />
  );
}
