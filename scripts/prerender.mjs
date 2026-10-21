/**
 * Static prerender step.
 *
 * Runs after `vite build` (client) and `vite build --ssr` (server bundle):
 * renders the app to static markup in Node and inlines it into `dist/index.html`
 * so crawlers and link-preview bots see the real content without running JS.
 *
 * Intentionally dependency-free — no headless browser, so it stays fast and
 * deterministic in CI.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distIndex = path.join(root, 'dist', 'index.html');
const ssrEntry = path.join(root, 'dist-ssr', 'entry-server.js');

for (const file of [distIndex, ssrEntry]) {
  if (!existsSync(file)) {
    throw new Error(`[prerender] missing ${file} — run the client and SSR builds first.`);
  }
}

const { renderApp } = await import(pathToFileURL(ssrEntry).href);

const markup = renderApp();
if (!markup.trim()) {
  throw new Error('[prerender] the app rendered to an empty string.');
}

const template = await readFile(distIndex, 'utf8');
const rootPattern = /<div id="root">\s*<\/div>/;

if (!rootPattern.test(template)) {
  throw new Error('[prerender] could not find an empty <div id="root"></div> in dist/index.html.');
}

/**
 * The hero's first background image is the LCP element, but the browser cannot
 * discover it until the bundle runs. The rendered markup is scanned for that
 * image and a matching preload is written into <head> so the fetch starts with
 * the document instead of after hydration.
 */
const heroImage = markup.match(/<section id="top"[\s\S]*?<img[^>]+src="([^"]+)"/);
const preload = heroImage
  ? `<link rel="preload" as="image" href="${heroImage[1]}" fetchpriority="high" />`
  : null;

const html = template.replace(rootPattern, `<div id="root">${markup}</div>`);
await writeFile(distIndex, preload ? html.replace('</head>', `  ${preload}\n  </head>`) : html, 'utf8');

console.log(`[prerender] inlined ${(markup.length / 1024).toFixed(1)} kB of markup into dist/index.html`);
