import React from 'react';
import { cn } from '../utils/classNames';

const Textarea = React.forwardRef(function Textarea({ label, helperText, error, className, rows = 6, ...props }, ref) {
  return (
    <label className="block space-y-2 text-sm font-medium text-ink">
      {label ? <span>{label}</span> : null}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full rounded-xl border border-border bg-white/85 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-[#8A7A67] focus:border-primary focus:ring-4 focus:ring-[rgba(78,34,15,0.08)]',
          error && 'border-danger focus:border-danger focus:ring-[rgba(165,74,58,0.12)]',
          className,
        )}
        {...props}
      />
      {helperText ? <p className="text-xs font-normal text-muted">{helperText}</p> : null}
      {error ? <p className="text-xs font-semibold text-danger">{error}</p> : null}
    </label>
  );
});

export default Textarea;