import type { Profile } from '../types/auth';
import { apiClient } from './client';

export async function getProfileRequest(accessToken?: string): Promise<Profile> {
  const { data } = await apiClient.get<Profile>('/user/profile', {
    headers: accessToken
      ? {
          Authorization: `Bearer ${accessToken}`,
        }
      : undefined,
  });

  return data;
}
