import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', {
  variants: {
    variant: {
      muted: 'bg-muted text-muted-foreground',
      outline: 'border border-border text-foreground',
      success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300',
      warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    },
  },
  defaultVariants: { variant: 'muted' },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant }), className)} {...props} />
);
