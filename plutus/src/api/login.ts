import type { ErrorData } from '@/types/error';

export interface LoginRequest {
  email: string,
  password: string,
}

export interface LoginResponse {
  id: number,
  email: string,
  name: string,
  errors: { email: ErrorData[], password: ErrorData[] },
}

export function createLoginFunction(
  apiUrl: string,
): (request: LoginRequest) => Promise<LoginResponse> {
  const url = new URL(`${apiUrl}/auth/login`);
  return async (request: LoginRequest): Promise<LoginResponse> => {
    const resp = await fetch(url.toString(), {
      method: 'POST',
      body: JSON.stringify(request),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw { error: data.errors };
    }

    return data;
  };
}
