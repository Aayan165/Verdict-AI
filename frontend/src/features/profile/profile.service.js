import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';

export async function getProfile() {
  const response = await api.get(endpoints.profile);
  return response.data;
}

export async function updateProfile(payload) {
  const response = await api.put(endpoints.profile, payload);
  return response.data;
}