import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { DiyaIcon } from '@/components/ui/DiyaIcon';
import { useFestive } from '@/hooks/useFestive';

const VideoModal = lazy(() => import('./VideoModal'));
const EcardButton = lazy(() =>
  import('./EcardButton').then((module) => ({ default: module.EcardButton }))
);

interface Particle {
  id: number;
  left: number;
  size: number;
  delay: string;
  duration: string;
}

/** Deterministic ambient dots so the band looks identical on every visit. */
const PARTICLES: Particle[] = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  left: (index * 19 + 7) % 100,
  size: 3 + (index % 3),
  delay: `${-(index % 10) * 1.1}s`,
  duration: `${12 + (index % 5) * 2}s`,
}));

const DIYA_DELAYS = [0, 1, 2, 3, 4];

export function DeepavaliBand() {
  const { t } = useTranslation();
  const festive = useFestive();
  const reduceMotion = useReducedMotion();
  const bandRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);

  // Pause the ambient particles while the band is off-screen; under reduced
  // motion the `.particle` class already removes the animation, so the observer
  // is skipped entirely.
  useEffect(() => {
    if (reduceMotion) return;
    const node = bandRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setInView(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  if (!festive) return null;

  return (
    <section
      ref={bandRef}
      id="deepavali"
      className="relative overflow-hidden bg-brown-950 py-[clamp(64px,8vw,112px)] text-center"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((particle) => (
          <span
            key={particle.id}
            className="particle absolute rounded-full bg-diya-flame"
            style={{
              left: `${particle.left}%`,
              bottom: '-10%',
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              animationPlayState: inView ? 'running' : 'paused',
            }}
          />
        ))}
      </div>

      <Container className="relative">
        <div className="flex flex-col items-center">
          <div className="flex justify-center gap-4">
            {DIYA_DELAYS.map((order) => (
              <DiyaIcon key={order} size={48} flicker delay={order * 0.2} />
            ))}
          </div>

          <p lang="mr" className="mt-10 font-marathi-display leading-[1.05] text-marigold text-[clamp(56px,8vw,104px)]">
            {t('deepavali.greeting')}
          </p>

          <p className="mx-auto mt-8 max-w-[760px] font-display leading-snug text-ivory text-[clamp(22px,2.4vw,30px)]">
            {t('deepavali.message')}
          </p>

          <p className="mt-8 text-[16px] text-diya-sand">{t('deepavali.signoff')}</p>

          <div className="mt-10">
            <Button variant="primary" withArrow onClick={() => setVideoOpen(true)}>
              {t('deepavali.cta')}
            </Button>
          </div>

          <div className="mt-4">
            <Suspense fallback={null}>
              <EcardButton />
            </Suspense>
          </div>
        </div>
      </Container>

      <Suspense fallback={null}>
        <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
      </Suspense>
    </section>
  );
}
