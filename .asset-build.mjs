/**
 * One-off asset pipeline: takes the raw files harvested from the seven live
 * Sanjivani entity sites (`.asset-staging/`) and writes optimised WebP into
 * `src/assets/images/`, which is the directory the build spec mandates.
 *
 * Not part of the app build — run manually with `node .asset-build.mjs`.
 */
import sharp from 'sharp';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'A:/Group-Landing/.asset-staging';
const OUT = 'A:/Group-Landing/src/assets/images';

/** [source file, output name, max width, quality, crop?] — `crop` is either an
 * extract region `{left, top, width, height}` or a "W:H" ratio to cover-crop. */
const PLAN = [
  // hero — large, shown full-bleed
  ['school-turf-night.jpg', 'hero-deepavali.webp', 1600, 78],
  ['agri-home-3.png', 'hero-green-energy.webp', 1600, 78],
  ['school-campus-aerial.jpg', 'hero-education.webp', 1600, 78],
  ['hero-legacy-tree-updated.png', 'hero-legacy.webp', 1600, 78],
  ['hero-mobile-tree-tall.png', 'hero-mobile.webp', 860, 80],

  // people
  ['people-shankarrao.png', 'founder-shankarrao.webp', 1000, 80],

  // business cards — displayed around 400px wide
  ['amrut-sugar.jpg', 'biz-sugar.webp', 800, 76],
  ['amrut-banner-2.png', 'biz-energy.webp', 800, 76],
  ['agri-command-1.png', 'biz-agri.webp', 800, 76],
  ['pharma-home.png', 'biz-pharma.webp', 800, 76],
  ['education-collage.jpeg', 'biz-education.webp', 800, 78, '16:10'],
  ['chem-prod-1.png', 'biz-chemical.webp', 800, 78, '16:10'],
  ['biz-distillers-source.png', 'biz-distillers.webp', 800, 78, '16:10'],
  // The supplied bank art sits on a framed, rounded plate; cut just inside it.
  [
    'biz-banking-source.png',
    'biz-banking.webp',
    800,
    78,
    { left: 26, top: 24, width: 1522, height: 951 },
  ],
  ['amrut-banner-3.png', 'biz-rural.webp', 800, 76],

  // feature block
  ['agri-home-2.png', 'milestone-cbg.webp', 1200, 76],

  // newsroom thumbnails — cover-cropped to the 16:10 card ratio so every card
  // ships the exact same 800×500 frame.
  ['water-conservation (2).jpeg', 'news-water-conservation.webp', 800, 80, '16:10'],
  ['ek-rakhi.jpeg', 'news-rakhi-rath.webp', 800, 80, '16:10'],
  ['hospital-on-wheels.jpeg', 'news-hospital-on-wheels.webp', 800, 80, '16:10'],

  // brand
  // The client's group logo is a centred lockup: emblem above, wordmark and
  // tagline below, all on a solid white plate. The header needs the emblem on
  // its own and the footer wants the lockup tight-cropped, so both are cut from
  // the same source (measured bounds: emblem 357,73 314x339; lockup 102,73 813x550).
  [
    'brand-group-logo.png',
    'brand-group-emblem.webp',
    160,
    90,
    { left: 353, top: 69, width: 322, height: 347 },
  ],
  [
    'brand-group-logo.png',
    'brand-group-logo.webp',
    480,
    88,
    { left: 90, top: 62, width: 836, height: 572 },
  ],
];

async function luminance(file) {
  const { data, info } = await sharp(file)
    .resize(64, 64, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let sum = 0;
  let opaque = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 40) continue;
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    opaque++;
  }
  return opaque ? Math.round(sum / opaque) : null;
}

await mkdir(OUT, { recursive: true });

for (const [file, name, width, quality, crop] of PLAN) {
  const from = path.join(SRC, file);
  const to = path.join(OUT, name);
  const meta = await sharp(from).metadata();
  const sourceWidth = crop?.width ?? meta.width ?? width;
  const target = Math.min(width, sourceWidth);

  let pipeline = sharp(from);
  if (crop && typeof crop !== 'string') pipeline = pipeline.extract(crop);

  const resize =
    typeof crop === 'string'
      ? (() => {
          const [rw, rh] = crop.split(':').map(Number);
          return {
            width: target,
            height: Math.round((target * rh) / rw),
            fit: 'cover',
            position: 'centre',
          };
        })()
      : { width: target, withoutEnlargement: true };

  await pipeline.resize(resize).webp({ quality, effort: 5 }).toFile(to);

  const before = (await stat(from)).size;
  const after = (await stat(to)).size;
  const out = await sharp(to).metadata();
  console.log(
    `${name.padEnd(26)} ${String(sourceWidth).padStart(5)}px -> ${String(out.width).padStart(5)}px  ` +
      `${(before / 1024).toFixed(0).padStart(5)}kB -> ${(after / 1024).toFixed(0).padStart(4)}kB  ` +
      `lum=${await luminance(from)}`
  );
}
