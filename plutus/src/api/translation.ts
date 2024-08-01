export interface FetchTranslationRequest {
  lang: string,
}

export type FetchTranslationResponse = Record<string, string>;

export function createFetchTranslationFunction(
  apiUrl: string
): (request: FetchTranslationRequest) => Promise<FetchTranslationResponse> {
  return (request: FetchTranslationRequest): Promise<FetchTranslationResponse> => {
    const url = new URL(`${apiUrl}/translation/${request.lang}`);
    return fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchTranslationResponse) => resp);
  };
}
