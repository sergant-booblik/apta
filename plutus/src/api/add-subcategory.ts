import type { Subcategory } from '@/types/category';

export interface AddSubcategoryRequest {
  subcategory: Partial<Subcategory>,
}

export interface AddSubcategoryResponse {
  subcategory: Subcategory,
}

export function createAddSubcategoryFunction(apiUrl: string): (request: AddSubcategoryRequest) => Promise<AddSubcategoryResponse> {
  return (request: AddSubcategoryRequest): Promise<AddSubcategoryResponse> => {
    const url = new URL(`${apiUrl}/subcategory/`);
    return fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.subcategory)
    }).then((resp) => resp.json())
      .then((resp: AddSubcategoryResponse) => resp)
  }
}