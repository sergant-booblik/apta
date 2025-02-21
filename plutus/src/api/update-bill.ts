import type { Bill } from '@/types/bill'

export interface UpdateBillRequest {
  bill: Partial<Bill>,
}

export interface UpdateBillResponse {
  bill: Bill,
}

export function createUpdateBillFunction(apiUrl: string): (request: UpdateBillRequest) => Promise<UpdateBillResponse> {
  return (request: UpdateBillRequest): Promise<UpdateBillResponse> => {
  const url = new URL(`${apiUrl}/bill/${request.bill.id}/`);
    return fetch(url.toString(), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.bill)
    }).then((resp) => resp.json())
      .then((resp: UpdateBillResponse) => resp)
  }
}