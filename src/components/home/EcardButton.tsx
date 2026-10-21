import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { DiyaIcon } from '@/components/ui/DiyaIcon';
import { Logo } from '@/components/ui/Logo';

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1350;
const DIYA_DELAYS = [0, 1, 2, 3, 4];

/**
 * Renders the branded Deepavali card off-screen and exports it to a PNG on
 * click. `html-to-image` is imported inside the handler so the exporter stays
 * out of the main bundle until the visitor actually asks for a card.
 */
export function EcardButton() {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    const node = cardRef.current;
    if (!node) return;
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(node, {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        pixelRatio: 1,
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'sanjivani-deepavali.png';
      link.click();
    } catch {
      // Best-effort export: unsupported browsers simply do nothing.
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => void downloadCard()}>
        {t('deepavali.ecard')}
      </Button>

      <div
        ref={cardRef}
        aria-hidden="true"
        className="fixed -left-[9999px] top-0 bg-brown-950"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-12 px-24 text-center">
          <div className="flex gap-8">
            {DIYA_DELAYS.map((order) => (
              <DiyaIcon key={order} size={96} />
            ))}
          </div>

          <p lang="mr" className="font-marathi-display leading-[1.05] text-marigold text-[132px]">
            {t('deepavali.ecardTitle')}
          </p>

          <p className="font-display leading-snug text-ivory text-[40px]">
            {t('deepavali.signoff')}
          </p>

          <p className="text-diya-sand text-[30px]">{t('deepavali.ecardFrom')}</p>

          <Logo variant="mark-reverse" height={120} />
        </div>
      </div>
    </>
  );
}
