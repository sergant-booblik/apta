import type { Unit } from '@/types/unit';

export interface FetchUnitsResponse {
  units: Unit[],
}

export function createFetchUnitsFunction(apiUrl: string): () => Promise<FetchUnitsResponse> {
  return (): Promise<FetchUnitsResponse> => {
    const url = new URL(`${apiUrl}/unit/`);
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchUnitsResponse) => resp);
  };
}