import type { Transaction } from '@/types/bill';

export interface FetchBillTransactionsRequest {
  id: string,
  count?: number,
}

export interface FetchBillTransactionsResponse {
  transactions: Transaction[],
}

export function createFetchBillTransactionFunction(apiUrl: string): (request: FetchBillTransactionsRequest) => Promise<FetchBillTransactionsResponse> {
  return (request: FetchBillTransactionsRequest): Promise<FetchBillTransactionsResponse> => {
    const url = new URL(`${apiUrl}/bill/${request.id}/transactions`);
    if (request.count) url.searchParams.append('count', request.count.toString());
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchBillTransactionsResponse) => resp);
  };
}