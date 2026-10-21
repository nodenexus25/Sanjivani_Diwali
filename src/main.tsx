import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { MotionConfig } from 'framer-motion';

// Self-hosted fonts (font-display: swap is set by fontsource).
import '@fontsource/marcellus/400.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/mukta/400.css';
import '@fontsource/mukta/500.css';
import '@fontsource/mukta/600.css';
import '@fontsource/tiro-devanagari-marathi/400.css';

import './styles/theme.css';
import './index.css';
import './i18n';

import App from './App';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
        <Suspense fallback={null}>
          <App />
        </Suspense>
      </MotionConfig>
    </HelmetProvider>
  </StrictMode>
);
