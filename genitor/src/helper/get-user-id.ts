import { verify } from 'jsonwebtoken';

export async function getUserId(accessToken: string): Promise<number | undefined> {
  const payload: any = verify(accessToken, 'access_token');

  return payload.id;
}