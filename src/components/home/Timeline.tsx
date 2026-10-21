import { useTranslation } from 'react-i18next';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { timeline } from '@/content/home';

export function Timeline() {
  const { t } = useTranslation();

  return (
    <section id="education" className="bg-ivory py-[clamp(64px,8vw,120px)]">
      <Container>
        <SectionHeading
          eyebrowKey="timeline.eyebrow"
          titleKey="timeline.title"
          tone="light"
          className="mb-16"
        />

        <ol className="flex flex-col gap-8 border-l-2 border-brown-900 sm:grid sm:gap-10 sm:border-l-0 sm:border-t-2 sm:pl-0 sm:[grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {timeline.map((entry, index) => (
            <li key={entry.id} className="relative pl-6 pt-9 sm:pl-0">
              <Reveal delay={index * 0.05}>
                <span
                  aria-hidden="true"
                  className="absolute -left-2 top-9 h-3.5 w-3.5 rounded-full bg-green-700 sm:left-0 sm:-top-2"
                />
                <p className="font-display text-[40px] leading-none text-brown-900">{entry.year}</p>
                <p className="mt-3 max-w-[26ch] text-[16px] leading-relaxed text-brown-700">
                  {t(`timeline.${entry.id}`)}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
