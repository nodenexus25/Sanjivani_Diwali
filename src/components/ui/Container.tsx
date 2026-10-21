import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/** max-width 1280px with a fluid gutter. */
export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cx('mx-auto w-full max-w-container px-[clamp(20px,4vw,48px)]', className)}>
      {children}
    </div>
  );
}
