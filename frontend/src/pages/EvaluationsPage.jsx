import { useEffect, useMemo, useState } from 'react';
import { Eye, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge, { verdictVariant } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import Select from '../components/Select';
import Input from '../components/Input';
import Table from '../components/Table';
import { deleteEvaluation, getMyEvaluations, exportEvaluations } from '../features/evaluations/evaluation.service';
import { extractApiError } from '../api/client';
import { formatDateTime, formatScore } from '../utils/formatters';
import Skeleton from '../components/Skeleton';

import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { experimentAttachSchema } from '../utils/schemas';
import { addEvaluationToExperiment } from '../features/evaluations/evaluation.service';
import { getExperiments } from '../features/experiments/experiments.service';
import { downloadBlob } from '../services/download';

export default function EvaluationsPage() {
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState([]);
  const [modelFilter, setModelFilter] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [viewing, setViewing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [experiments, setExperiments] = useState([]);
  const [loadingExperiments, setLoadingExperiments] = useState(true);
  const [attachOpen, setAttachOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [attaching, setAttaching] = useState(false);
  const [exporting, setExporting] = useState(false);

  const attachForm = useForm({
    resolver: zodResolver(experimentAttachSchema),
    defaultValues: {
      experimentId: '',
    },
  });

  useEffect(() => {
    let active = true;

    async function loadExperiments() {
      try {
        const data = await getExperiments();

        if (active) {
          setExperiments(Array.isArray(data) ? data : []);
        }
      } catch {
        if (active) {
          setExperiments([]);
        }
      } finally {
        if (active) {
          setLoadingExperiments(false);
        }
      }
    }

    loadExperiments();

    return () => {
      active = false;
    };
  }, []);

  const onAttachSubmit = async (values) => {
    if (!selectedEvaluation) return;

    setAttaching(true);

    try {
      await addEvaluationToExperiment(
        Number(values.experimentId),
        selectedEvaluation
      );

      toast.success('Evaluation added to experiment');

      attachForm.reset();
      setAttachOpen(false);
      setSelectedEvaluation(null);
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setAttaching(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const data = await getMyEvaluations();
        if (active) {
          setEvaluations(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        toast.error(extractApiError(error));
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const verdictOptions = useMemo(() => [...new Set(evaluations.map((item) => item.verdict).filter(Boolean))], [evaluations]);

  const filtered = useMemo(() => {
    return evaluations
      .filter((item) => (modelFilter ? item.model_name.toLowerCase().includes(modelFilter.toLowerCase()) : true))
      .filter((item) => (verdictFilter ? item.verdict === verdictFilter : true))
      .sort((left, right) => {
        if (sortBy === 'overall_score') {
          return right.overall_score - left.overall_score;
        }
        return new Date(right.created_at) - new Date(left.created_at);
      });
  }, [evaluations, modelFilter, verdictFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const hasNext = page < totalPages;

  useEffect(() => {
    setPage(1);
  }, [modelFilter, verdictFilter, sortBy]);

  const onDelete = async (id) => {
    setDeletingId(id);

    try {
      await deleteEvaluation(id);
      setEvaluations((items) => items.filter((item) => item.id !== id));
      toast.success('Evaluation deleted');
      setViewing((current) => (current?.id === id ? null : current));
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setDeletingId(null);
    }
  };

  const onExport = async () => {
    setExporting(true);

    try {
      const blob = await exportEvaluations();

      downloadBlob(blob, 'evaluations.csv');

      toast.success('CSV exported successfully');
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <Button
          onClick={onExport}
          disabled={exporting || loading || evaluations.length === 0}
        >
          {exporting ? (
            <Loader label="Exporting" />
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export CSV
            </>
          )}
        </Button>
      </div>
      <Card title="Filters and sorting" description="Filter by model or verdict and sort by date or overall score.">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.8fr_0.8fr]">
          <Input label="Model filter" placeholder="Search by model name" value={modelFilter} onChange={(event) => setModelFilter(event.target.value)} />
          <Select label="Verdict" value={verdictFilter} onChange={(event) => setVerdictFilter(event.target.value)}>
            <option value="">All verdicts</option>
            {verdictOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </Select>
          <Select label="Sort by" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="created_at">Date</option>
            <option value="overall_score">Overall score</option>
          </Select>
        </div>
      </Card>

      <Card title="Saved evaluations" description="Prompt, model, score, verdict, and timestamp for each adjudicated response.">
        {loading ? (
          <Skeleton className="h-72 w-full" />
        ) : currentRows.length ? (
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
              {currentRows.map((evaluation) => (
                <tr key={evaluation.id} className="border-t border-border/70">
                  <td className="max-w-[260px] px-4 py-4"><p className="line-clamp-2 text-sm font-medium text-ink">{evaluation.prompt}</p></td>
                  <td className="px-4 py-4 text-sm text-muted">{evaluation.model_name}</td>
                  <td className="px-4 py-4 font-semibold text-ink">{formatScore(evaluation.overall_score)}</td>
                  <td className="px-4 py-4"><Badge variant={verdictVariant(evaluation.verdict)}>{evaluation.verdict}</Badge></td>
                  <td className="px-4 py-4 text-sm text-muted">{formatDateTime(evaluation.created_at)}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setViewing(evaluation)}>
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => onDelete(evaluation.id)} disabled={deletingId === evaluation.id}>
                        {deletingId === evaluation.id ? <Loader label="Deleting" /> : <><Trash2 className="h-4 w-4" /> Delete</>}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedEvaluation(evaluation);
                          setAttachOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        Add to Experiment
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <EmptyState title="No evaluations found" description="Try changing your filters or create a new evaluation." />
        )}
      </Card>

      {!loading && filtered.length ? (
        <Pagination page={page} hasNext={hasNext} onPrev={() => setPage((current) => Math.max(1, current - 1))} onNext={() => setPage((current) => Math.min(totalPages, current + 1))} pageSize={pageSize} totalLabel={`of ${totalPages}`} />
      ) : null}

      <Modal open={Boolean(viewing)} title="Evaluation details" description="Inspect the full result payload and model response." onClose={() => setViewing(null)} footer={<Button variant="secondary" onClick={() => setViewing(null)}>Close</Button>}>
        {viewing ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Accuracy', viewing.accuracy_score],
                ['Logic', viewing.logic_score],
                ['Completeness', viewing.completeness_score],
                ['Overall', viewing.overall_score],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border bg-[rgba(176,186,153,0.16)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-ink">{formatScore(value)}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Verdict</p>
              <div className="mt-2"><Badge variant={verdictVariant(viewing.verdict)}>{viewing.verdict}</Badge></div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white/80 p-4">
                <p className="text-sm font-semibold text-ink">Prompt</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">{viewing.prompt}</p>
              </div>
              <div className="rounded-2xl border border-border bg-white/80 p-4">
                <p className="text-sm font-semibold text-ink">Response</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">{viewing.response}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Summary</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">{viewing.summary}</p>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={attachOpen}
        title="Add Evaluation to Experiment"
        description="Choose an experiment to attach this evaluation."
        onClose={() => {
          setAttachOpen(false);
          setSelectedEvaluation(null);
        }}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setAttachOpen(false);
                setSelectedEvaluation(null);
              }}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              form="attach-experiment-form"
              disabled={attaching}
            >
              {attaching ? (
                <Loader label="Attaching" />
              ) : (
                'Add to Experiment'
              )}
            </Button>
          </>
        }
      >
        <form
          id="attach-experiment-form"
          className="space-y-4"
          onSubmit={attachForm.handleSubmit(onAttachSubmit)}
        >
          <Select
            label="Experiment"
            {...attachForm.register('experimentId')}
            error={attachForm.formState.errors.experimentId?.message}
          >
            <option value="">Select experiment</option>

            {experiments.map((experiment) => (
              <option key={experiment.id} value={experiment.id}>
                {experiment.name}
              </option>
            ))}
          </Select>

          <div className="rounded-2xl border border-border bg-[rgba(176,186,153,0.16)] p-4 text-sm text-muted">
            This evaluation will be attached to the selected experiment.
          </div>
        </form>
      </Modal>
    </div>
  );
}