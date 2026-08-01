import { useEffect, useMemo, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Cell,
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
import Card from '../components/Card';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Skeleton from '../components/Skeleton';
import StatCard from '../components/StatCard';
import { getAnalytics } from '../features/analytics/analytics.service';
import { getMyEvaluations } from '../features/evaluations/evaluation.service';
import { formatNumber, formatScore } from '../utils/formatters';

const pieColors = ['#4E220F', '#7A6A57', '#B07A40', '#4F6A38', '#355C7D'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const [summary, records] = await Promise.all([getAnalytics(), getMyEvaluations()]);
        if (active) {
          setAnalytics(summary);
          setEvaluations(Array.isArray(records) ? records : []);
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

  const scoreCards = useMemo(() => {
    if (!analytics) {
      return [];
    }

    return [
      { title: 'Total Evaluations', value: formatNumber(analytics.total_evaluations) },
      { title: 'Average Accuracy', value: formatScore(analytics.average_accuracy_score) },
      { title: 'Average Logic', value: formatScore(analytics.average_logic_score) },
      { title: 'Average Completeness', value: formatScore(analytics.average_completeness_score) },
      { title: 'Average Overall', value: formatScore(analytics.average_overall_score) },
    ];
  }, [analytics]);

  const verdictData = useMemo(() => {
    const entries = analytics?.verdict_distribution || {};
    return Object.entries(entries).map(([name, value]) => ({ name, value }));
  }, [analytics]);

  const averageData = useMemo(() => {
    if (!analytics) {
      return [];
    }

    return [
      { name: 'Accuracy', value: analytics.average_accuracy_score },
      { name: 'Logic', value: analytics.average_logic_score },
      { name: 'Completeness', value: analytics.average_completeness_score },
      { name: 'Overall', value: analytics.average_overall_score },
    ];
  }, [analytics]);

  const timelineData = useMemo(() => {
    return [...evaluations]
      .sort((left, right) => new Date(left.created_at) - new Date(right.created_at))
      .slice(-12)
      .map((item) => ({
        date: new Date(item.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        score: item.overall_score,
      }));
  }, [evaluations]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {loading ? (
          <Card><Skeleton className="h-24" /></Card>
        ) : scoreCards.length ? (
          scoreCards.map((card) => <StatCard key={card.title} title={card.title} value={card.value} icon={card.title === 'Total Evaluations' ? BarChart3 : TrendingUp} />)
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ChartCard title="Average Scores" description="Compare critic averages against the overall score.">
          {loading ? (
            <Loader label="Loading analytics" />
          ) : averageData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={averageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(78,34,15,0.08)" />
                <XAxis dataKey="name" stroke="#7A6A57" />
                <YAxis stroke="#7A6A57" domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#4E220F" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No analytics data" description="Run evaluations to populate the analytics dashboard." />
          )}
        </ChartCard>

        <ChartCard title="Verdict Mix" description="Distribution of verdict labels returned by the adjudicator.">
          {loading ? (
            <Loader label="Loading analytics" />
          ) : verdictData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={verdictData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                  {verdictData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No verdicts yet" description="Verdict distribution will show up after the first evaluation is stored." />
          )}
        </ChartCard>
      </section>

      <Card title="Score trend" description="Overall score trend across the most recent evaluations.">
        <div className="h-[360px]">
          {loading ? (
            <Skeleton className="h-full w-full" />
          ) : timelineData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(78,34,15,0.08)" />
                <XAxis dataKey="date" stroke="#7A6A57" />
                <YAxis stroke="#7A6A57" domain={[0, 10]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4E220F" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Trend unavailable" description="At least one evaluation is required to render a score trend." />
          )}
        </div>
      </Card>
    </div>
  );
}