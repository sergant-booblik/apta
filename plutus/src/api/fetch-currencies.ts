import type { Currency } from '@/types/currency';

export interface FetchCurrenciesRequest {
  isPinnedCurrencies: boolean,
}

export interface FetchCurrenciesResponse {
  currencies: Currency[],
}

export function createFetchCurrenciesFunction(
  apiUrl: string
): (request: FetchCurrenciesRequest) => Promise<FetchCurrenciesResponse> {
  return (request: FetchCurrenciesRequest): Promise<FetchCurrenciesResponse> => {
    const url = new URL(`${apiUrl}/currency`);
    if(request.isPinnedCurrencies ) url.searchParams.append('pinned', '');
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
