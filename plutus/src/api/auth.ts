import type { Currency } from '@/types/currency';

export interface AuthResponse {
  id: number,
  email: string,
  name: string,
  locale: string,
  currencies: Currency[],
  defaultCurrency: Currency,
  error: { message: string, error: string },
}
export function createAuthFunction(apiUrl: string): () => Promise<AuthResponse> {
  const url = new URL(`${apiUrl}/auth/user`);
  return (): Promise<AuthResponse> => fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => resp.json())
    .then((resp: AuthResponse) => resp);
}
