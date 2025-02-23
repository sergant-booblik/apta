export interface FetchTotalSumRequest {
  currency?: string,
}

export interface FetchTotalSumResponse {
  total: number,
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
  }
}