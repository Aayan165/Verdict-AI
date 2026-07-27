import { api } from '../../api/client';
import { endpoints } from '../../api/endpoints';

export async function evaluateResponse(payload) {
  const response = await api.post(endpoints.evaluation.evaluate, payload);
  return response.data;
}

export async function getMyEvaluations() {
  const response = await api.get(endpoints.evaluation.myEvaluations);
  return response.data;
}

export async function getEvaluationById(id) {
  const response = await api.get(endpoints.evaluation.evaluationById(id));
  return response.data;
}

export async function deleteEvaluation(id) {
  const response = await api.delete(endpoints.evaluation.deleteEvaluation(id));
  return response.data;
}

export async function getEvaluationPage(params = {}) {
  const response = await api.get(endpoints.evaluation.evaluations, { params });
  return response.data;
}

export async function exportEvaluations() {
  const response = await api.get(endpoints.evaluation.export, { responseType: 'blob' });
  return response.data;
}

export async function addEvaluationToExperiment(experimentId, payload) {
  const response = await api.post(endpoints.evaluation.addToExperiment(experimentId), payload);
  return response.data;
}

export async function removeEvaluationFromExperiment(experimentId, evaluationId) {
  const response = await api.delete(endpoints.evaluation.removeFromExperiment(experimentId, evaluationId));
  return response.data;
}