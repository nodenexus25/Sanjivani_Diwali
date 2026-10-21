import { Fragment, useEffect, useState } from 'react';
import type { Variants } from 'framer-motion';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { circularEconomy } from '@/content/home';
import { cx } from '@/lib/cx';

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const CONTAINER_VARIANTS: Variants = {
  show: { transition: { staggerChildren: 0.08 } },
};

function NodeContent({ id }: { id: string }) {
  const { t } = useTranslation();

  return (
    <>
      <p className="font-display text-[19px] leading-tight text-ivory">
        {t(`circular.${id}.title`)}
      </p>
      <p className="mt-1 text-[13px] leading-snug text-brown-300">{t(`circular.${id}.note`)}</p>
    </>
  );
}

const NODE_CLASS = 'min-w-[140px] rounded border border-ivory/18 bg-brown-800 px-5 py-4';
const CONNECTOR_CLASS =
  'flex shrink-0 items-center justify-center self-center text-green-500';

export function CircularEconomy() {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const [isWide, setIsWide] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 640px)');
    const update = () => setIsWide(query.matches);

    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const ConnectorIcon = isWide ? ArrowRight : ArrowDown;
  const listClass = cx(
    'mt-6 flex gap-3',
    isWide ? 'flex-wrap items-stretch' : 'flex-col items-stretch'
  );

  return (
    <div className="mt-16 border-t border-ivory/12 pt-12">
      <p className="text-[13px] uppercase tracking-[0.2em] text-brown-300">{t('circular.label')}</p>

      {/* Server prerender has no viewport, so `whileInView` never fires. */}
      {reduceMotion || typeof window === 'undefined' ? (
        <div className={listClass}>
          {circularEconomy.map((node, index) => (
            <Fragment key={node.id}>
              {index > 0 ? (
                <span aria-hidden="true" className={CONNECTOR_CLASS}>
                  <ConnectorIcon className="h-4 w-4" />
                </span>
              ) : null}
              <div className={NODE_CLASS}>
                <NodeContent id={node.id} />
              </div>
            </Fragment>
          ))}
        </div>
      ) : (
        <motion.div
          className={listClass}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={CONTAINER_VARIANTS}
        >
          {circularEconomy.map((node, index) => (
            <Fragment key={node.id}>
              {index > 0 ? (
                <motion.span
                  aria-hidden="true"
                  className={CONNECTOR_CLASS}
                  variants={ITEM_VARIANTS}
                >
                  <ConnectorIcon className="h-4 w-4" />
                </motion.span>
              ) : null}
              <motion.div className={NODE_CLASS} variants={ITEM_VARIANTS}>
                <NodeContent id={node.id} />
              </motion.div>
            </Fragment>
          ))}
        </motion.div>
      )}
    </div>
  );
}
