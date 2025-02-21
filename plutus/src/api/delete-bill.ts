export interface DeleteBillRequest {
  id: string,
}

export interface DeleteBillResponse {

}

export function createDeleteBillFunction(apiUrl: string): (request: DeleteBillRequest) => Promise<DeleteBillResponse> {
  return (request: DeleteBillRequest): Promise<DeleteBillResponse> => {
    const url = new URL(`${apiUrl}/bill/${request.id}`);
    return fetch(url.toString(),{
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}