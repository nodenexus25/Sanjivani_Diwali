import { renderToStaticMarkup } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';
import './i18n';
import App from './App';

/**
 * Server-only entry used by `scripts/prerender.mjs`.
 *
 * The markup produced here is *not* hydrated — `main.tsx` mounts with
 * `createRoot().render()`, which replaces the prerendered tree on the client.
 * The point is simply that crawlers and link-preview bots that do not execute
 * JavaScript still receive the full page copy.
 */
export function renderApp(): string {
  return renderToStaticMarkup(
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </HelmetProvider>
  );
}
