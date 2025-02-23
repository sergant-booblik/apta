import type { Bill } from '@/types/bill';

export interface FetchBillRequest {
  isShowClosed?: boolean,
}

export interface FetchBillsResponse {
  bills: Bill[],
  rates: Record<string, number>,
  transfersSum: number,
  totals: Record<string, number>,
}

export function createFetchBillsFunction(apiUrl: string): (request: FetchBillRequest) => Promise<FetchBillsResponse> {
  return (request: FetchBillRequest): Promise<FetchBillsResponse> => {
    const url = new URL(`${apiUrl}/bill`);
    if (request.isShowClosed) url.searchParams.append('closed', request.isShowClosed.toString())
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
