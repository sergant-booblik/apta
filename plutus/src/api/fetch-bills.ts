import type { Bill } from '@/types/bill';

export interface FetchBillsResponse {
  bills: Bill[],
  rates: Record<string, number>,
  transfersSum: number,
  totals: Record<string, number>,
}

export function createFetchBillsFunction(apiUrl: string): () => Promise<FetchBillsResponse> {
  return (): Promise<FetchBillsResponse> => {
    const url = new URL(`${apiUrl}/bill`);
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchBillsResponse) => resp);
  };
}
