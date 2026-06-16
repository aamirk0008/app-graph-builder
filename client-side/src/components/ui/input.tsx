import { cn } from '@/lib/utils'

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'flex h-9 w-full rounded-md border border-[--color-border] bg-transparent px-3 py-1 text-sm',
        'text-[--color-foreground] placeholder:text-[--color-muted-foreground]',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-ring]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}