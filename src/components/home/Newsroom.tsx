import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { newsroom } from '@/content/home';

export function Newsroom() {
  const { t } = useTranslation();

  return (
    <section id="news" className="bg-paper py-[clamp(64px,8vw,120px)]">
      <Container>
        <SectionHeading
          eyebrowKey="news.eyebrow"
          titleKey="news.title"
          tone="light"
          linkHref="#news"
          linkKey="news.all"
          className="mb-14"
        />

        <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
          {newsroom.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.05}>
              <a
                href={item.href}
                className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-4 focus-visible:ring-offset-paper"
              >
                <div className="overflow-hidden rounded-[4px]">
                  <div className="transition-transform duration-[600ms] ease-brand group-hover:scale-[1.04]">
                    <ResponsiveImage
                      src={item.media.src}
                      label={t(`news.${item.id}.mediaLabel`)}
                      alt={t(`news.${item.id}.title`)}
                      tone="light"
                      ratio="16/10"
                      width={800}
                      height={500}
                    />
                  </div>
                </div>

                <p className="mt-5 text-[13px] font-bold uppercase tracking-[0.16em] text-brown-700">
                  {t(`news.${item.id}.category`)}
                </p>

                <h3 className="mt-2 font-display text-[23px] leading-snug text-brown-900 underline-offset-4 group-hover:underline">
                  {t(`news.${item.id}.title`)}
                </h3>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
