import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import Badge, { verdictVariant } from '../components/Badge';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Table from '../components/Table';
import { getModelComparison } from '../features/modelComparison/modelComparison.service';
import { formatDateTime, formatScore } from '../utils/formatters';

export default function ModelComparisonPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);

      try {
        const data = await getModelComparison();
        if (active) {
          setItems(Array.isArray(data) ? data : []);
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

  const sorted = useMemo(() => [...items].sort((left, right) => right.overall_score - left.overall_score), [items]);

  return (
    <Card title="Model comparison table" description="Compare model averages across the most recent adjudicated evaluations.">
      {loading ? (
        <Loader label="Loading comparison" />
      ) : sorted.length ? (
        <Table>
          <thead className="bg-[rgba(176,186,153,0.18)] text-xs uppercase tracking-[0.18em] text-muted">
            <tr>
              <th className="px-4 py-3">Model Name</th>
              <th className="px-4 py-3">Accuracy</th>
              <th className="px-4 py-3">Logic</th>
              <th className="px-4 py-3">Completeness</th>
              <th className="px-4 py-3">Overall</th>
              <th className="px-4 py-3">Verdict</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={`${item.model_name}-${item.created_at}`} className="border-t border-border/70">
                <td className="px-4 py-4 font-medium text-ink">{item.model_name}</td>
                <td className="px-4 py-4">{formatScore(item.accuracy_score)}</td>
                <td className="px-4 py-4">{formatScore(item.logic_score)}</td>
                <td className="px-4 py-4">{formatScore(item.completeness_score)}</td>
                <td className="px-4 py-4 font-semibold text-ink">{formatScore(item.overall_score)}</td>
                <td className="px-4 py-4"><Badge variant={verdictVariant(item.verdict)}>{item.verdict}</Badge></td>
                <td className="px-4 py-4 text-sm text-muted">{formatDateTime(item.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <EmptyState title="No comparison data" description="Run evaluations with different models to generate comparison rows." />
      )}
    </Card>
  );
}