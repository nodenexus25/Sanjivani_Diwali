import { useTranslation } from 'react-i18next';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { businesses } from '@/content/home';
import type { Business } from '@/content/types';
import { cx } from '@/lib/cx';

function BusinessCard({ business }: { business: Business }) {
  const { t } = useTranslation();
  const { id } = business;
  const linkProps = business.external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded bg-ivory ring-1 ring-transparent transition-shadow duration-300 ease-brand hover:ring-sand-300 focus-within:ring-2 focus-within:ring-green-700">
      <a href={business.href} {...linkProps} className="block aspect-[16/10] shrink-0 overflow-hidden">
        <ResponsiveImage
          src={business.media.src}
          ratio="16/10"
          tone="light"
          width={800}
          height={500}
          alt={t(`businesses.${id}.mediaLabel`)}
          label={t(`businesses.${id}.mediaLabel`)}
          className="transition-transform duration-[600ms] ease-brand group-hover:scale-[1.04]"
        />
      </a>

      <div className="flex flex-1 flex-col px-[26px] pb-[30px] pt-[26px]">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-green-700">
          {t(`businesses.${id}.tag`)}
        </p>
        <h3 className="text-h3 mt-3 text-brown-900">
          <a
            href={business.href}
            {...linkProps}
            className="transition-colors duration-300 ease-brand hover:text-green-700 focus-visible:outline-none focus-visible:text-green-700"
          >
            {t(`businesses.${id}.title`)}
            {business.external ? <span className="sr-only">{t('common.external')}</span> : null}
          </a>
        </h3>
        <p className="mt-3 text-[16px] leading-relaxed text-brown-700">
          {t(`businesses.${id}.desc`)}
        </p>
        <a
          href={business.href}
          {...linkProps}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-bold text-green-700"
        >
          {t('businesses.explore')}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
          />
          {business.external ? <span className="sr-only">{t('common.external')}</span> : null}
        </a>

        {business.details?.length ? (
          <details className="group/details mt-5 border-t border-sand-300 pt-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[14px] font-bold text-green-700 [&::-webkit-details-marker]:hidden">
              <span>{t('businesses.moreDetails')}</span>
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 ease-brand group-open/details:rotate-180"
              />
            </summary>

            <div className="mt-4 space-y-4">
              {business.details.map((section) => (
                <div
                  key={section.id}
                  className={cx(
                    section.divider ? 'border-t border-sand-300 pt-4' : undefined
                  )}
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brown-500">
                    {t(`businesses.${id}.details.${section.id}.title`)}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {section.items.map((item) => {
                      const itemTitle = t(`businesses.${id}.details.${section.id}.items.${item.id}.title`);
                      const itemBodyKey = `businesses.${id}.details.${section.id}.items.${item.id}.body`;
                      const itemBody = t(itemBodyKey);
                      const hasBody = itemBody !== itemBodyKey;

                      return (
                        <li key={item.id}>
                          {item.href ? (
                            <a
                              href={item.href}
                              {...(item.external
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                              className="block rounded-[4px] border border-transparent px-3 py-2 transition-colors duration-300 ease-brand hover:border-sand-300 hover:bg-paper focus-visible:border-sand-300 focus-visible:bg-paper"
                            >
                              <span className="text-[15px] font-bold leading-snug text-brown-900">
                                {itemTitle}
                              </span>
                              {hasBody ? (
                                <span className="mt-1 block text-[14px] leading-relaxed text-brown-700">
                                  {itemBody}
                                </span>
                              ) : null}
                              <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-bold text-green-700">
                                {t('businesses.website')}
                                <ArrowRight aria-hidden="true" className="h-[14px] w-[14px]" />
                                {item.external ? (
                                  <span className="sr-only">{t('common.external')}</span>
                                ) : null}
                              </span>
                            </a>
                          ) : (
                            <div className="rounded-[4px] bg-paper px-3 py-2">
                              <p className="text-[15px] font-bold leading-snug text-brown-900">
                                {itemTitle}
                              </p>
                              {hasBody ? (
                                <p className="mt-1 text-[14px] leading-relaxed text-brown-700">
                                  {itemBody}
                                </p>
                              ) : null}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </article>
  );
}

export function BusinessesGrid() {
  return (
    <section id="businesses" className="bg-paper py-[clamp(64px,8vw,120px)]">
      <Container>
        <SectionHeading
          eyebrowKey="businesses.eyebrow"
          titleKey="businesses.title"
          tone="light"
          linkHref="#businesses"
          linkKey="businesses.viewAll"
          className="mb-14"
        />

        <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {businesses.map((business, index) => (
            <Reveal key={business.id} delay={index * 0.05} className="h-full">
              <BusinessCard business={business} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
