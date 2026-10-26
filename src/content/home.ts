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
import heroGreenEnergy from '@/assets/images/hero-green-energy.webp';
import heroEducation from '@/assets/images/hero-education.webp';
import heroLegacy from '@/assets/images/hero-legacy.webp';
import founderShankarrao from '@/assets/images/founder-shankarrao.webp';
import bizSugar from '@/assets/images/biz-sugar.webp';
import bizSpirits from '@/assets/images/biz-spirits.webp';
import bizDairy from '@/assets/images/biz-dairy.webp';
import bizEnergy from '@/assets/images/biz-energy.webp';
import bizAgri from '@/assets/images/biz-agri.webp';
import bizPharma from '@/assets/images/biz-pharma.webp';
import bizEducation from '@/assets/images/biz-education.webp';
import bizRural from '@/assets/images/biz-rural.webp';
import bizFisheries from '@/assets/images/biz-fisheries.webp';
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
 * Hero slides, fed by the client-supplied photographs (1672×941, 16:9).
 * `objectPosition` keeps the busiest part of each frame inside the visible crop,
 * so the values follow each photo's measured detail centroid (54–62%) rather than
 * the earlier hard right-edge bias, which cropped the subject off on wide screens.
 */
export const heroSlides: HeroSlide[] = [
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
    href: 'https://www.amrutsugar.in/',
    external: true,
    media: { type: 'image', src: bizSugar, labelKey: 'businesses.sugar.mediaLabel' },
    details: [
      {
        id: 'allied',
        items: [{ id: 'jaggery' }],
      },
    ],
  },
  {
    id: 'spirits',
    href: 'https://www.sanjivanispirits.com/',
    external: true,
    media: { type: 'image', src: bizSpirits, labelKey: 'businesses.spirits.mediaLabel' },
    details: [
      {
        id: 'operations',
        items: [{ id: 'distillery' }, { id: 'portfolio' }],
      },
    ],
  },
  {
    id: 'dairy',
    href: '#businesses',
    media: { type: 'image', src: bizDairy, labelKey: 'businesses.dairy.mediaLabel' },
    details: [
      {
        id: 'operations',
        items: [{ id: 'plant' }, { id: 'products' }, { id: 'members' }],
      },
    ],
  },
  {
    id: 'energy',
    href: '#sustainability',
    media: { type: 'image', src: bizEnergy, labelKey: 'businesses.energy.mediaLabel' },
    details: [
      {
        id: 'operations',
        items: [
          {
            id: 'ethanol',
            href: 'https://chemicals-website-psi.vercel.app/products/ethanol',
            external: true,
          },
          {
            id: 'cogen',
            href: 'https://chemicals-website-psi.vercel.app/plants/co-generation-division',
            external: true,
          },
          { id: 'biogas' },
        ],
      },
    ],
  },
  {
    id: 'agri',
    href: '#businesses',
    media: { type: 'image', src: bizAgri, labelKey: 'businesses.agri.mediaLabel' },
    details: [
      {
        id: 'products',
        items: [{ id: 'compost' }, { id: 'potash' }, { id: 'soil' }],
      },
    ],
  },
  {
    id: 'fisheries',
    href: 'https://sanjivani-fish.vercel.app/',
    external: true,
    media: { type: 'image', src: bizFisheries, labelKey: 'businesses.fisheries.mediaLabel' },
    details: [
      {
        id: 'services',
        items: [{ id: 'hatchery' }, { id: 'biofloc' }, { id: 'feed' }, { id: 'community' }],
      },
    ],
  },
  {
    id: 'pharma',
    href: 'https://www.sanjivanipharma.com/',
    external: true,
    media: { type: 'image', src: bizPharma, labelKey: 'businesses.pharma.mediaLabel' },
    details: [
      {
        id: 'portfolio',
        items: [
          {
            id: 'sanitizer',
            href: 'https://www.sanjivanipharma.com/',
            external: true,
          },
          {
            id: 'paracetamol',
            href: 'https://www.sanjivanipharma.com/',
            external: true,
          },
          {
            id: 'institutional',
            href: 'https://www.sanjivanipharma.com/',
            external: true,
          },
        ],
      },
    ],
  },
  {
    id: 'education',
    href: '#education',
    media: { type: 'image', src: bizEducation, labelKey: 'businesses.education.mediaLabel' },
    details: [
      {
        id: 'featuredSchools',
        items: [
          {
            id: 'sisKharghar',
            href: 'https://www.sanjivaniis.com/index.php',
            external: true,
          },
          { id: 'englishMedium' },
        ],
      },
      {
        id: 'schoolNetwork',
        divider: true,
        items: [
          {
            id: 'sisShirdi',
            href: 'https://sanjivaniinternational.org.in/',
            external: true,
          },
          {
            id: 'academyKopargaon',
            href: 'https://sanjivaniacademy.org.in/',
            external: true,
          },
          {
            id: 'academyVaijapur',
            href: 'https://www.sanjivaniacademy.com/',
            external: true,
          },
        ],
      },
    ],
  },
  {
    id: 'rural',
    href: '#businesses',
    media: { type: 'image', src: bizRural, labelKey: 'businesses.rural.mediaLabel' },
    details: [
      {
        id: 'initiatives',
        items: [{ id: 'credit' }, { id: 'shg' }, { id: 'community' }],
      },
    ],
  },
  {
    id: 'it',
    href: 'https://www.sanjivaniedge.com',
    external: true,
    media: { type: 'image', src: bizIt, labelKey: 'businesses.it.mediaLabel' },
    details: [
      {
        id: 'services',
        items: [{ id: 'erp' }, { id: 'cloud' }, { id: 'engineering' }],
      },
    ],
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
  { id: 'fisheries', year: '1996' },
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
