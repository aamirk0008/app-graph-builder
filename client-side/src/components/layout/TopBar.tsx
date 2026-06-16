import { Maximize2, Plus, Menu, GitBranch } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/appStore'

export function TopBar() {
  const { toggleMobilePanel } = useAppStore()

  return (
    <header className="flex items-center justify-between px-4 h-12 shrink-0 z-10 border-b border-[--color-border] bg-[#0f0f1e]">

      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-purple-600 flex items-center justify-center">
          <GitBranch size={14} className="text-white" />
        </div>
        <span className="font-semibold text-sm text-white hidden sm:block">
          App Graph Builder
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" title="Fit view">
          <Maximize2 size={15} />
          <span className="hidden sm:inline">Fit</span>
        </Button>

        <Button variant="ghost" size="sm" title="Add node">
          <Plus size={15} />
          <span className="hidden sm:inline">Add Node</span>
        </Button>

        {/* Mobile only */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobilePanel}
          title="Toggle panel"
        >
          <Menu size={16} />
        </Button>
      </div>
    </header>
  )
}