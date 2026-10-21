import type {
  Business,
  CircularNode,
  FooterLink,
  HeroSlide,
  MediaAsset,
  NewsItem,
  Pathway,
  Person,
  SearchSuggestion,
  TimelineEntry,
} from './types';
import heroDeepavali from '@/assets/images/hero-deepavali.webp';
import heroGreenEnergy from '@/assets/images/hero-green-energy.webp';
import heroEducation from '@/assets/images/hero-education.webp';
import heroLegacy from '@/assets/images/hero-legacy.webp';
import founderShankarrao from '@/assets/images/founder-shankarrao.webp';
import bizSugar from '@/assets/images/biz-sugar.webp';
import bizEnergy from '@/assets/images/biz-energy.webp';
import bizAgri from '@/assets/images/biz-agri.webp';
import bizPharma from '@/assets/images/biz-pharma.webp';
import bizEducation from '@/assets/images/biz-education.webp';
import bizRural from '@/assets/images/biz-rural.webp';
import bizIt from '@/assets/images/biz-it.webp';
import milestoneCbg from '@/assets/images/milestone-cbg.webp';
import newsCbg from '@/assets/images/news-cbg.webp';
import newsUniversity from '@/assets/images/news-university.webp';
import newsCrushing from '@/assets/images/news-crushing.webp';

/**
 * Every value on the homepage. Components render this data plus the matching
 * i18n strings (`src/locales/*.json`), so swapping this file for a CMS query is
 * the only change needed to make the page editable.
 */

export const siteMeta = {
  /** i18n key for the brand line under the wordmark. */
  brandKey: 'brand.name',
  brandSubKey: 'brand.sub',
} as const;

export const navigation = [
  { id: 'about', href: '#about' },
  { id: 'businesses', href: '#businesses' },
  { id: 'sustainability', href: '#sustainability' },
  { id: 'education', href: '#education' },
  { id: 'news', href: '#news' },
  { id: 'careers', href: '#careers' },
] as const;

/**
 * Hero slides, fed by the four client-supplied photographs (1672×941, 16:9).
 * `objectPosition` keeps the busiest part of each frame inside the visible crop,
 * so the values follow each photo's measured detail centroid (54–62%) rather than
 * the earlier hard right-edge bias, which cropped the subject off on wide screens.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'deepavali',
    festiveOnly: true,
    ctaHref: '#deepavali',
    secondaryHref: '#about',
    objectPosition: '54% center',
    media: {
      type: 'image',
      src: heroDeepavali,
      labelKey: 'hero.slides.deepavali.mediaLabel',
    },
  },
  {
    id: 'greenEnergy',
    ctaHref: '#sustainability',
    secondaryHref: '#about',
    objectPosition: '62% center',
    media: {
      type: 'image',
      src: heroGreenEnergy,
      labelKey: 'hero.slides.greenEnergy.mediaLabel',
    },
  },
  {
    id: 'education',
    ctaHref: '#education',
    secondaryHref: '#about',
    objectPosition: '60% center',
    media: {
      type: 'image',
      src: heroEducation,
      labelKey: 'hero.slides.education.mediaLabel',
    },
  },
  {
    id: 'legacy',
    ctaHref: '#businesses',
    secondaryHref: '#about',
    objectPosition: '56% center',
    media: {
      type: 'image',
      src: heroLegacy,
      labelKey: 'hero.slides.legacy.mediaLabel',
    },
  },
];

export const founder = {
  portraitSrc: founderShankarrao,
  portraitLabelKey: 'founder.portraitLabel',
  leadership: [
    { name: 'Bipindada Kolhe', roleKey: 'leadership.bipindada' },
    { name: 'Nitindada Kolhe', roleKey: 'leadership.nitindada' },
    { name: 'Vivek Kolhe', roleKey: 'leadership.vivek' },
    { name: 'Amit Kolhe', roleKey: 'leadership.amit' },
  ] satisfies Person[],
};

export const businesses: Business[] = [
  {
    id: 'sugar',
    href: '#businesses',
    media: { type: 'image', src: bizSugar, labelKey: 'businesses.sugar.mediaLabel' },
  },
  {
    id: 'energy',
    href: '#sustainability',
    media: { type: 'image', src: bizEnergy, labelKey: 'businesses.energy.mediaLabel' },
  },
  {
    id: 'agri',
    href: '#businesses',
    media: { type: 'image', src: bizAgri, labelKey: 'businesses.agri.mediaLabel' },
  },
  {
    id: 'pharma',
    href: '#businesses',
    media: { type: 'image', src: bizPharma, labelKey: 'businesses.pharma.mediaLabel' },
  },
  {
    id: 'education',
    href: '#education',
    media: { type: 'image', src: bizEducation, labelKey: 'businesses.education.mediaLabel' },
  },
  {
    id: 'rural',
    href: '#businesses',
    media: { type: 'image', src: bizRural, labelKey: 'businesses.rural.mediaLabel' },
  },
  {
    id: 'it',
    href: 'https://www.sanjivaniedge.com',
    external: true,
    media: { type: 'image', src: bizIt, labelKey: 'businesses.it.mediaLabel' },
  },
];

/** Feature block beside the circular-economy diagram. */
export const milestone: MediaAsset = {
  type: 'image',
  src: milestoneCbg,
  labelKey: 'milestone.mediaLabel',
};

export const circularEconomy: CircularNode[] = [
  { id: 'cane' },
  { id: 'sugar' },
  { id: 'molasses' },
  { id: 'ethanol' },
  { id: 'biogas' },
  { id: 'potash' },
];

export const timeline: TimelineEntry[] = [
  { id: 'y1960', year: '1960' },
  { id: 'y1982', year: '1982' },
  { id: 'y1983', year: '1983' },
  { id: 'university', year: '2024' },
  { id: 'y2025', year: '2025' },
];

export const newsroom: NewsItem[] = [
  {
    id: 'cbg',
    href: '#news',
    media: { type: 'image', src: newsCbg, labelKey: 'news.cbg.mediaLabel' },
  },
  {
    id: 'university',
    href: '#news',
    media: { type: 'image', src: newsUniversity, labelKey: 'news.university.mediaLabel' },
  },
  {
    id: 'crushing',
    href: '#news',
    media: { type: 'image', src: newsCrushing, labelKey: 'news.crushing.mediaLabel' },
  },
];

export const pathways: Pathway[] = [
  { id: 'careers', href: '#careers', tone: 'dark' },
  { id: 'partner', href: '#contact', tone: 'light' },
  { id: 'admissions', href: '#contact', tone: 'light', external: true },
];

export const footerBusinessLinks: FooterLink[] = businesses.map((business) => ({
  id: business.id,
  href: business.href,
  external: business.external,
}));

export const footerCompanyLinks: FooterLink[] = [
  { id: 'about', href: '#about' },
  { id: 'leadership', href: '#about' },
  { id: 'sustainability', href: '#sustainability' },
  { id: 'news', href: '#news' },
  { id: 'careers', href: '#careers' },
  { id: 'edge', href: 'https://www.sanjivaniedge.com', external: true },
];

export const searchSuggestions: SearchSuggestion[] = [
  { id: 'cbg', href: '#sustainability' },
  { id: 'university', href: '#education' },
  { id: 'sugar', href: '#businesses' },
  { id: 'careers', href: '#careers' },
];

/** Social profiles are still to be supplied by the client. */
export const socialLinks: { id: string; href: string }[] = [];

export const newsletterFallback = async (email: string): Promise<void> => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 600);
  });
  if (!email) throw new Error('missing email');
};
