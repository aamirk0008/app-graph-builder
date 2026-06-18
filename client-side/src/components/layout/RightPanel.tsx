import { useAppStore } from '@/store/appStore'
import { useApps } from '@/hooks/useApps'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { NodeInspector } from '@/components/inspector/NodeInspector'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { App } from '@/types'

// ─── App Item ────────────────────────────────────────────────────────────────

interface AppItemProps {
  app: App
  selected: boolean
  onClick: () => void
}

function AppItem({ app, selected, onClick }: AppItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
        selected
          ? 'bg-purple-600/20 text-white'
          : 'text-[--color-muted-foreground] hover:bg-[--color-accent] hover:text-[--color-foreground]'
      )}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: app.color }}
      >
        {app.icon}
      </div>
      <span className="text-sm font-medium truncate flex-1">{app.name}</span>
      <ChevronRight size={14} className="shrink-0 opacity-40" />
    </button>
  )
}

// ─── Loading ──────────────────────────────────────────────────────────────────

function AppsLoading() {
  return (
    <div className="space-y-1 px-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <Skeleton className="w-7 h-7 rounded-md shrink-0" />
          <Skeleton className="h-4 flex-1 rounded" />
        </div>
      ))}
    </div>
  )
}

// ─── Error ────────────────────────────────────────────────────────────────────

function AppsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 px-4 text-center">
      <AlertCircle size={22} className="text-red-400" />
      <p className="text-sm text-[--color-foreground]">Failed to load apps</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

// ─── Apps List ────────────────────────────────────────────────────────────────

function AppsList() {
  const { selectedAppId, setSelectedAppId } = useAppStore()
  const { data: apps, isLoading, isError, refetch } = useApps()

  if (isLoading) return <AppsLoading />
  if (isError) return <AppsError onRetry={() => void refetch()} />
  if (!apps?.length) {
    return (
      <p className="text-xs text-[--color-muted-foreground] px-4 py-6 text-center">
        No apps found
      </p>
    )
  }

  return (
    <div className="space-y-0.5 px-2">
      {apps.map((app) => (
        <AppItem
          key={app.id}
          app={app}
          selected={selectedAppId === app.id}
          onClick={() => setSelectedAppId(app.id)}
        />
      ))}
    </div>
  )
}

// ─── Right Panel ──────────────────────────────────────────────────────────────

export function RightPanel() {
  const { selectedNodeId } = useAppStore()

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Apps section — shrinks when inspector is open */}
      <div
        className="flex flex-col min-h-0 border-b border-[--color-border] transition-all duration-300"
        style={{ maxHeight: selectedNodeId ? '40%' : '100%' }}
      >
        <div className="px-4 py-3 shrink-0">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[--color-muted-foreground]">
            Applications
          </h2>
        </div>
        <div className="overflow-y-auto flex-1 pb-2">
          <AppsList />
        </div>
      </div>

      {/* Inspector — slides in when node selected */}
      {selectedNodeId && (
        <div className="flex-1 overflow-hidden min-h-0">
          <NodeInspector />
        </div>
      )}
    </div>
  )
}