import type { Profile } from '@/types/profile';

export interface FetchUserResponse {
  profile: Profile,
}

export function createFetchUserFunction(apiUrl: string): () => Promise<FetchUserResponse> {
  const url = new URL(`${apiUrl}/users/profile/my/`);
  return (): Promise<FetchUserResponse> => fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => resp.json())
    .then((resp: FetchUserResponse) => resp);
}