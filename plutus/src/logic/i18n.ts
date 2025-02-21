import { createI18n } from 'vue-i18n';
import en from '../../resources/i18n/en.json';
import { useProfileStore } from '@/store/profile';

export type Locale = 'en';

export const LOCALE_STORAGE_KEY = 'locale';

export function calculateCurrentLocale(): Locale {
  const profileStore = useProfileStore();

  const profileLocale = profileStore.profile?.locale  as Locale;
  if (profileLocale) {
    return profileLocale;
  }

  const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
  if (storedLocale) {
    return storedLocale;
  }

  const browserLocale = navigator.language.slice(0, 2) || navigator.languages?.[ 0 ].slice(0, 2) || 'en';

  localStorage.setItem(LOCALE_STORAGE_KEY, browserLocale);
  return browserLocale as Locale;

}

export function setLocale(locale: string): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  i18n.global.locale.value = calculateCurrentLocale();
}

export const pluralizationRule = (choice: number, choicesLength: number) => {
  if (choicesLength === 1) return 0;

  const lastDigit = choice % 10;
  const lastTwoDigits = choice % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 0;
  } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
    return 1;
  } else {
    return 2;
  }
};

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'ru',
  messages: { en },
  pluralRules: {
    ru: pluralizationRule,
  },
});

export default i18n;