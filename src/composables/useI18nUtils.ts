import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { setLocale, type Locale } from '@/locales';

export function useI18nUtils() {
  const { locale, t } = useI18n();

  const currentLocale = computed(() => locale.value as Locale);

  const availableLocales: { code: Locale; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' }
  ];

  const changeLocale = (newLocale: Locale): void => {
    setLocale(newLocale);
  };

  const getLocaleName = (localeCode: Locale): string => {
    const localeInfo = availableLocales.find(l => l.code === localeCode);
    return localeInfo?.name || localeCode;
  };

  const getLocaleFlag = (localeCode: Locale): string => {
    const localeInfo = availableLocales.find(l => l.code === localeCode);
    return localeInfo?.flag || '';
  };

  return {
    currentLocale,
    availableLocales,
    changeLocale,
    getLocaleName,
    getLocaleFlag,
    t
  };
}
