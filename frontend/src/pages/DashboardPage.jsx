import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ClipboardList, Layers3, WandSparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Cell,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import Button from '../components/Button';
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Skeleton, { SkeletonText } from '../components/Skeleton';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import Badge, { verdictVariant } from '../components/Badge';
import { getDashboardSnapshot } from '../features/dashboard/dashboard.service';
import { formatDateTime, formatNumber, formatScore } from '../utils/formatters';

const verdictColors = ['#4E220F', '#7F5A35', '#B07A40', '#4F6A38', '#355C7D'];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [snapshot, setSnapshot] = useState({ analytics: null, experiments: [], modelComparison: [], evaluations: [] });

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const data = await getDashboardSnapshot();
        if (active) {
          setSnapshot(data);
        }
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

  const bestModel = useMemo(() => [...(snapshot.modelComparison || [])].sort((left, right) => right.overall_score - left.overall_score)[0], [snapshot.modelComparison]);

  const averageScoreData = useMemo(() => {
    const analytics = snapshot.analytics;

    return analytics
      ? [
          { name: 'Accuracy', value: analytics.average_accuracy_score },
          { name: 'Logic', value: analytics.average_logic_score },
          { name: 'Completeness', value: analytics.average_completeness_score },
          { name: 'Overall', value: analytics.average_overall_score },
        ]
      : [];
  }, [snapshot.analytics]);

  const verdictPieData = useMemo(() => {
    const distribution = snapshot.analytics?.verdict_distribution || {};
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [snapshot.analytics]);

  const recentEvaluations = useMemo(() => [...(snapshot.evaluations || [])].sort((left, right) => new Date(right.created_at) - new Date(left.created_at)).slice(0, 5), [snapshot.evaluations]);

  const trendData = useMemo(() => {
    return [...(snapshot.evaluations || [])]
      .sort((left, right) => new Date(left.created_at) - new Date(right.created_at))
      .slice(-10)
      .map((item) => ({
        date: formatDateTime(item.created_at),
        score: item.overall_score,
      }));
  }, [snapshot.evaluations]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-4">
        {loading ? (
          <>
            <Card><Skeleton className="h-24" /></Card>
            <Card><Skeleton className="h-24" /></Card>
            <Card><Skeleton className="h-24" /></Card>
            <Card><Skeleton className="h-24" /></Card>
          </>
        ) : (
          <>
            <StatCard title="Total Evaluations" value={formatNumber(snapshot.analytics?.total_evaluations)} description="All saved evaluations for the current user" icon={ClipboardList} />
            <StatCard title="Average Overall Score" value={formatScore(snapshot.analytics?.average_overall_score)} description="Mean score returned by the adjudicator" icon={Zap} tone="success" />
            <StatCard title="Experiments" value={formatNumber(snapshot.experiments.length)} description="Tracked experiment groups" icon={Layers3} tone="info" />
            <StatCard title="Best Performing Model" value={bestModel?.model_name || 'None yet'} description={bestModel ? `Overall ${formatScore(bestModel.overall_score)}` : 'Run evaluations to see the top model'} icon={WandSparkles} tone="primary" />
          </>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <ChartCard title="Average Scores" description="Average performance for each critic and overall score.">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : averageScoreData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averageScoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(78,34,15,0.08)" />
                <XAxis dataKey="name" stroke="#7A6A57" />
                <YAxis stroke="#7A6A57" domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#4E220F" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No analytics yet" description="Run an evaluation to populate the dashboard charts." action={<Button onClick={() => navigate('/evaluate')}>Evaluate response <ArrowRight className="h-4 w-4" /></Button>} />
          )}
        </ChartCard>

        <ChartCard title="Verdict Distribution" description="How the adjudicator is classifying responses.">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : verdictPieData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={verdictPieData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {verdictPieData.map((entry, index) => (
                    <Cell key={entry.name} fill={verdictColors[index % verdictColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No verdicts yet" description="Once evaluations are saved, verdict breakdown will appear here." />
          )}
        </ChartCard>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card
          title="Recent Evaluations"
          description="Latest saved evaluations with the current overall score and verdict."
          action={<Button variant="secondary" size="sm" onClick={() => navigate('/evaluations')}>View all</Button>}
        >
          {loading ? (
            <SkeletonText lines={5} />
          ) : recentEvaluations.length ? (
            <Table>
              <thead className="bg-[rgba(176,186,153,0.18)] text-xs uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="px-4 py-3">Prompt</th>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">Overall</th>
                  <th className="px-4 py-3">Verdict</th>
                  <th className="px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentEvaluations.map((evaluation) => (
                  <tr key={evaluation.id} className="border-t border-border/70">
                    <td className="max-w-[280px] px-4 py-4"><p className="line-clamp-2 text-sm font-medium text-ink">{evaluation.prompt}</p></td>
                    <td className="px-4 py-4 text-sm text-muted">{evaluation.model_name}</td>
                    <td className="px-4 py-4 font-semibold text-ink">{formatScore(evaluation.overall_score)}</td>
                    <td className="px-4 py-4"><Badge variant={verdictVariant(evaluation.verdict)}>{evaluation.verdict}</Badge></td>
                    <td className="px-4 py-4 text-sm text-muted">{formatDateTime(evaluation.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <EmptyState
              title="No evaluations saved"
              description="Use the Evaluate page to submit a prompt and response for scoring."
              action={<Button onClick={() => navigate('/evaluate')}>Evaluate response <ArrowRight className="h-4 w-4" /></Button>}
            />
          )}
        </Card>

        <Card title="Quick Actions" description="Jump into the most common workflows.">
          <div className="grid gap-4">
            <Button className="w-full justify-between" size="lg" onClick={() => navigate('/evaluate')}>
              Evaluate Response
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" className="w-full justify-between" size="lg" onClick={() => navigate('/experiments')}>
              Create Experiment
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-[rgba(176,186,153,0.18)] p-5">
            <p className="text-sm font-semibold text-ink">Execution flow</p>
            <ol className="mt-3 space-y-3 text-sm text-muted">
              <li>1. Submit a prompt, response, and model name.</li>
              <li>2. The backend runs accuracy, logic, and completeness critics.</li>
              <li>3. The adjudicator returns scores, verdict, and summary.</li>
            </ol>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-white/75 p-5">
            <p className="text-sm font-semibold text-ink">Average score trend</p>
            <div className="mt-4 h-56">
              {loading ? (
                <Skeleton className="h-full w-full" />
              ) : trendData.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(78,34,15,0.08)" />
                    <XAxis dataKey="date" hide />
                    <YAxis stroke="#7A6A57" domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#4E220F" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
                  Trend appears after multiple evaluations.
                </div>
              )}
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}