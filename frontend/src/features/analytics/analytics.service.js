import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';

export async function getAnalytics() {
  const response = await api.get(endpoints.analytics);
  return response.data;
}