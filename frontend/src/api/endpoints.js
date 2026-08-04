export const endpoints = {
  auth: {
    login: '/login',
    register: '/register',
  },
  evaluation: {
    evaluate: '/evaluate',
    myEvaluations: '/my-evaluations',
    evaluationById: (id) => `/my-evaluations/${id}`,
    evaluations: '/evaluations',
    deleteEvaluation: (id) => `/evaluations/${id}`,
    export: '/export/evaluations',
    addToExperiment: (experimentId, evaluationId) => `/experiments/${experimentId}/evaluations/${evaluationId}`,
    removeFromExperiment: (experimentId, evaluationId) => `/experiments/${experimentId}/evaluations/${evaluationId}`,
  },
  analytics: '/analytics',
  modelComparison: '/model-comparison',
  experiments: '/experiments',
  profile: '/profile',
  experimentById: (id) => `/experiments/${id}`,
  experimentEvaluations: (id) => `/experiments/${id}/evaluations`,
  experimentExport: (id) => `/experiments/${id}/export`,
  experimentEvaluationDelete: (experimentId, evaluationId) => `/experiments/${experimentId}/evaluations/${evaluationId}`,
};