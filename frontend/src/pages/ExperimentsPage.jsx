import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Download, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import { createExperiment, deleteExperiment, exportExperimentCsv, getExperiments } from '../features/experiments/experiments.service';
import { getMyEvaluations } from '../features/evaluations/evaluation.service';
import { experimentSchema } from '../utils/schemas';
import { extractApiError } from '../api/client';
import { downloadBlob } from '../services/download';
import { formatDateTime, formatNumber } from '../utils/formatters';

export default function ExperimentsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [experiments, setExperiments] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [exportingId, setExportingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experimentSchema),
    defaultValues: { name: '', description: '' },
  });

  const loadData = async () => {
    setLoading(true);

    try {
      const experimentData = await getExperiments();
      setExperiments(Array.isArray(experimentData) ? experimentData : []);
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onCreate = async (values) => {
    try {
      await createExperiment(values);
      toast.success('Experiment created');
      setCreateOpen(false);
      reset();
      loadData();
    } catch (error) {
      toast.error(extractApiError(error));
    }
  };

  const onDelete = async (id) => {
    setDeletingId(id);

    try {
      await deleteExperiment(id);
      toast.success('Experiment deleted');
      await loadData();
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setDeletingId(null);
    }
  };

  const onExport = async (id) => {
    setExportingId(id);

    try {
      const blob = await exportExperimentCsv(id);
      downloadBlob(blob, `experiment_${id}.csv`);
      toast.success('CSV exported');
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Experiment
        </Button>
      </div>

      {loading ? (
        <Card><Loader label="Loading experiments" /></Card>
      ) : experiments.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {experiments.map((experiment) => (
            <Card key={experiment.id} title={experiment.name} description={experiment.description || 'No description provided'}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-border bg-[rgba(176,186,153,0.14)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Created</p>
                    <p className="mt-2 text-sm font-semibold text-ink">{formatDateTime(experiment.created_at)}</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-[rgba(176,186,153,0.14)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Evaluations</p>
                    <p className="mt-2 text-3xl font-semibold text-ink">{formatNumber(experiment.evaluation_count)}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" as={Link} to={`/experiments/${experiment.id}`}>
                    Open
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => onExport(experiment.id)} disabled={exportingId === experiment.id}>
                    {exportingId === experiment.id ? <Loader label="Exporting" /> : <><Download className="h-4 w-4" /> Export CSV</>}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => onDelete(experiment.id)} disabled={deletingId === experiment.id}>
                    {deletingId === experiment.id ? <Loader label="Deleting" /> : <><Trash2 className="h-4 w-4" /> Delete</>}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No experiments yet"
          description="Create an experiment to group related evaluation runs and export a CSV when you are ready."
          action={<Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4" /> Create Experiment</Button>}
        />
      )}

      <Modal
        open={createOpen}
        title="Create experiment"
        description="Name the experiment and optionally add context for future reviews."
        onClose={() => setCreateOpen(false)}
        footer={<Button type="submit" form="create-experiment-form">Create</Button>}
      >
        <form id="create-experiment-form" className="space-y-5" onSubmit={handleSubmit(onCreate)}>
          <Input label="Experiment name" placeholder="Benchmark run v1" {...register('name')} error={errors.name?.message} />
          <Textarea label="Description" rows={5} placeholder="Describe the goal of this experiment" {...register('description')} error={errors.description?.message} />
        </form>
      </Modal>
    </div>
  );
}