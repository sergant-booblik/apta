import { useProfileStore } from '@/store/profile';

export function toMoney(amount: number | undefined, currency: string | undefined): string {
  if (amount === undefined || currency === undefined) return '';
  const profileStore = useProfileStore();
  const locale = profileStore.profile?.locale;
  return amount.toLocaleString(locale, { style: 'currency', currency });
}
