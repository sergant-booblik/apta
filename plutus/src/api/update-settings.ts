import type { Settings } from '@/types/settings';
import type {AuthResponse} from "@/api/auth";

export interface UpdateSettingsRequest {
  id: number,
  settings: Settings
}

export type UpdateSettingsResponse = AuthResponse;

export function createUpdateSettingsFunction(
  apiUrl: string,
): (request: UpdateSettingsRequest) => Promise<UpdateSettingsResponse> {
  return (request: UpdateSettingsRequest): Promise<UpdateSettingsResponse> => {
    const settings = request.settings;
    const url = new URL(`${apiUrl}/users/${request.id}`);
    return fetch(url.toString(), {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    }).then((resp) => resp.json())
      .then((resp: UpdateSettingsResponse) => resp);
  };
}
