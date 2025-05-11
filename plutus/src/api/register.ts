import type { ErrorData } from '@/types/error';

export interface RegisterRequest {
  email: string,
  password: string,
  name: string,
  locale: string,
}

export interface RegisterResponse {
  id: number,
  email: string,
  name: string,
  errors: { email: ErrorData[], password: ErrorData[], name: ErrorData[] },
}

export function createRegisterFunction(
  apiUrl: string,
): (request: RegisterRequest) => Promise<RegisterResponse> {
  const url = new URL(`${apiUrl}/auth/register`);
  return async (request: RegisterRequest): Promise<RegisterResponse> => {
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
