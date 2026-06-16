import { useAppStore } from '@/store/appStore'
import { ChevronRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

// Placeholder — replaced with real data in v0.3
function AppsListPlaceholder() {
  return (
    <div className="space-y-0.5 px-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
        >
          <Skeleton className="w-7 h-7 rounded-md shrink-0" />
          <Skeleton className="h-4 flex-1 rounded" />
          <ChevronRight size={14} className="text-[--color-muted-foreground] shrink-0" />
        </div>
      ))}
    </div>
  )
}

export function RightPanel() {
  const { selectedNodeId } = useAppStore()

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Apps section */}
      <div
        className="flex flex-col min-h-0 border-b border-[--color-border]"
        style={{ maxHeight: selectedNodeId ? '45%' : '100%' }}
      >
        <div className="px-4 py-3 shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[--color-muted-foreground]">
            Applications
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 pb-2">
          <AppsListPlaceholder />
        </div>
      </div>

      {/* Inspector placeholder — only when node selected */}
      {selectedNodeId && (
        <div className="flex-1 p-4">
          <p className="text-xs text-[--color-muted-foreground]">
            Inspector coming in v0.5
          </p>
        </div>
      )}
    </div>
  )
}