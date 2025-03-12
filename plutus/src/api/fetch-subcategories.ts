import type { Subcategory } from '@/types/category';

export interface FetchSubcategoriesRequest {
  categoryId: number,
}

export interface FetchSubcategoriesResponse {
  subcategories: Subcategory[],
}

export function createFetchSubcategoriesFunction(apiUrl: string): (request: FetchSubcategoriesRequest) => Promise<FetchSubcategoriesResponse> {
  return (request: FetchSubcategoriesRequest): Promise<FetchSubcategoriesResponse> => {
    const url = new URL(`${apiUrl}/subcategory/`);
    url.searchParams.append('category', request.categoryId.toString());
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchSubcategoriesResponse) => resp);
  }
}