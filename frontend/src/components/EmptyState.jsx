import { AlertCircle } from 'lucide-react';
import Card from './Card';

export default function EmptyState({ title, description, action, icon: Icon = AlertCircle }) {
  return (
    <Card className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(78,34,15,0.08)] text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm text-muted">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </Card>
  );
}