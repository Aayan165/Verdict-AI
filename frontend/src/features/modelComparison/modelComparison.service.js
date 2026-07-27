import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';

export async function getModelComparison() {
  const response = await api.get(endpoints.modelComparison);
  return response.data;
}