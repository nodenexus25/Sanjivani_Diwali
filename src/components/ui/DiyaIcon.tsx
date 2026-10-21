import { cx } from '@/lib/cx';

interface DiyaIconProps {
  size?: number;
  /** Adds the CSS flame flicker (already disabled under reduced motion). */
  flicker?: boolean;
  /** Seconds; staggers a row of diyas. */
  delay?: number;
  className?: string;
}

/** Hand-drawn oil lamp: terracotta bowl with an amber flame. */
export function DiyaIcon({ size = 36, flicker = false, delay = 0, className }: DiyaIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={cx('shrink-0', className)}
      aria-hidden="true"
      focusable="false"
    >
      <g className={flicker ? 'diya-flame' : undefined} style={{ animationDelay: `${delay}s` }}>
        <path
          d="M24 8c3.6 4.4 5.6 7.4 5.6 10.2 0 3.2-2.5 5.6-5.6 5.6s-5.6-2.4-5.6-5.6C18.4 15.4 20.4 12.4 24 8Z"
          fill="var(--diya-flame)"
        />
        <path
          d="M24 14.5c1.7 2.2 2.6 3.7 2.6 5 0 1.5-1.2 2.6-2.6 2.6s-2.6-1.1-2.6-2.6c0-1.3.9-2.8 2.6-5Z"
          fill="var(--ivory)"
          opacity="0.85"
        />
      </g>
      <path
        d="M9 26h30c0 7.2-6.7 12.4-15 12.4S9 33.2 9 26Z"
        fill="var(--diya-bowl)"
      />
      <path
        d="M9 26h30"
        stroke="var(--brown-700)"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
