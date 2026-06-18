import { useState, useRef, useEffect } from 'react'
import { Maximize2, Plus, Menu, GitBranch, ChevronDown, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'
import { useApps } from '@/hooks/useApps'
import { useReactFlow } from '@xyflow/react'
import { cn } from '@/lib/utils'

function AppDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { selectedAppId, setSelectedAppId } = useAppStore()
  const { data: apps } = useApps()

  const selectedApp = apps?.find((a) => a.id === selectedAppId)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!selectedApp) return null

  return (
    <div ref={ref} className="relative hidden sm:block">
      {/* Trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-colors',
          'border-[--color-border] bg-[--color-accent] hover:bg-[--color-muted]',
        )}
      >
        <div
          className="w-3.5 h-3.5 rounded-sm shrink-0"
          style={{ backgroundColor: selectedApp.color }}
        />
        <span className="text-xs font-medium text-[--color-foreground] max-w-[140px] truncate">
          {selectedApp.name}
        </span>
        <ChevronDown
          size={11}
          className={cn(
            'text-[--color-muted-foreground] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className={cn(
          'absolute top-full left-0 mt-1 w-56 z-50 rounded-lg border',
          'border-[--color-border] bg-[#0f0f1e] shadow-xl py-1',
        )}>
          {apps?.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                setSelectedAppId(app.id)
                setOpen(false)
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                selectedAppId === app.id
                  ? 'bg-purple-600/20 text-white'
                  : 'text-[--color-muted-foreground] hover:bg-[--color-accent] hover:text-white'
              )}
            >
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: app.color }}
              >
                {app.icon}
              </div>
              <span className="text-sm truncate flex-1">{app.name}</span>
              {selectedAppId === app.id && (
                <Check size={13} className="text-purple-400 shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function TopBar() {
  const { toggleMobilePanel, addNode } = useAppStore()
  const { fitView } = useReactFlow()

  return (
    <header className="flex items-center justify-between px-4 h-12 shrink-0 z-10 border-b border-[--color-border] bg-[#0f0f1e]">

      {/* Left — brand + app dropdown */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-purple-600 flex items-center justify-center shrink-0">
            <GitBranch size={14} className="text-white" />
          </div>
          <span className="font-semibold text-sm text-white hidden sm:block">
            App Graph Builder
          </span>
        </div>

        <span className="text-[--color-muted-foreground] text-sm hidden sm:block">/</span>

        <AppDropdown />
      </div>

      {/* Right — actions */}
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