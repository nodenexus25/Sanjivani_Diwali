import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { pathways } from '@/content/home';
import { cx } from '@/lib/cx';

export function Pathways() {
  const { t } = useTranslation();

  return (
    <section id="careers" className="bg-ivory py-[clamp(64px,8vw,120px)]">
      <Container>
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {pathways.map((card, index) => {
            const isDark = card.tone === 'dark';
            return (
              <Reveal key={card.id} delay={index * 0.06}>
                <a
                  href={card.href}
                  {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={cx(
                    'group flex h-full min-h-[220px] flex-col rounded-[4px] p-9 transition-colors duration-300 ease-brand hover:ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                    isDark
                      ? 'border border-ivory/[0.18] bg-brown-800 hover:ring-ivory/40 focus-visible:ring-green-500'
                      : 'border border-sand-300 bg-paper hover:ring-green-700/30 focus-visible:ring-green-700'
                  )}
                >
                  <Eyebrow tone={isDark ? 'dark' : 'light'}>
                    {t(`pathways.${card.id}.eyebrow`)}
                  </Eyebrow>

                  <h3
                    className={cx(
                      'mt-4 font-display text-[30px] leading-tight',
                      isDark ? 'text-ivory' : 'text-brown-900'
                    )}
                  >
                    {t(`pathways.${card.id}.title`)}
                    {card.external ? (
                      <>
                        <ArrowUpRight
                          aria-hidden="true"
                          className="ml-2 inline-block h-5 w-5 align-[-2px] text-green-700"
                        />
                        <span className="sr-only">{t('common.external')}</span>
                      </>
                    ) : null}
                  </h3>

                  <p
                    className={cx(
                      'mt-4 text-[16px] leading-relaxed',
                      isDark ? 'text-brown-200' : 'text-brown-700'
                    )}
                  >
                    {t(`pathways.${card.id}.text`)}
                  </p>

                  <div className="mt-auto pt-6">
                    <ArrowRight
                      aria-hidden="true"
                      className={cx(
                        'h-5 w-5 transition-transform duration-300 ease-brand group-hover:translate-x-1',
                        isDark ? 'text-green-500' : 'text-green-700'
                      )}
                    />
                  </div>
                </a>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
