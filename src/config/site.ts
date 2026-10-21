/**
 * Site-wide switches.
 *
 * The festive (Deepavali) layer is data driven: flip `enabled` to false, or let
 * `endsAt` pass, and the festive strip, the Deepavali hero slide and the
 * Deepavali band disappear without touching any component.
 */
export const siteConfig = {
  festive: {
    enabled: true,
    name: 'Deepavali 2026',
    endsAt: '2026-11-15T23:59:59+05:30',
  },
  siteUrl: 'https://www.sanjivanigroup.in',
  ogDefault: '/og-default.jpg',
  ogFestive: '/og-festive.jpg',
} as const;
