import type { Profile } from '@/types/profile';

export interface UpdateProfileRequest {
  profile: Profile,
}

export interface UpdateProfileResponse {
  profile: Profile,
}

export function createUpdateProfileFunction(apiUrl: string): (request: UpdateProfileRequest) => Promise<UpdateProfileResponse> {
  const url = new URL(`${apiUrl}/users/profile/my/`);
  return (request: UpdateProfileRequest): Promise<UpdateProfileResponse> => fetch(url.toString(), {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request.profile),
  }).then((resp) => resp.json())
    .then((resp: UpdateProfileResponse) => resp);
}