import { useEffect, useCallback } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { TopBar } from '@/components/layout/TopBar'
import { LeftRail } from '@/components/layout/LeftRail'
import { RightPanel } from '@/components/layout/RightPanel'
import { FlowCanvas } from '@/components/canvas/FlowCanvas'
import { useAppStore } from '@/store/appStore'

export default function App() {
  const {
    isMobilePanelOpen,
    setMobilePanelOpen,
    toggleMobilePanel,
    setSelectedNodeId,
  } = useAppStore()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      // Don't fire shortcuts when typing in inputs
      if (['input', 'textarea', 'select'].includes(tag)) return

      if (e.key === 'Escape') setSelectedNodeId(null)
      if (e.key === 'p' || e.key === 'P') toggleMobilePanel()
    },
    [setSelectedNodeId, toggleMobilePanel]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Close drawer on Escape separately
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

          <main className="flex-1 relative overflow-hidden">
            <FlowCanvas />
          </main>

          {/* Desktop right panel */}
          <aside className="hidden lg:flex w-72 flex-col border-l border-[--color-border] bg-[#0f0f1e]">
            <RightPanel />
          </aside>

          {/* Mobile backdrop */}
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