import type { Bill } from '@/types/bill';

export interface AddBillRequest {
  id: number,
  bill: Bill,
}

export interface AddBillResponse {
  bill: Bill,
}

export function createAddBillFunction(apiUrl: string): (
  request: AddBillRequest,
) => Promise<AddBillResponse> {
  return (request: AddBillRequest): Promise<AddBillResponse> => {
    const url = new URL(`${apiUrl}/${request.id}/bill`);
    return fetch(url.toString(),{
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request.bill),
    }).then((resp) => resp.json())
      .then((resp: AddBillResponse) => resp);
  };
}
