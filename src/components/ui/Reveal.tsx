import { useMemo } from 'react';
import type { ElementType, ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  /** Seconds to wait before the reveal starts. */
  delay?: number;
  className?: string;
  as?: ElementType;
}

/** fade + rise wrapper used by every scroll-in animation on the page. */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const reduceMotion = useReducedMotion();
  // `motion.create()` returns a new component identity per call, so it has to be
  // memoised or every re-render would remount (and restart) the children.
  const MotionTag = useMemo(() => motion.create(as as ElementType), [as]);

  // During the prerender pass there is no viewport, so `whileInView` would never
  // fire and the static HTML would ship with opacity:0 on every section.
  if (reduceMotion || typeof window === 'undefined') {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
