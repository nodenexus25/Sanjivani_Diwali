import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Eyebrow } from './Eyebrow';
import { cx } from '@/lib/cx';

interface SectionHeadingProps {
  eyebrowKey?: string;
  titleKey: string;
  /** Surface the heading sits on. */
  tone?: 'dark' | 'light';
  linkHref?: string;
  linkKey?: string;
  linkExternal?: boolean;
  as?: 'h2' | 'h3';
  className?: string;
  titleClassName?: string;
  id?: string;
}

export function SectionHeading({
  eyebrowKey,
  titleKey,
  tone = 'light',
  linkHref,
  linkKey,
  linkExternal = false,
  as: Tag = 'h2',
  className,
  titleClassName,
  id,
}: SectionHeadingProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cx(
        'flex flex-wrap items-end justify-between gap-x-10 gap-y-6',
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrowKey ? (
          <Eyebrow tone={tone} withRule={tone === 'dark'} className="mb-4">
            {t(eyebrowKey)}
          </Eyebrow>
        ) : null}
        <Tag
          id={id}
          className={cx(
            'text-h2',
            tone === 'dark' ? 'text-ivory' : 'text-brown-900',
            titleClassName
          )}
        >
          {t(titleKey)}
        </Tag>
      </div>

      {linkHref && linkKey ? (
        <a
          href={linkHref}
          className={cx(
            'group inline-flex min-h-[44px] items-center gap-2 text-[15px] font-bold',
            tone === 'dark' ? 'text-green-500' : 'text-green-700'
          )}
          {...(linkExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {t(linkKey)}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 ease-brand group-hover:translate-x-1"
          />
        </a>
      ) : null}
    </div>
  );
}
