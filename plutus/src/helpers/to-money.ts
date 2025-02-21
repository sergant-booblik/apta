import { useProfileStore } from '@/store/profile';


export function toMoney(amount: number | undefined, currency: string | undefined): string | undefined {
  if (amount === undefined || currency === undefined) return undefined;
  const profileStore = useProfileStore();
  const locale = profileStore.profile?.locale;
  return amount.toLocaleString(locale, { style: 'currency', currency });
}
