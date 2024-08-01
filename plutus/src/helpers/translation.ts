import { useTranslationStore } from '@/store/translation';

export default function inter(
  name: string,
): string {
  const translationStore = useTranslationStore();
  const translations = translationStore.translations ?? {};
  return translations[name] ?? `!${name}!`;
}
