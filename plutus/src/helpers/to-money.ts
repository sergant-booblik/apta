import { useUserStore } from '@/store/user';


export function toMoney(amount: number, currency: string): string | undefined {
  if (amount === undefined || currency === undefined) return undefined;
  const userStore = useUserStore();
  const locale = userStore.settings?.locale;
  return amount.toLocaleString(locale, { style: 'currency', currency });
}
