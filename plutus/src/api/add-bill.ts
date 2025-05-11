import type { Bill } from '@/types/bill';

export interface AddBillRequest {
  userId: number,
  title: string,
  subtitle: string,
  amount: number,
  currencyId: number,
}

export interface AddBillResponse {
  bill: Bill,
}

export function createAddBillFunction(apiUrl: string): (
  request: AddBillRequest,
) => Promise<AddBillResponse> {
  return (request: AddBillRequest): Promise<AddBillResponse> => {
    const url = new URL(`${apiUrl}/${request.userId}/bill`);
    return fetch(url.toString(),{
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }).then((resp) => resp.json())
      .then((resp: AddBillResponse) => resp);
  };
}
