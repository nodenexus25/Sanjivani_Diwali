/**
 * Content types for the Sanjivani Group homepage.
 *
 * Conventions
 * - Anything that is a proper noun or a number lives here in the data.
 * - Everything a human reads as prose is referenced by an i18n key and resolved
 *   with `t()` inside the component, so a CMS can replace `home.ts` later.
 */

export type PlaceholderTone = 'dark' | 'light';

/** An image or video slot. `labelKey` describes the intended asset. */
export interface MediaAsset {
  type: 'image' | 'video';
  /** Real asset path once supplied by the client. */
  src?: string;
  /** Optional portrait crop (1080×1920) served below 768px. */
  mobile?: string;
  poster?: string;
  /** i18n key for the shot description shown inside the placeholder. */
  labelKey: string;
}

export interface HeroSlide {
  /** Also the i18n namespace: hero.slides.<id>.* */
  id: string;
  /** When true the slide only renders while the festive layer is on. */
  festiveOnly?: boolean;
  ctaHref: string;
  secondaryHref: string;
  media: MediaAsset;
  /** `object-position` for the full-bleed crop, keeping the subject clear of the copy. */
  objectPosition?: string;
}

export interface Business {
  id: string;
  href: string;
  /** True when `href` leaves the group site (opens in a new tab). */
  external?: boolean;
  media: MediaAsset;
}

export interface Person {
  name: string;
  /** i18n key for the role. */
  roleKey: string;
}

export interface CircularNode {
  id: string;
}

export interface TimelineEntry {
  id: string;
  year: string;
}

export interface NewsItem {
  id: string;
  href: string;
  media: MediaAsset;
}

export interface Pathway {
  id: string;
  href: string;
  tone: 'dark' | 'light';
  external?: boolean;
}

export interface SearchSuggestion {
  id: string;
  href: string;
}
