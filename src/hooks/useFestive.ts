import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';

/**
 * True while the festive layer should render: explicitly enabled and before the
 * configured end date.
 */
export function useFestive(): boolean {
  const { enabled, endsAt } = siteConfig.festive;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!enabled) return;
    const endsAtMs = new Date(endsAt).getTime();
    if (now >= endsAtMs) return;
    const timeout = window.setTimeout(
      () => setNow(Date.now()),
      Math.min(endsAtMs - now, 2_147_483_647)
    );
    return () => window.clearTimeout(timeout);
  }, [enabled, endsAt, now]);

  return enabled && now < new Date(endsAt).getTime();
}
