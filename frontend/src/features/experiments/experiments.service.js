import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';

export async function getExperiments() {
  const response = await api.get(endpoints.experiments);
  return response.data;
}

export async function getExperiment(id) {
  const response = await api.get(endpoints.experimentById(id));
  return response.data;
}

export async function createExperiment(payload) {
  const response = await api.post(endpoints.experiments, payload);
  return response.data;
}

export async function deleteExperiment(id) {
  const response = await api.delete(endpoints.experimentById(id));
  return response.data;
}

export async function getExperimentEvaluations(id) {
  const response = await api.get(endpoints.experimentEvaluations(id));
  return response.data;
}

export async function exportExperimentCsv(id) {
  const response = await api.get(endpoints.experimentExport(id), { responseType: 'blob' });
  return response.data;
}

export async function addEvaluationToExperiment(id, payload) {
  const response = await api.post(endpoints.experimentEvaluations(id), payload);
  return response.data;
}

export async function removeEvaluationFromExperiment(id, evaluationId) {
  const response = await api.delete(endpoints.experimentEvaluationDelete(id, evaluationId));
  return response.data;
}