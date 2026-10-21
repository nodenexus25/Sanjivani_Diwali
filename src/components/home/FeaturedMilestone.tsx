import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { CircularEconomy } from './CircularEconomy';
import { milestone } from '@/content/home';

export function FeaturedMilestone() {
  const { t } = useTranslation();

  return (
    <section id="sustainability" className="bg-brown-900 py-[clamp(64px,8vw,120px)]">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow tone="dark" withRule>
              {t('milestone.eyebrow')}
            </Eyebrow>
            <h2 className="text-h2 mt-5 text-ivory">{t('milestone.title')}</h2>
            <p className="mt-6 max-w-xl text-[18px] leading-relaxed text-brown-200">
              {t('milestone.body')}
            </p>
            <Button variant="outline" withArrow href="#news" className="mt-8">
              {t('milestone.cta')}
            </Button>
          </div>

          <div>
            {/* The page's single sweeping corner (spec §4) belongs to this image. */}
            <ResponsiveImage
              src={milestone.src}
              ratio="16/11"
              radius=""
              className="media-sweep"
              tone="dark"
              width={1200}
              height={825}
              alt={t('milestone.mediaLabel')}
              label={t('milestone.mediaLabel')}
            />
          </div>
        </div>

        <CircularEconomy />
      </Container>
    </section>
  );
}
