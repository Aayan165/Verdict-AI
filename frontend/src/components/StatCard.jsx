import { cn } from '../utils/classNames';
import Card from './Card';

export default function StatCard({ title, value, description, icon: Icon, tone = 'primary', className }) {
  const tones = {
    primary: 'bg-[rgba(78,34,15,0.08)] text-primary',
    success: 'bg-[rgba(79,106,56,0.12)] text-success',
    danger: 'bg-[rgba(165,74,58,0.12)] text-danger',
    info: 'bg-[rgba(53,92,125,0.12)] text-info',
  };

  return (
    <Card className={cn('h-full', className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
          {description ? <p className="mt-2 text-xs text-muted">{description}</p> : null}
        </div>
        {Icon ? (
          <div className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', tones[tone] || tones.primary)}>
            <Icon className="h-6 w-6" />
          </div>
        ) : null}
      </div>
    </Card>
  );
}