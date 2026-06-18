import { Maximize2, Plus, Menu, GitBranch, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'
import { useApps } from '@/hooks/useApps'
import { useReactFlow } from '@xyflow/react'

export function TopBar() {
  const { toggleMobilePanel, selectedAppId, addNode } = useAppStore()
  const { data: apps } = useApps()
  const { fitView } = useReactFlow()

  const selectedApp = apps?.find((a) => a.id === selectedAppId)

  return (
    <header className="flex items-center justify-between px-4 h-12 shrink-0 z-10 border-b border-[--color-border] bg-[#0f0f1e]">

      {/* Brand + selected app */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-purple-600 flex items-center justify-center shrink-0">
            <GitBranch size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm text-white hidden sm:block">
            App Graph Builder
          </span>
        </div>

        {selectedApp && (
          <>
            <span className="text-[--color-muted-foreground] text-sm hidden sm:block">
              /
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[--color-accent] border border-[--color-border]">
              <div
                className="w-3.5 h-3.5 rounded-sm shrink-0"
                style={{ backgroundColor: selectedApp.color }}
              />
              <span className="text-xs font-medium text-[--color-foreground] max-w-[140px] truncate">
                {selectedApp.name}
              </span>
              <ChevronDown size={11} className="text-[--color-muted-foreground]" />
            </div>
          </>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          title="Fit view (F)"
          onClick={() => fitView({ padding: 0.2, duration: 400 })}
        >
          <Maximize2 size={15} />
          <span className="hidden sm:inline">Fit</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          title="Add new node"
          onClick={() => addNode?.()}
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Add Node</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobilePanel}
          title="Toggle panel (P)"
        >
          <Menu size={16} />
        </Button>
      </div>
    </header>
  )
}