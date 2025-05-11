import type { Category, CategoryType } from '@/types/category';

export interface FetchCategoriesRequest {
  type: CategoryType,
}

export interface FetchCategoriesResponse {
  categories: Category[],
}

export function createFetchCategoriesFunction(apiUrl: string): (request: FetchCategoriesRequest) => Promise<FetchCategoriesResponse> {
  return (request: FetchCategoriesRequest): Promise<FetchCategoriesResponse> => {
    const url = new URL(`${apiUrl}/category/`);
    url.searchParams.append('type', request.type.toString());
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchCategoriesResponse) => resp);
  };
}