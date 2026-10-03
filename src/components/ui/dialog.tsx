import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function Dialog({ open, onOpenChange, children, title, description }: DialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div 
        className="relative z-50 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-xl border border-neutral-200 bg-white p-6 shadow-xl animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {(title || description) && (
          <div className="mb-5 pr-6">
            {title && <h2 className="text-lg font-bold text-neutral-900 tracking-tight">{title}</h2>}
            {description && <p className="mt-1 text-sm text-neutral-600">{description}</p>}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
}
