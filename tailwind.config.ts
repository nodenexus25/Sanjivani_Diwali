import type { Config } from 'tailwindcss';

/**
 * Brand colours live as CSS custom properties in `src/styles/theme.css` (section 4
 * of the build spec, copied verbatim). Tailwind 3 cannot attach an alpha value to a
 * plain `var()` colour, so each token is exposed as a callable: without a modifier it
 * resolves to the variable, and with one (`border-ivory/16`) it resolves through
 * `color-mix()` so the `/`-opacity syntax keeps working.
 *
 * `AlphaAwareColor` keeps the token assignable to the config's `string` keys while
 * staying callable at build time.
 */
type AlphaAwareColor = string &
  ((options?: { opacityValue?: string; opacityVariable?: string }) => string);

const token = (variable: string): AlphaAwareColor => {
  const value = `var(--${variable})`;
  const resolve = ({ opacityValue }: { opacityValue?: string } = {}) => {
    if (opacityValue === undefined) return value;
    // A bare modifier (`border-ivory/16`) arrives as "0.16"; a colour plugin hands
    // over its opacity variable (`bg-ivory` → `var(--tw-bg-opacity, 1)`), which
    // `calc()` scales back to a percentage.
    const amount = Number.isFinite(Number(opacityValue))
      ? `${Number((Number(opacityValue) * 100).toFixed(3))}%`
      : `calc(${opacityValue} * 100%)`;
    return `color-mix(in srgb, ${value} ${amount}, transparent)`;
  };
  return resolve as AlphaAwareColor;
};

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: 'var(--gutter)', screens: { '2xl': '1280px' } },
    screens: { xs: '360px', sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1440px' },
    extend: {
      colors: {
        brown: {
          950: token('brown-950'), 900: token('brown-900'), 800: token('brown-800'),
          700: token('brown-700'), 500: token('brown-500'), 300: token('brown-300'),
          200: token('brown-200'), DEFAULT: token('brown-900'),
        },
        green: {
          700: token('green-700'), 600: token('green-600'), 500: token('green-500'),
          300: token('green-300'), 100: token('green-100'), DEFAULT: token('green-500'),
        },
        ivory: token('ivory'),
        paper: token('paper'),
        sand: { 200: token('sand-200'), 300: token('sand-300') },
        accent: { light: token('accent-on-light'), dark: token('accent-on-dark') },
        line: { light: token('border-light'), dark: token('border-dark') },
      },
      fontFamily: {
        display: ['Marcellus', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Montserrat', 'Segoe UI', 'system-ui', 'sans-serif'],
        marathi: ['Mukta', 'Noto Sans Devanagari', 'sans-serif'],
        'marathi-display': ['Tiro Devanagari Marathi', 'serif'],
      },
      fontSize: {
        display: ['var(--text-display)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        h2: ['var(--text-h2)', { lineHeight: '1.1' }],
        h3: ['26px', { lineHeight: '1.2' }],
        stat: ['48px', { lineHeight: '1' }],
        'body-lg': ['18px', { lineHeight: '1.7' }],
        body: ['16px', { lineHeight: '1.65' }],
        nav: ['15px', { lineHeight: '1.4' }],
        caption: ['13px', { lineHeight: '1.5' }],
        eyebrow: ['12px', { lineHeight: '1.4', letterSpacing: '0.24em' }],
        'marathi-xl': ['clamp(56px, 8vw, 104px)', { lineHeight: '1.2' }],
      },
      spacing: { gutter: 'var(--gutter)', section: 'var(--section-y)', 18: '72px', 30: '120px' },
      maxWidth: { container: 'var(--container)', prose: '760px' },
      borderRadius: {
        sm: 'var(--radius-sm)', DEFAULT: 'var(--radius-sm)',
        sweep: 'var(--radius-sweep)', arch: 'var(--radius-arch)', pill: 'var(--radius-pill)',
      },
      boxShadow: { header: 'var(--shadow-header)' },
      transitionTimingFunction: { brand: 'cubic-bezier(0.22, 1, 0.36, 1)' },
      transitionDuration: { fast: '250ms', base: '600ms', slow: '700ms' },
      /* Alpha steps the design uses that are not on Tailwind's default scale. */
      opacity: { 3: '0.03', 6: '0.06', 8: '0.08', 12: '0.12', 14: '0.14', 16: '0.16', 18: '0.18', 22: '0.22', 26: '0.26', 35: '0.35', 45: '0.45', 55: '0.55', 65: '0.65', 85: '0.85' },
      keyframes: {
        progress: { from: { width: '0%' }, to: { width: '100%' } },
      },
      animation: { progress: 'progress 7s linear forwards' },
    },
  },
  plugins: [],
};

export default config;
