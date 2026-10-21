import type { FormEvent } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { footerBusinessLinks, footerCompanyLinks, newsletterFallback } from '@/content/home';
import brandLogo from '@/assets/images/brand-group-logo.webp';

const COLUMN_HEADING =
  'font-sans text-[12px] font-bold uppercase tracking-[0.2em] text-brown-300';

const CONTACT_LINK =
  'inline-block transition-colors duration-300 ease-brand hover:text-ivory focus-visible:outline-none';

/** Group switchboard and general mailbox, from sanjivanigroup.org.in. */
const GROUP_PHONE_HREF = 'tel:+912423224120';
const GROUP_EMAIL_HREF = 'mailto:contactus@sanjivanigroup.org.in';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type NewsletterStatus = 'idle' | 'submitting' | 'subscribed' | 'invalid';

export function SiteFooter() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<NewsletterStatus>('idle');
  const [mapOpen, setMapOpen] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setStatus('invalid');
      return;
    }
    setStatus('submitting');
    try {
      await newsletterFallback(email.trim());
      setStatus('subscribed');
    } catch {
      setStatus('invalid');
    }
  };

  const message =
    status === 'invalid'
      ? t('footer.invalidEmail')
      : status === 'subscribed'
        ? t('footer.subscribed')
        : '';

  return (
    <footer id="contact" className="bg-brown-950 pt-[72px] pb-8 text-brown-200">
      <Container>
        <div className="grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          <Reveal delay={0}>
            <div>
              <h2 className={COLUMN_HEADING}>{t('footer.contactTitle')}</h2>

              <div className="mt-5 inline-flex w-fit items-center rounded-lg bg-ivory p-3">
                <img
                  src={brandLogo}
                  alt={t('brand.name')}
                  width={480}
                  height={328}
                  className="h-20 w-auto object-contain"
                />
              </div>

              <address className="mt-6 text-[15px] not-italic leading-relaxed">
                <p>{t('footer.address')}</p>
                <p className="mt-4">
                  <span className="block text-[12px] font-bold uppercase tracking-[0.2em] text-brown-300">
                    {t('footer.officeLabel')}
                  </span>
                  {t('footer.officeAddress')}
                </p>
                <p className="mt-4">
                  <a href={GROUP_PHONE_HREF} className={CONTACT_LINK}>
                    {t('footer.phone')}
                  </a>
                </p>
                <p>
                  <a href={GROUP_EMAIL_HREF} className={CONTACT_LINK}>
                    {t('footer.email')}
                  </a>
                </p>
              </address>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div>
              <h2 className={COLUMN_HEADING}>{t('footer.businessesTitle')}</h2>
              <ul className="mt-5 space-y-1">
                {footerBusinessLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="inline-flex min-h-[44px] items-center text-[15px] text-brown-200 transition-colors duration-300 ease-brand hover:text-ivory focus-visible:outline-none"
                    >
                      {t(`footer.business.${link.id}`)}
                      {link.external ? (
                        <span className="sr-only">{t('common.external')}</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className={COLUMN_HEADING}>{t('footer.companyTitle')}</h2>
              <ul className="mt-5 space-y-1">
                {footerCompanyLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="inline-flex min-h-[44px] items-center text-[15px] text-brown-200 transition-colors duration-300 ease-brand hover:text-ivory focus-visible:outline-none"
                    >
                      {t(`footer.company.${link.id}`)}
                      {link.external ? (
                        <span className="sr-only">{t('common.external')}</span>
                      ) : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div>
              <h2 className={COLUMN_HEADING}>{t('footer.newsletterTitle')}</h2>
              <p className="mt-5 text-[15px] leading-relaxed">{t('footer.newsletterText')}</p>

              <form className="mt-5" noValidate onSubmit={(event) => void handleSubmit(event)}>
                <label htmlFor="newsletter" className="sr-only">
                  {t('footer.newsletterLabel')}
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('footer.newsletterPlaceholder')}
                    aria-invalid={status === 'invalid'}
                    aria-describedby="newsletter-status"
                    className="min-h-[48px] w-full rounded-full border border-ivory/30 bg-transparent px-5 text-[15px] text-ivory placeholder:text-brown-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  />
                  <Button type="submit" size="sm" disabled={status === 'submitting'}>
                    {status === 'submitting' ? t('footer.subscribing') : t('footer.subscribe')}
                  </Button>
                </div>
                <p
                  id="newsletter-status"
                  role="status"
                  aria-live="polite"
                  className={
                    status === 'invalid'
                      ? 'mt-3 min-h-[20px] text-[13px] text-marigold'
                      : 'mt-3 min-h-[20px] text-[13px] text-green-500'
                  }
                >
                  {message}
                </p>
              </form>
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          {mapOpen ? (
            <iframe
              title={t('footer.mapTitle')}
              src="https://www.google.com/maps?q=Kopargaon%2C%20Maharashtra&output=embed"
              loading="lazy"
              width="1200"
              height="675"
              className="aspect-[16/9] h-auto w-full rounded-[4px] border border-ivory/[0.18]"
            />
          ) : (
            <div>
              <Button variant="outline" size="sm" onClick={() => setMapOpen(true)}>
                {t('footer.mapCta')}
              </Button>
              <p className="mt-3 text-[13px] text-brown-300">{t('footer.mapHint')}</p>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ivory/[0.12] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-brown-300">{t('footer.rights')}</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a
              href="#"
              className="inline-flex min-h-[44px] items-center text-[14px] text-brown-200 transition-colors duration-300 ease-brand hover:text-ivory focus-visible:outline-none"
            >
              {t('footer.privacy')}
            </a>
            <a
              href="#"
              className="inline-flex min-h-[44px] items-center text-[14px] text-brown-200 transition-colors duration-300 ease-brand hover:text-ivory focus-visible:outline-none"
            >
              {t('footer.terms')}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
