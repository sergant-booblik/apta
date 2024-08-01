export interface LoginRequest {
  email: string,
  password: string,
}

export interface LoginResponse {
  id: number,
  email: string,
  name: string,
  error: string,
}

export function createLoginFunction(
  apiUrl: string,
): (request: LoginRequest) => Promise<LoginResponse> {
  const url = new URL(`${apiUrl}/auth/login`);
  return (request: LoginRequest): Promise<LoginResponse> => fetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(request),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((resp) => resp.json())
    .then((resp: LoginResponse) => resp);
}
