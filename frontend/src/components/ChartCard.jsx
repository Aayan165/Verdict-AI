import Card from './Card';

export default function ChartCard({ title, description, children, className = '' }) {
  return (
    <Card title={title} description={description} className={className}>
      <div className="h-[320px]">{children}</div>
    </Card>
  );
}