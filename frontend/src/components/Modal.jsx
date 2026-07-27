import { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ open, title, description, onClose, children, footer }) {
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    if (open) {
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(35,21,15,0.44)] px-4 py-8 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-[1.35rem] border border-white/70 bg-[#fcf8eb] p-5 shadow-soft" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="text-lg font-semibold text-ink">{title}</h3> : null}
            {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="max-h-[76vh] overflow-y-auto pr-1 thin-scrollbar">{children}</div>
        {footer ? <div className="mt-5 flex flex-wrap justify-end gap-3">{footer}</div> : null}
      </div>
    </div>
  );
}