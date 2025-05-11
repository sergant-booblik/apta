import type { Currency } from '@/types/currency';

export interface FetchCurrenciesResponse {
  currencies: Currency[],
}

export function createFetchCurrenciesFunction(
  apiUrl: string,
): () => Promise<FetchCurrenciesResponse> {
  return (): Promise<FetchCurrenciesResponse> => {
    const url = new URL(`${apiUrl}/currency`);
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchCurrenciesResponse) => resp);
  };
}
