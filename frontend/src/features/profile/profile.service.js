import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';

export async function getProfile() {
  const response = await api.get(endpoints.profile);
  return response.data;
}