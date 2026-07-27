import { getAnalytics } from '../analytics/analytics.service';
import { getExperiments } from '../experiments/experiments.service';
import { getModelComparison } from '../modelComparison/modelComparison.service';
import { getMyEvaluations } from '../evaluations/evaluation.service';

export async function getDashboardSnapshot() {
  const [analyticsResult, experimentsResult, modelComparisonResult, evaluationsResult] = await Promise.allSettled([
    getAnalytics(),
    getExperiments(),
    getModelComparison(),
    getMyEvaluations(),
  ]);

  return {
    analytics: analyticsResult.status === 'fulfilled' ? analyticsResult.value : null,
    experiments: experimentsResult.status === 'fulfilled' ? experimentsResult.value : [],
    modelComparison: modelComparisonResult.status === 'fulfilled' ? modelComparisonResult.value : [],
    evaluations: evaluationsResult.status === 'fulfilled' ? evaluationsResult.value : [],
  };
}