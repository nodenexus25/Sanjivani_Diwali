import { useEffect, useMemo, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { DiyaIcon } from '@/components/ui/DiyaIcon';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { useCarousel } from '@/hooks/useCarousel';
import { useFestive } from '@/hooks/useFestive';
import { heroSlides } from '@/content/home';
import type { HeroSlide } from '@/content/types';
import { cx } from '@/lib/cx';

/** Shared editorial easing (matches the design tokens). */
const EASE_EDITORIAL: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SLIDE_INTERVAL = 7000;
const SWIPE_THRESHOLD = 60;
/** Media crossfade, in ms. Overridden to ~0 under reduced motion by theme.css. */
const CROSSFADE = '900ms';
/** Clears the fixed header, which overlays the hero. */
const TOP_PADDING = 120;

/**
 * Functional scrims. They keep the copy legible without veiling the photograph, so
 * they are placed only where something is written:
 *
 *  - `SCRIM_HORIZONTAL` sits behind the copy, dark at the text's left edge and ramping
 *    to fully clear by x=93% so the right of the frame keeps the photo's colour
 *    untouched. `SCRIM_COPY_MASK` feathers its top edge; it is anchored to the bottom
 *    of the frame in pixels rather than percent, because the copy block is
 *    bottom-anchored and the two have to move together at every viewport height.
 *  - `SCRIM_HEADER` covers the header strip, which overlays the hero.
 *  - `SCRIM_TABS` covers the slide tabs along the bottom edge.
 *  - `SCRIM_MOBILE` replaces all three below `md`, where the copy is centred.
 *
 * Each gradient ends on an explicit `rgba(30,8,2,0)` rather than the `transparent`
 * keyword: `transparent` is transparent *black*, which drags the hue towards grey as
 * it fades.
 *
 * Alphas are the lightest that still hold the H1 (ivory) and the body (`#E6DAD0`) at
 * 4.5:1 over these four photographs. Measured worst case across 1440x900, 1440x768 and
 * 1440x640: H1 6.07:1, body 4.65:1, tabs 5.31:1, header 6.56:1. The body copy is the
 * binding constraint — it is dimmer than ivory, so it needs more scrim than the
 * headline does.
 */
const SCRIM_HORIZONTAL =
  'linear-gradient(90deg, rgba(30,8,2,0.88) 0%, rgba(30,8,2,0.82) 32%, rgba(30,8,2,0.69) 58%, rgba(30,8,2,0.33) 76%, rgba(30,8,2,0.06) 93%, rgba(30,8,2,0) 100%)';
/** Clears the scrim's top edge. Below it the tab band continues the darkening. */
const SCRIM_COPY_MASK =
  'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 100%)';
const SCRIM_HEADER =
  'linear-gradient(180deg, rgba(30,8,2,0.78) 0%, rgba(30,8,2,0.68) 82%, rgba(30,8,2,0) 100%)';
const SCRIM_TABS =
  'linear-gradient(0deg, rgba(30,8,2,0.78) 0%, rgba(30,8,2,0.50) 55%, rgba(30,8,2,0) 100%)';
const SCRIM_MOBILE =
  'linear-gradient(180deg, rgba(30,8,2,0.32) 0%, rgba(30,8,2,0.60) 45%, rgba(30,8,2,0.88) 100%)';

/**
 * `requestIdleCallback` is optional and not in every TS DOM lib version, so the
 * window is viewed through this narrower shape instead of being augmented.
 */
interface IdleWindow {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
}

interface CarouselNavButtonProps {
  label: string;
  onClick: () => void;
  pressed?: boolean;
  children: ReactNode;
}

/** 44×44 hairline control used for prev / next / play-pause. */
function CarouselNavButton({ label, onClick, pressed, children }: CarouselNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/35 text-ivory transition-colors duration-fast ease-brand hover:border-ivory/70 hover:bg-ivory/5"
    >
      {children}
    </button>
  );
}

interface SlideMediaProps {
  slide: HeroSlide;
  /** The first slide is the LCP element. */
  priority: boolean;
  /** Videos only start once the page has gone idle. */
  videosEnabled: boolean;
}

/** One full-bleed background layer. Decorative: the H1 carries the meaning. */
function SlideMedia({ slide, priority, videosEnabled }: SlideMediaProps) {
  const { media } = slide;
  const crop = slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined;

  if (media.type === 'video' && media.src) {
    // Posters stand in for the video until idle, and permanently on metered or
    // reduced-motion connections.
    if (!videosEnabled) {
      return media.poster ? (
        <img
          src={media.poster}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
          style={crop}
        />
      ) : null;
    }

    return (
      <video
        className="h-full w-full object-cover"
        style={crop}
        src={media.src}
        poster={media.poster}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
      />
    );
  }

  if (!media.src) return <div className="placeholder h-full w-full bg-brown-800" />;

  return (
    <picture>
      {media.mobile ? <source media="(max-width: 767px)" srcSet={media.mobile} /> : null}
      <img
        src={media.src}
        alt=""
        aria-hidden="true"
        width={2560}
        height={1440}
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        className="h-full w-full object-cover"
        style={crop}
      />
    </picture>
  );
}

