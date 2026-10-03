import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700 disabled:pointer-events-none disabled:opacity-50 select-none whitespace-nowrap active:scale-[0.98] cursor-pointer';

    const variants = {
      default: 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-sm border border-emerald-800',
      secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200',
      outline: 'bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50 shadow-xs',
      ghost: 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900',
      danger: 'bg-neutral-900 text-red-100 hover:bg-black border border-neutral-800',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-10 px-4 py-2 text-sm rounded-lg gap-2',
      lg: 'h-11 px-6 text-base rounded-lg gap-2.5',
      icon: 'h-9 w-9 p-0 rounded-lg justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
