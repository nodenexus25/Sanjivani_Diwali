import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';
import sitemap from 'vite-plugin-sitemap';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    imagetools(),
    sitemap({
      hostname: 'https://www.sanjivanigroup.in',
      outDir: 'dist',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssr: {
    // CJS-only package: bundling it keeps the SSR output loadable as ESM.
    noExternal: ['react-helmet-async'],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      // The SSR pass externalises react, so chunking only applies to the client build.
      output: isSsrBuild
        ? {}
        : {
            manualChunks: {
              react: ['react', 'react-dom'],
              motion: ['framer-motion'],
              i18n: ['i18next', 'react-i18next'],
            },
          },
    },
  },
}));
