import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border',
  {
    variants: {
      variant: {
        default:   'bg-[--color-primary] text-[--color-primary-foreground] border-transparent',
        secondary: 'bg-[--color-secondary] text-[--color-secondary-foreground] border-transparent',
        healthy:   'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
        degraded:  'border-amber-500/30 text-amber-400 bg-amber-500/10',
        down:      'border-red-500/30 text-red-400 bg-red-500/10',
        cost:      'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-mono',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}