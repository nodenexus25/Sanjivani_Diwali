import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cx } from '@/lib/cx';

type ButtonVariant = 'primary' | 'on-dark' | 'outline' | 'outline-dark';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  /** 'sm' (44px) is the header height, 'md' (52px) is the page default. */
  size?: 'sm' | 'md';
  withArrow?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  external?: boolean;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  id?: string;
}

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-green-600 text-white hover:bg-green-700',
  // Leaf Green on dark carries brown-900 text (the only pairing that passes on photography).
  'on-dark': 'bg-green-500 text-brown-900 hover:bg-green-300',
  outline: 'border border-ivory/40 text-ivory hover:border-ivory/70 hover:bg-ivory/5',
  'outline-dark': 'border border-brown-900/25 text-brown-900 hover:border-brown-900/50 hover:bg-brown-900/5',
};

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  className,
  type = 'button',
  disabled = false,
  external = false,
  ariaLabel,
  ariaExpanded,
  ariaControls,
  id,
}: ButtonProps) {
  const classes = cx(
    'group/btn inline-flex items-center justify-center gap-2.5 rounded-full px-7 font-sans text-[15px] font-bold transition-colors duration-300 ease-brand',
    size === 'md' ? 'min-h-[52px]' : 'min-h-[44px] px-5 text-[14px]',
    VARIANTS[variant],
    disabled && 'pointer-events-none opacity-50',
    className
  );

  const content = (
    <>
      {children}
      {withArrow ? (
        <ArrowRight
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 ease-brand group-hover/btn:translate-x-1"
        />
      ) : null}
    </>
  );

  if (href) {
    return (
      <a
        id={id}
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
    >
      {content}
    </button>
  );
}
