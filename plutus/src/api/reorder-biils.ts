export interface ReorderBillsRequest {
  id: number,
  order: number,
}

export interface ReorderBillsResponse {
  id: number,
  order: number,
}

export function createReorderBillsFunction(apiUrl: string): (request: ReorderBillsRequest) => Promise<ReorderBillsResponse> {
  return (request: ReorderBillsRequest): Promise<ReorderBillsResponse> => {
    const url = new URL(`${apiUrl}/bill/reorder/`);
    return fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }).then((resp) => resp.json())
      .then((resp: ReorderBillsResponse) => resp)
  }
}