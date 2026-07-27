import Button from './Button';

export default function Pagination({ page, hasNext, onPrev, onNext, pageSize = 10, totalLabel }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-white/70 p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        Page <span className="font-semibold text-ink">{page}</span>
        {totalLabel ? <span className="ml-2">{totalLabel}</span> : null}
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onPrev} disabled={page <= 1}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" onClick={onNext} disabled={!hasNext}>
          Next
        </Button>
      </div>
      <p className="text-xs text-muted">Showing {pageSize} per page</p>
    </div>
  );
}