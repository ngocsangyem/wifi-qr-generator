import { createI18n } from 'vue-i18n';
import en from './en.json';
import vi from './vi.json';

export type MessageSchema = typeof en;

export type Locale = 'en' | 'vi';

const STORAGE_KEY = 'language-preference';

// Get browser locale
const getBrowserLocale = (): Locale => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('vi')) {
    return 'vi';
  }
  return 'en';
};

// Get stored locale or fallback to browser/default
const getInitialLocale = (): Locale => {
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && ['en', 'vi'].includes(stored)) {
    return stored;
  }
  return getBrowserLocale();
};

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages: {
    en,
    vi
  },
  missingWarn: false,
  fallbackWarn: false
});

// Helper function to change locale and persist
export const setLocale = (locale: Locale): void => {
  // In Vue I18n v9+ with Composition API, locale is a WritableComputedRef
  // We can directly assign to it since it has a setter
  i18n.global.locale.value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
  document.documentElement.lang = locale;
};

// Initialize document language
document.documentElement.lang = getInitialLocale();
