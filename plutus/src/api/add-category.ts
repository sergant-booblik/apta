import type { Category } from '@/types/category';

export interface AddCategoryRequest {
  category: Partial<Category>,
}

export interface AddCategoryResponse {
  category: Category,
}

export function createAddCategoryFunction(apiUrl: string): (request: AddCategoryRequest) => Promise<AddCategoryResponse> {
  return (request: AddCategoryRequest): Promise<AddCategoryResponse> => {
    const url = new URL(`${apiUrl}/category/`);
    return fetch(url.toString(), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.category)
    }).then((resp) => resp.json())
      .then((resp: AddCategoryResponse) => resp)
  }
}