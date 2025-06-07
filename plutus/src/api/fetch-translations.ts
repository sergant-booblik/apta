import type { Translations } from '@/types/locale';

export interface FetchTranslationsRequest {
  lang: string,
}

export type FetchTranslationsResponse = Translations;

export function createFetchTranslationsFunction(
  apiUrl: string,
): (request: FetchTranslationsRequest) => Promise<FetchTranslationsResponse> {
  return (request: FetchTranslationsRequest): Promise<FetchTranslationsResponse> => {
    const url = new URL(`${apiUrl}/translations/${request.lang}`);
    return fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())
      .then((resp: FetchTranslationsResponse) => resp);
  };
}
