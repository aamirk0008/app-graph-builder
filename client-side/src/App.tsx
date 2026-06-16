import { useEffect } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { TopBar } from '@/components/layout/TopBar'
import { LeftRail } from '@/components/layout/LeftRail'
import { RightPanel } from '@/components/layout/RightPanel'
import { useAppStore } from '@/store/appStore'

// Canvas placeholder — replaced in v0.4
function CanvasPlaceholder() {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        backgroundImage: 'radial-gradient(circle, #2a2a4a 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <p className="text-[--color-muted-foreground] text-sm">
        Canvas coming in v0.4
      </p>
    </div>
  )
}

export default function App() {
  const { isMobilePanelOpen, setMobilePanelOpen } = useAppStore()

  // Close drawer on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobilePanelOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [setMobilePanelOpen])

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0d0d1a]">
        <TopBar />

        <div className="flex flex-1 overflow-hidden">
          <LeftRail />

          {/* Center canvas */}
          <main className="flex-1 relative overflow-hidden">
            <CanvasPlaceholder />
          </main>

          {/* Right panel — sidebar on desktop */}
          <aside className="hidden lg:flex w-72 flex-col border-l border-[--color-border] bg-[#0f0f1e]">
            <RightPanel />
          </aside>

          {/* Mobile overlay backdrop */}
          {isMobilePanelOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              onClick={() => setMobilePanelOpen(false)}
            />
          )}

          {/* Mobile drawer */}
          <aside
            className={[
              'fixed top-0 right-0 z-50 h-full w-72 flex flex-col',
              'bg-[#0f0f1e] border-l border-[--color-border]',
              'transition-transform duration-300 ease-in-out lg:hidden',
              isMobilePanelOpen ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}
          >
            <RightPanel />
          </aside>
        </div>
      </div>
    </ReactFlowProvider>
  )
}