import { verify } from 'jsonwebtoken'

export async function getUserId(accessToken: string) {
  const payload: any = verify(accessToken, 'access_token');

  return payload.id;
}