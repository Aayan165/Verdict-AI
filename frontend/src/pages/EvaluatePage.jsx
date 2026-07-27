import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import Badge, { verdictVariant } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import { evaluateSchema, experimentAttachSchema } from '../utils/schemas';
import { extractApiError } from '../api/client';
import { addEvaluationToExperiment, evaluateResponse } from '../features/evaluations/evaluation.service';
import { getExperiments } from '../features/experiments/experiments.service';
import { formatScore } from '../utils/formatters';

const defaultResult = null;

export default function EvaluatePage() {
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(defaultResult);
  const [experiments, setExperiments] = useState([]);
  const [loadingExperiments, setLoadingExperiments] = useState(true);
  const [attachOpen, setAttachOpen] = useState(false);
  const [attaching, setAttaching] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(evaluateSchema),
    defaultValues: { prompt: '', response: '', modelName: '' },
  });

  const attachForm = useForm({
    resolver: zodResolver(experimentAttachSchema),
    defaultValues: { experimentId: '' },
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

  const onSubmit = async (values) => {
    setEvaluating(true);

    try {
      const response = await evaluateResponse(values);
      setResult(response?.result || response);
      toast.success('Evaluation completed');
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setEvaluating(false);
    }
  };

  const evaluationPayload = useMemo(() => {
    if (!result) {
      return null;
    }

    const currentValues = getValues();

    return {
      prompt: currentValues.prompt,
      response: currentValues.response,
      model_name: currentValues.modelName,
      accuracy_score: result.accuracy_score,
      logic_score: result.logic_score,
      completeness_score: result.completeness_score,
      overall_score: result.overall_score,
      verdict: result.verdict,
      summary: result.summary,
    };
  }, [result, getValues]);

  const onAttachSubmit = async (values) => {
    if (!result) {
      return;
    }

    setAttaching(true);

    try {
      await addEvaluationToExperiment(Number(values.experimentId), evaluationPayload);
      toast.success('Evaluation added to experiment');
      setAttachOpen(false);
      attachForm.reset();
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setAttaching(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
      <Card title="Evaluate a response" description="Submit a prompt, the model output, and the model name for scoring.">
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <Textarea label="Prompt" rows={8} placeholder="Enter the original prompt supplied to the model" {...register('prompt')} error={errors.prompt?.message} />
          <Textarea label="Response" rows={12} placeholder="Paste the model response to be evaluated" {...register('response')} error={errors.response?.message} />
          <Input label="Model name" placeholder="e.g. GPT-4.1, Claude Sonnet, Gemini 2.5" {...register('modelName')} error={errors.modelName?.message} />

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={evaluating}>
              {evaluating ? <Loader label="Evaluating" /> : 'Evaluate'}
              {!evaluating ? <ArrowRight className="h-4 w-4" /> : null}
            </Button>
            <Button variant="secondary" size="lg" type="button" onClick={() => reset()}>
              Clear form
            </Button>
          </div>
        </form>
      </Card>

      <div className="space-y-6">
        <Card title="Saved experiments" description="Attach the current evaluation result to an experiment after scoring.">
          {loadingExperiments ? (
            <Loader label="Loading experiments" />
          ) : experiments.length ? (
            <div className="space-y-3">
              {experiments.slice(0, 4).map((experiment) => (
                <div key={experiment.id} className="rounded-xl border border-border bg-white/70 p-4">
                  <p className="font-semibold text-ink">{experiment.name}</p>
                  <p className="mt-1 text-sm text-muted">{experiment.description || 'No description provided'}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No experiments yet" description="Create an experiment first to organize evaluation outputs." />
          )}
        </Card>

        {result ? (
          <Card
            title="Evaluation result"
            description="Scores, verdict, and narrative summary returned by the adjudicator."
            action={<Badge variant={verdictVariant(result.verdict)}>{result.verdict}</Badge>}
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Accuracy', result.accuracy_score],
                ['Logic', result.logic_score],
                ['Completeness', result.completeness_score],
                ['Overall', result.overall_score],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-border bg-[rgba(176,186,153,0.16)] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">{label}</p>
                  <p className="mt-2 text-3xl font-semibold text-ink">{formatScore(value)}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-border bg-white/80 p-4">
              <p className="text-sm font-semibold text-ink">Summary</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">{result.summary}</p>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {[
                ['Strengths', result.strengths],
                ['Weaknesses', result.weaknesses],
                ['Improvements', result.improvements],
              ].map(([label, items]) => (
                <div key={label} className="rounded-2xl border border-border bg-white/75 p-4">
                  <p className="text-sm font-semibold text-ink">{label}</p>
                  {Array.isArray(items) && items.length ? (
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                      {items.map((item) => (
                        <li key={item} className="rounded-xl bg-[rgba(247,241,222,0.85)] px-3 py-2">{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-muted">No entries returned.</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="secondary" size="lg" onClick={() => setAttachOpen(true)}>
                <Plus className="h-4 w-4" />
                Add to Experiment
              </Button>
            </div>
          </Card>
        ) : (
          <EmptyState title="No result yet" description="Run an evaluation to see the adjudicator output and attach it to an experiment." />
        )}
      </div>

      <Modal
        open={attachOpen}
        title="Add result to experiment"
        description="Choose an existing experiment and attach the most recent evaluation payload."
        onClose={() => setAttachOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAttachOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="attach-experiment-form" disabled={attaching}>
              {attaching ? <Loader label="Attaching" /> : 'Add to Experiment'}
            </Button>
          </>
        }
      >
        <form id="attach-experiment-form" className="space-y-4" onSubmit={attachForm.handleSubmit(onAttachSubmit)}>
          <Select label="Experiment" {...attachForm.register('experimentId')} error={attachForm.formState.errors.experimentId?.message}>
            <option value="">Select experiment</option>
            {experiments.map((experiment) => (
              <option key={experiment.id} value={experiment.id}>
                {experiment.name}
              </option>
            ))}
          </Select>

          <div className="rounded-2xl border border-border bg-[rgba(176,186,153,0.16)] p-4 text-sm text-muted">
            The current prompt, response, model name, scores, verdict, and summary will be submitted to the experiment endpoint.
          </div>
        </form>
      </Modal>
    </div>
  );
}