export function HeroCarousel() {
  const { t } = useTranslation();
  const festive = useFestive();
  const reduceMotion = useReducedMotion() ?? false;
  // The prerender pass has no viewport and never runs effects, so the staggered
  // entrance has to be skipped or the hero would ship as invisible markup.
  const canAnimate = !reduceMotion && typeof window !== 'undefined';

  const slides = useMemo(
    () => heroSlides.filter((slide) => !slide.festiveOnly || festive),
    [festive]
  );
  const count = slides.length;

  const { index, next, prev, goTo, progress, setPaused } = useCarousel({
    count,
    interval: SLIDE_INTERVAL,
  });

  // Hover/focus pausing is transient; the pause button is a sticky user choice.
  // Keeping them apart means moving the mouse away never resumes a paused show.
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);

  useEffect(() => {
    setPaused(userPaused || hoverPaused);
  }, [userPaused, hoverPaused, setPaused]);

  // The festive toggle changes the slide list — restart cleanly on the first one.
  useEffect(() => {
    goTo(0);
  }, [count, goTo]);

  // Videos are held back until the page is idle, and skipped entirely on
  // `saveData` connections or under reduced motion.
  const [videosEnabled, setVideosEnabled] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    if (connection?.saveData) return;

    const idle = window as unknown as IdleWindow;
    let handle: number | null = null;
    let timeout: number | null = null;
    const enable = () => setVideosEnabled(true);

    if (typeof idle.requestIdleCallback === 'function') {
      handle = idle.requestIdleCallback(enable, { timeout: 2000 });
    } else {
      timeout = window.setTimeout(enable, 1200);
    }

    return () => {
      if (handle !== null) idle.cancelIdleCallback?.(handle);
      if (timeout !== null) window.clearTimeout(timeout);
    };
  }, [reduceMotion]);

  // Live-region text is only refreshed for user-initiated changes (never autoplay).
  const userActionRef = useRef(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!userActionRef.current) return;
    userActionRef.current = false;
    const changed = slides[index];
    if (!changed) return;
    setAnnouncement(
      t('hero.announce', {
        number: index + 1,
        total: count,
        title: t(`hero.slides.${changed.id}.title`),
      })
    );
  }, [index, slides, count, t]);

  const handlePrev = () => {
    userActionRef.current = true;
    prev();
  };

  const handleNext = () => {
    userActionRef.current = true;
    next();
  };

  const handleGoTo = (target: number) => {
    userActionRef.current = true;
    goTo(target);
  };

  const handleFocus = () => setHoverPaused(true);

  const handleBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setHoverPaused(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    }
  };

  const slideStagger = (order: number): MotionProps =>
    canAnimate
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: EASE_EDITORIAL, delay: order * 0.06 },
        }
      : {};

  const active = slides[index];

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label={t('hero.aria')}
      className="min-h-hero relative flex flex-col overflow-hidden bg-brown-950"
      style={{ paddingTop: TOP_PADDING }}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      {/* Layer 1 — background media, one stacked layer per slide. */}
      <div aria-hidden="true" className="absolute inset-0">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cx(
              'absolute inset-0 transition-opacity ease-brand',
              i === index ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transitionDuration: CROSSFADE }}
          >
            <div className="ken-burns h-full w-full">
              <SlideMedia slide={slide} priority={i === 0} videosEnabled={videosEnabled} />
            </div>
          </div>
        ))}

        {/* Layer 2 — scrims. */}
        {/* Copy scrim — bottom-anchored in px so it tracks the copy block at any
            viewport height, and feathered only at its top edge. */}
        <div
          className="absolute inset-x-0 bottom-0 hidden h-[760px] md:block"
          style={{
            background: SCRIM_HORIZONTAL,
            maskImage: SCRIM_COPY_MASK,
            WebkitMaskImage: SCRIM_COPY_MASK,
          }}
        />
        <div
          className="absolute inset-x-0 top-0 hidden h-[108px] md:block"
          style={{ background: SCRIM_HEADER }}
        />
        <div
          className="absolute inset-x-0 bottom-0 hidden h-[168px] md:block"
          style={{ background: SCRIM_TABS }}
        />
        <div className="absolute inset-0 md:hidden" style={{ background: SCRIM_MOBILE }} />
      </div>

      {/* Layer 3 — slide copy, bottom-left inside the container. */}
      <div className="relative z-10 flex flex-1 items-end pb-14">
        <Container className="w-full">
          <p aria-live="polite" className="sr-only">
            {announcement}
          </p>

          <motion.div
            className="max-w-[780px]"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_event, info) => {
              if (info.offset.x < -SWIPE_THRESHOLD) handleNext();
              else if (info.offset.x > SWIPE_THRESHOLD) handlePrev();
            }}
          >
            <AnimatePresence mode="wait">
              {active ? (
                <motion.div
                  key={active.id}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={t('hero.slideLabel', { number: index + 1, total: count })}
                  className="flex flex-col gap-[26px]"
                  initial={canAnimate ? { opacity: 0 } : false}
                  animate={{ opacity: 1 }}
                  exit={canAnimate ? { opacity: 0 } : undefined}
                  transition={{ duration: 0.35, ease: EASE_EDITORIAL }}
                >
                  {active.id === 'deepavali' ? (
                    <div aria-hidden="true" className="flex items-center gap-3">
                      {[0, 1, 2].map((order) => (
                        <DiyaIcon key={order} size={30} flicker delay={order * 0.2} />
                      ))}
                    </div>
                  ) : null}

                  <motion.div {...slideStagger(0)}>
                    <Eyebrow tone="dark" withRule>
                      {t(`hero.slides.${active.id}.eyebrow`)}
                    </Eyebrow>
                  </motion.div>

                  <motion.h1
                    className="font-display text-[clamp(44px,6vw,88px)] font-normal leading-[1.02] tracking-[-0.015em] text-ivory"
                    {...slideStagger(1)}
                  >
                    {t(`hero.slides.${active.id}.title`)}
                  </motion.h1>

                  <motion.p
                    className="max-w-[600px] text-[20px] leading-[1.6] text-brown-200"
                    {...slideStagger(2)}
                  >
                    {t(`hero.slides.${active.id}.body`)}
                  </motion.p>

                  <motion.div
                    className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"
                    {...slideStagger(3)}
                  >
                    <Button
                      variant="on-dark"
                      withArrow
                      href={active.ctaHref}
                      className="w-full justify-center sm:w-auto"
                    >
                      {t(`hero.slides.${active.id}.cta`)}
                    </Button>
                    <Button
                      variant="outline"
                      href={active.secondaryHref}
                      className="w-full justify-center sm:w-auto"
                    >
                      {t('hero.secondary')}
                    </Button>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </Container>
      </div>

      {/* Optional scroll cue, above the tabs. Decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[124px] inset-x-0 z-10 hidden md:block motion-reduce:hidden"
      >
        <Container className="flex items-center justify-end gap-3">
          <span className="text-caption font-semibold uppercase tracking-[0.24em] text-ivory/70">
            {t('hero.scroll')}
          </span>
          <span className="relative block h-10 w-px overflow-hidden bg-ivory/25">
            <span className="scroll-cue absolute inset-x-0 top-0 block h-1/2 bg-green-500" />
          </span>
        </Container>
      </div>

      {/* Layer 4 — slide tabs along the bottom edge, inside the container. */}
      <div className="relative z-10 pb-6">
        <Container>
          <div className="flex flex-col gap-4 border-t border-ivory/22 sm:flex-row sm:items-stretch sm:gap-8">
            <div
              role="tablist"
              className="flex flex-1 snap-x snap-mandatory overflow-x-auto no-scrollbar"
            >
              {slides.map((slide, i) => {
                const isActive = i === index;
                const number = String(i + 1).padStart(2, '0');
                const tabLabel = t(`hero.slides.${slide.id}.tab`);

                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={t('common.goToSlide', { number, title: tabLabel })}
                    onClick={() => handleGoTo(i)}
                    className={cx(
                      'relative flex min-h-[88px] min-w-[200px] flex-[1_1_200px] snap-start flex-col items-start justify-center gap-1.5 px-5 text-left transition-colors duration-fast ease-brand',
                      isActive ? 'text-ivory' : 'text-brown-300 hover:text-ivory'
                    )}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-0 h-0.5 bg-green-500"
                        style={{ width: `${progress * 100}%` }}
                      />
                    ) : null}
                    <span className="tabular text-[12px] font-bold tracking-[0.18em]">
                      {number}
                    </span>
                    <span className="text-[15px] font-semibold">{tabLabel}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <CarouselNavButton label={t('common.prev')} onClick={handlePrev}>
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </CarouselNavButton>
              <CarouselNavButton label={t('common.next')} onClick={handleNext}>
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </CarouselNavButton>
              <CarouselNavButton
                label={userPaused ? t('common.play') : t('common.pause')}
                onClick={() => setUserPaused((current) => !current)}
                pressed={userPaused}
              >
                {userPaused ? (
                  <Play aria-hidden="true" className="h-5 w-5" />
                ) : (
                  <Pause aria-hidden="true" className="h-5 w-5" />
                )}
              </CarouselNavButton>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
