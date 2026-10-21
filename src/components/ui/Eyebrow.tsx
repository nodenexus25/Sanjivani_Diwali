import { cx } from '@/lib/cx';

interface EyebrowProps {
  /** 'dark' = green-500 on a dark surface, 'light' = green-700 on ivory/white. */
  tone?: 'dark' | 'light';
  /** Renders the 32px hairline before the label (dark surfaces only). */
  withRule?: boolean;
  children: string;
  className?: string;
}

export function Eyebrow({ tone = 'dark', withRule = false, children, className }: EyebrowProps) {
  return (
    <p
      className={cx(
        'flex items-center gap-3 font-sans text-eyebrow uppercase',
        tone === 'dark' ? 'text-green-500' : 'text-green-700',
        className
      )}
    >
      {withRule ? (
        <span aria-hidden="true" className="block h-px w-8 shrink-0 bg-current opacity-70" />
      ) : null}
      <span>{children}</span>
    </p>
  );
}
