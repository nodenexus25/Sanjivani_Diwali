import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import mr from './locales/mr.json';

export const SUPPORTED_LANGUAGES = ['en', 'mr'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = 'sanjivani.lang';

/** The prerender pass runs this module in Node, where there is no DOM. */
const hasWindow = typeof window !== 'undefined';
const hasDocument = typeof document !== 'undefined';

function readStoredLanguage(): SupportedLanguage | null {
  if (!hasWindow) return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
      return stored as SupportedLanguage;
    }
  } catch {
    // localStorage can be unavailable (private mode, blocked cookies).
  }
  return null;
}

function readLanguageFromUrl(): SupportedLanguage | null {
  if (!hasWindow) return null;
  try {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (param && (SUPPORTED_LANGUAGES as readonly string[]).includes(param)) {
      return param as SupportedLanguage;
    }
  } catch {
    // Ignore malformed URLs.
  }
  return null;
}

function persistLanguage(language: string): void {
  if (!hasWindow) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // Ignore write failures.
  }
}

function applyDocumentLanguage(language: string): void {
  if (!hasDocument) return;
  document.documentElement.lang = language;
}

const initialLanguage = readLanguageFromUrl() ?? readStoredLanguage() ?? 'en';

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    mr: { translation: mr },
  },
  lng: initialLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
});

applyDocumentLanguage(initialLanguage);

i18n.on('languageChanged', (language) => {
  persistLanguage(language);
  applyDocumentLanguage(language);
});

export default i18n;
