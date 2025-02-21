import type { Currency } from '@/types/currency';

export interface VerifyTokenResponse {
  success: boolean,
}

export interface RefreshTokenResponse {
  success: boolean,
}

export function createVerifyTokenFunction(apiUrl: string): () => Promise<VerifyTokenResponse> {
  const url = new URL(`${apiUrl}/auth/verify/`);
  return (): Promise<VerifyTokenResponse> => fetch(url.toString(), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => resp.json())
    .then((resp: VerifyTokenResponse) => resp);
}

export function createRefreshTokenFunction(apiUrl: string): () => Promise<RefreshTokenResponse> {
  const url = new URL(`${apiUrl}/auth/refresh/`);
  return (): Promise<RefreshTokenResponse> => fetch(url.toString(), {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => resp.json())
    .then((resp: VerifyTokenResponse) => resp);
}
