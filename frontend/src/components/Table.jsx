import { cn } from '../utils/classNames';

export default function Table({ className, children }) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-border bg-white/80 shadow-soft thin-scrollbar', className)}>
      <table className="min-w-full divide-y divide-border text-left text-sm text-ink">{children}</table>
    </div>
  );
}