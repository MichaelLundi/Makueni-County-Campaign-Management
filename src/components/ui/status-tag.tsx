import { cn } from '../../lib/utils';

interface StatusTagProps {
  status: string;
  variant?: 'green' | 'amber' | 'crimson' | 'neutral' | 'blue';
  className?: string;
  dotOnly?: boolean;
}

export function StatusTag({ status, variant, className, dotOnly = false }: StatusTagProps) {
  // Infer variant if not provided
  let determinedVariant = variant;
  if (!determinedVariant) {
    const s = status.toLowerCase();
    if (s.includes('completed') || s.includes('done') || s.includes('active') || s.includes('resolved')) {
      determinedVariant = 'green';
    } else if (s.includes('progress') || s.includes('investigating') || s.includes('medium') || s.includes('moderate') || s.includes('standby')) {
      determinedVariant = 'amber';
    } else if (s.includes('critical') || s.includes('high') || s.includes('postponed') || s.includes('urgent') || s.includes('inactive')) {
      determinedVariant = 'crimson';
    } else if (s.includes('manifesto') || s.includes('scheduled')) {
      determinedVariant = 'blue';
    } else {
      determinedVariant = 'neutral';
    }
  }

  const dotColors = {
    green: 'bg-emerald-600',
    amber: 'bg-amber-600',
    crimson: 'bg-rose-600',
    blue: 'bg-emerald-700',
    neutral: 'bg-neutral-500',
  };

  const textColors = {
    green: 'text-emerald-800 font-medium',
    amber: 'text-amber-800 font-medium',
    crimson: 'text-rose-800 font-medium',
    blue: 'text-emerald-800 font-medium',
    neutral: 'text-neutral-700 font-medium',
  };

  const bgBorderColors = {
    green: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    amber: 'bg-amber-50/80 border-amber-200 text-amber-900',
    crimson: 'bg-rose-50/80 border-rose-200 text-rose-900',
    blue: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
    neutral: 'bg-neutral-100 border-neutral-200 text-neutral-800',
  };

  if (dotOnly) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs', textColors[determinedVariant], className)}>
        <span className={cn('h-2 w-2 rounded-full shrink-0', dotColors[determinedVariant])} aria-hidden="true" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs whitespace-nowrap',
        bgBorderColors[determinedVariant],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColors[determinedVariant])} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
