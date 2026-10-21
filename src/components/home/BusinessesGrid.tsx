import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { businesses } from '@/content/home';
import type { Business } from '@/content/types';

function BusinessCard({ business }: { business: Business }) {
  const { t } = useTranslation();
  const { id } = business;

  return (
    <a
      href={business.href}
      {...(business.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex h-full flex-col overflow-hidden rounded bg-ivory ring-1 ring-transparent transition-shadow duration-300 ease-brand hover:ring-sand-300 focus-visible:ring-2 focus-visible:ring-green-700"
    >
      <div className="aspect-[16/10] shrink-0 overflow-hidden">
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
      </div>

      <div className="flex flex-1 flex-col px-[26px] pb-[30px] pt-[26px]">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-green-700">
          {t(`businesses.${id}.tag`)}
        </p>
        <h3 className="text-h3 mt-3 text-brown-900">{t(`businesses.${id}.title`)}</h3>
        <p className="mt-3 text-[16px] leading-relaxed text-brown-700">
          {t(`businesses.${id}.desc`)}
        </p>
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[15px] font-bold text-green-700">
          {t('businesses.explore')}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
          />
          {business.external ? <span className="sr-only">{t('common.external')}</span> : null}
        </span>
      </div>
    </a>
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
