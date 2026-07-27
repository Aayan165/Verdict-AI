import { cn } from '../utils/classNames';

const variantStyles = {
  success: 'bg-[rgba(79,106,56,0.14)] text-success',
  danger: 'bg-[rgba(165,74,58,0.14)] text-danger',
  warning: 'bg-[rgba(169,121,46,0.14)] text-warning',
  info: 'bg-[rgba(53,92,125,0.14)] text-info',
  neutral: 'bg-[rgba(78,34,15,0.08)] text-primary',
};

export default function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variantStyles[variant], className)}>
      {children}
    </span>
  );
}

export function verdictVariant(verdict) {
  const value = String(verdict || '').toLowerCase();

  if (value.includes('excellent') || value.includes('accept')) return 'success';
  if (value.includes('partial') || value.includes('review')) return 'warning';
  if (value.includes('reject') || value.includes('poor')) return 'danger';
  return 'neutral';
}