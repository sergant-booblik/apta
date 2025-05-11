export interface FetchTotalSumRequest {
  currency?: string,
  isShowClosed?: boolean,
}

export interface FetchTotalSumResponse {
  total: {
    amount: number,
    currencyCode: string,
  },
}

export function createFetchTotalSumFunction(apiUrl: string): (request: FetchTotalSumRequest) => Promise<FetchTotalSumResponse> {
  return (request: FetchTotalSumRequest): Promise<FetchTotalSumResponse> => {
    const url = new URL(`${apiUrl}/bill/total`);
    if (request.currency) url.searchParams.append('currency', request.currency);
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchTotalSumResponse) => resp);
  };
}