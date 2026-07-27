import { cn } from '../utils/classNames';

export default function Card({ title, description, action, className, children }) {
  return (
    <section className={cn('rounded-xl border border-border bg-white/75 p-5 shadow-soft backdrop-blur-sm', className)}>
      {(title || description || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="text-base font-semibold text-ink">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          {action ? <div>{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}