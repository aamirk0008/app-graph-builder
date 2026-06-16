import { cn } from '@/lib/utils'

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-[--color-border] bg-transparent px-3 py-2 text-sm',
        'text-[--color-foreground] placeholder:text-[--color-muted-foreground]',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[--color-ring]',
        'disabled:cursor-not-allowed disabled:opacity-50 resize-none',
        className
      )}
      {...props}
    />
  )
}