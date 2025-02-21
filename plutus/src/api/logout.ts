export interface LogoutResponse {
  success: boolean,
}

export function createLogoutFunction(apiUrl: string): () => Promise<LogoutResponse> {
  return (): Promise<LogoutResponse> => {
    const url = new URL(`${apiUrl}/auth/logout/`);
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: LogoutResponse) => resp);
  };
}