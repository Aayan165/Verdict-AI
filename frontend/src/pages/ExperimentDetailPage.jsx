import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge, { verdictVariant } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { downloadBlob } from '../services/download';
import { extractApiError } from '../api/client';
import { deleteExperiment, exportExperimentCsv, getExperiment, getExperimentEvaluations, removeEvaluationFromExperiment } from '../features/experiments/experiments.service';
import { formatDateTime, formatNumber, formatScore } from '../utils/formatters';

export default function ExperimentDetailPage() {
  const { id } = useParams();
  const experimentId = Number(id);
  const [loading, setLoading] = useState(true);
  const [experiment, setExperiment] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [workingId, setWorkingId] = useState(null);

  const loadData = async () => {
    setLoading(true);

    try {
      const [experimentData, evaluationData] = await Promise.all([getExperiment(experimentId), getExperimentEvaluations(experimentId)]);
      setExperiment(experimentData);
      setEvaluations(Array.isArray(evaluationData) ? evaluationData : []);
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [experimentId]);

  const metrics = useMemo(() => {
    return [
      ['Evaluations', formatNumber(evaluations.length)],
      ['Created', formatDateTime(experiment?.created_at)],
      ['Description', experiment?.description || 'No description provided'],
    ];
  }, [evaluations.length, experiment]);

  const onExport = async () => {
    setWorkingId('export');

    try {
      const blob = await exportExperimentCsv(experimentId);
      downloadBlob(blob, `experiment_${experimentId}.csv`);
      toast.success('Experiment CSV exported');
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setWorkingId(null);
    }
  };

  const onRemove = async (evaluationId) => {
    setWorkingId(evaluationId);

    try {
      await removeEvaluationFromExperiment(experimentId, evaluationId);
      setEvaluations((items) => items.filter((item) => item.id !== evaluationId));
      toast.success('Evaluation removed from experiment');
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setWorkingId(null);
    }
  };

  const onDeleteExperiment = async () => {
    setWorkingId('delete');

    try {
      await deleteExperiment(experimentId);
      toast.success('Experiment deleted');
      window.location.assign('/experiments');
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setWorkingId(null);
    }
  };

  if (loading) {
    return <Card><Loader label="Loading experiment" /></Card>;
  }

  if (!experiment) {
    return <EmptyState title="Experiment not found" description="The experiment may have been removed or you may not have access to it." />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Card title={experiment.name} description={experiment.description || 'No description provided'}>
          <div className="grid gap-3 sm:grid-cols-3">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-[rgba(176,186,153,0.16)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Experiment actions" description="Export or remove the entire experiment.">
          <div className="space-y-3">
            <Button className="w-full justify-between" onClick={onExport} disabled={workingId === 'export'}>
              {workingId === 'export' ? <Loader label="Exporting" /> : <><Download className="h-4 w-4" /> Export CSV</>}
            </Button>
            <Button variant="danger" className="w-full justify-between" onClick={onDeleteExperiment} disabled={workingId === 'delete'}>
              {workingId === 'delete' ? <Loader label="Deleting" /> : <><Trash2 className="h-4 w-4" /> Delete experiment</>}
            </Button>
          </div>
        </Card>
      </div>

      <Card title="Evaluations in experiment" description="All evaluations attached to this experiment.">
        {evaluations.length ? (
          <Table>
            <thead className="bg-[rgba(176,186,153,0.18)] text-xs uppercase tracking-[0.18em] text-muted">
              <tr>
                <th className="px-4 py-3">Prompt</th>
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Overall Score</th>
                <th className="px-4 py-3">Verdict</th>
                <th className="px-4 py-3">Created At</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((evaluation) => (
                <tr key={evaluation.id} className="border-t border-border/70">
                  <td className="max-w-[260px] px-4 py-4"><p className="line-clamp-2 text-sm font-medium text-ink">{evaluation.prompt}</p></td>
                  <td className="px-4 py-4 text-sm text-muted">{evaluation.model_name}</td>
                  <td className="px-4 py-4 font-semibold text-ink">{formatScore(evaluation.overall_score)}</td>
                  <td className="px-4 py-4"><Badge variant={verdictVariant(evaluation.verdict)}>{evaluation.verdict}</Badge></td>
                  <td className="px-4 py-4 text-sm text-muted">{formatDateTime(evaluation.created_at)}</td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="danger" size="sm" onClick={() => onRemove(evaluation.id)} disabled={workingId === evaluation.id}>
                      {workingId === evaluation.id ? <Loader label="Removing" /> : 'Remove Evaluation'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState title="No evaluations attached" description="Add results to this experiment from the Evaluate page." />
        )}
      </Card>
    </div>
  );
}