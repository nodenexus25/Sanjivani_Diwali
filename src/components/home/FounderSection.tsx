import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ResponsiveImage } from '@/components/ui/ResponsiveImage';
import { Reveal } from '@/components/ui/Reveal';
import { founder } from '@/content/home';

export function FounderSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="bg-ivory py-[clamp(64px,8vw,120px)]">
      <Container>
        <div className="flex flex-wrap gap-16">
          <Reveal className="basis-[380px] grow">
            <div className="overflow-hidden rounded-arch" style={{ aspectRatio: '4 / 5' }}>
              <ResponsiveImage
                src={founder.portraitSrc}
                alt={t('founder.portraitLabel')}
                width={900}
                height={1125}
                ratio="4/5"
                radius="0"
                tone="light"
                label={t('founder.portraitLabel')}
                className="h-full w-full"
              />
            </div>
          </Reveal>

          <Reveal className="basis-[480px] grow-[1.3]">
            <Eyebrow tone="light">{t('founder.eyebrow')}</Eyebrow>

            <h2 className="text-h2 mt-4 text-brown-900">{t('founder.title')}</h2>

            <p className="mt-6 text-[18px] leading-[1.7] text-brown-700">{t('founder.p1')}</p>
            <p className="mt-5 text-[18px] leading-[1.7] text-brown-700">{t('founder.p2')}</p>

            <div className="mt-14 border-t border-sand-300 pt-7">
              <h3 className="mb-6 text-[16px] font-bold text-brown-900">{t('founder.leadershipTitle')}</h3>

              <ul className="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
                {founder.leadership.map((person) => (
                  <li key={person.name}>
                    <p className="font-display text-[20px] font-semibold text-brown-900">{person.name}</p>
                    <p className="mt-1 text-[14px] text-brown-700">{t(person.roleKey)}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-8 text-[13px] text-brown-700">{t('founder.leadershipNote')}</p>
            </div>

            <a
              href="#businesses"
              className="group mt-10 inline-flex min-h-[44px] items-center gap-2 text-[15px] font-bold text-green-700"
            >
              {t('founder.link')}
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
              />
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
