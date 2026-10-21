import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useFestive } from '@/hooks/useFestive';
import { siteConfig } from '@/config/site';
import { FestiveStrip } from '@/components/home/FestiveStrip';
import { SiteHeader } from '@/components/home/SiteHeader';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { FounderSection } from '@/components/home/FounderSection';
import { BusinessesGrid } from '@/components/home/BusinessesGrid';
import { FeaturedMilestone } from '@/components/home/FeaturedMilestone';
import { Timeline } from '@/components/home/Timeline';
import { DeepavaliBand } from '@/components/home/DeepavaliBand';
import { Newsroom } from '@/components/home/Newsroom';
import { Pathways } from '@/components/home/Pathways';
import { SiteFooter } from '@/components/home/SiteFooter';

function SeoMeta({ festive }: { festive: boolean }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? 'en';
  const canonical =
    language === 'en' ? `${siteConfig.siteUrl}/` : `${siteConfig.siteUrl}/?lang=${language}`;
  // Crawlers only resolve absolute image URLs.
  const ogImage = `${siteConfig.siteUrl}${festive ? siteConfig.ogFestive : siteConfig.ogDefault}`;

  return (
    <Helmet htmlAttributes={{ lang: language }}>
      <title>{festive ? t('meta.festiveTitle') : t('meta.title')}</title>
      <meta name="description" content={t('meta.description')} />
      <link rel="canonical" href={canonical} />
      <meta property="og:site_name" content={t('brand.name')} />
      <meta property="og:title" content={festive ? t('meta.festiveTitle') : t('meta.title')} />
      <meta property="og:description" content={t('meta.description')} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={language === 'mr' ? 'mr_IN' : 'en_IN'} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={festive ? t('meta.festiveTitle') : t('meta.title')} />
      <meta name="twitter:image" content={ogImage} />
      <meta
        name="twitter:image:alt"
        content={festive ? t('meta.ogFestiveAlt') : t('meta.ogAlt')}
      />
      <link rel="alternate" hrefLang="en" href={`${siteConfig.siteUrl}/`} />
      <link rel="alternate" hrefLang="mr" href={`${siteConfig.siteUrl}/?lang=mr`} />
      <link rel="alternate" hrefLang="x-default" href={`${siteConfig.siteUrl}/`} />
    </Helmet>
  );
}

export default function App() {
  const festive = useFestive();
  const { t } = useTranslation();

  return (
    <>
      <SeoMeta festive={festive} />

      <a
        href="#main"
        className="sr-only rounded-full bg-green-600 px-5 py-3 text-[14px] font-bold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
      >
        {t('common.skipToContent')}
      </a>

      <FestiveStrip />

      <SiteHeader />

      <main id="main">
        <HeroCarousel />
        <FounderSection />
        <BusinessesGrid />
        <FeaturedMilestone />
        <Timeline />
        <DeepavaliBand />
        <Newsroom />
        <Pathways />
      </main>

      <SiteFooter />
    </>
  );
}
