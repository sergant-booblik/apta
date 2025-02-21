import type { Bill } from '@/types/bill';

export interface UploadBillIconRequest {
  id: string | undefined,
  files: FileList | null | undefined,
}

export interface UploadBillIconResponse {
  bill: Bill,
}

export function createUploadBillIconFunction(apiUrl: string): (
  request: UploadBillIconRequest,
) => Promise<UploadBillIconResponse> {
  return (request: UploadBillIconRequest): Promise<UploadBillIconResponse> => {
    const url = new URL(`${apiUrl}/bill/${request.id}/icon`);
    const formData = new FormData();
    if (request.files) {
      const file = request.files[0] as File;
      formData.append('icon', file);
    }
    return fetch(url.toString(),{
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then((resp) => resp.json())
      .then((resp: UploadBillIconResponse) => resp);
  };
}
