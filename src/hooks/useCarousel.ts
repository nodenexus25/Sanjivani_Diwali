import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { usePageVisible } from './usePageVisible';

interface CarouselOptions {
  count: number;
  /** Milliseconds each slide stays on screen. */
  interval?: number;
  /** Set false to force manual-only navigation. */
  enabled?: boolean;
}

interface CarouselApi {
  index: number;
  next: () => void;
  prev: () => void;
  goTo: (next: number) => void;
  paused: boolean;
  setPaused: (paused: boolean) => void;
  /** 0 → 1 for the active slide, driven by requestAnimationFrame. */
  progress: number;
  /** True when autoplay is actually running. */
  autoplaying: boolean;
}

/**
 * Headless carousel state. Time is accumulated across pauses so hovering the
 * carousel resumes the progress bar where it stopped.
 */
export function useCarousel({ count, interval = 7000, enabled = true }: CarouselOptions): CarouselApi {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const pageVisible = usePageVisible();
  const reduceMotion = useReducedMotion() ?? false;

  const elapsedRef = useRef(0);
  const lastRef = useRef(0);

  const autoplaying = enabled && !paused && pageVisible && !reduceMotion && count > 1;

  // Keep the index inside range when the slide list changes (festive toggle).
  useEffect(() => {
    setIndex((current) => (count === 0 ? 0 : Math.min(current, count - 1)));
  }, [count]);

  // A new slide restarts its own progress bar.
  useEffect(() => {
    elapsedRef.current = 0;
    setProgress(0);
  }, [index]);

  useEffect(() => {
    if (!autoplaying) return;

    let frame = 0;
    lastRef.current = performance.now();

    const tick = () => {
      const now = performance.now();
      elapsedRef.current += now - lastRef.current;
      lastRef.current = now;

      const next = elapsedRef.current / interval;

      if (next >= 1) {
        elapsedRef.current = 0;
        setProgress(0);
        setIndex((current) => (current + 1) % count);
        return;
      }

      setProgress(next);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [autoplaying, interval, count, index]);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count === 0) return;
      setIndex(((nextIndex % count) + count) % count);
    },
    [count]
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  return { index, next, prev, goTo, paused, setPaused, progress, autoplaying };
}
