import { useCallback } from 'react'
import { useReactFlow, useNodes, type Node } from '@xyflow/react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { useAppStore } from '@/store/appStore'
import type { NodeStatus } from '@/types'
import type { ServiceNodeData } from '@/components/canvas/ServiceNode'
import { X } from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusVariant(status: NodeStatus) {
  if (status === 'Healthy') return 'healthy' as const
  if (status === 'Degraded') return 'degraded' as const
  return 'down' as const
}

// ─── Section Label ────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-medium text-[--color-muted-foreground] mb-1.5">{children}</p>
}

// ─── Node Inspector ───────────────────────────────────────────────────────────

export function NodeInspector() {
  const { selectedNodeId, activeInspectorTab, setActiveInspectorTab, setSelectedNodeId } =
    useAppStore()

  // const { getNode, setNodes } = useReactFlow()

  // const node = selectedNodeId ? getNode(selectedNodeId) : null
  // const data = node?.data as ServiceNodeData | undefined
  const { setNodes } = useReactFlow()
  const nodes = useNodes()

  const node = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null
  const data = node?.data as ServiceNodeData | undefined

  // Patch node data — merges partial update into existing node data
  const patch = useCallback(
    (update: Partial<ServiceNodeData>) => {
      if (!selectedNodeId) return
      setNodes((nodes: Node[]) =>
        nodes.map((n) => (n.id === selectedNodeId ? { ...n, data: { ...n.data, ...update } } : n))
      )
    },
    [selectedNodeId, setNodes]
  )

  if (!node || !data) return null

  return (
    <div className="flex flex-col h-full">
      {/* Inspector header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[--color-border] shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[--color-muted-foreground]">
            Inspector
          </h3>
          <Badge variant={statusVariant(data.status)}>{data.status}</Badge>
        </div>
        <button
          onClick={() => setSelectedNodeId(null)}
          className="text-[--color-muted-foreground] hover:text-[--color-foreground] transition-colors rounded p-0.5"
          title="Close inspector"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeInspectorTab} onValueChange={setActiveInspectorTab}>
          <div className="px-4 pt-3">
            <TabsList className="w-full">
              <TabsTrigger value="config" className="flex-1 text-xs">
                Config
              </TabsTrigger>
              <TabsTrigger value="runtime" className="flex-1 text-xs">
                Runtime
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ── Config Tab ── */}
          <TabsContent value="config" className="px-4 pb-4 space-y-4">
            {/* Service name */}
            <div>
              <Label>Service name</Label>
              <Input
                value={data.label}
                onChange={(e) => patch({ label: e.target.value })}
                placeholder="Service name"
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <select
                value={data.status}
                onChange={(e) => patch({ status: e.target.value as NodeStatus })}
                className={[
                  'flex h-9 w-full rounded-md border border-[--color-border]',
                  'bg-transparent px-3 py-1 text-sm text-[--color-foreground]',
                  'focus-visible:outline-none focus-visible:ring-1',
                  'focus-visible:ring-[--color-ring]',
                ].join(' ')}
              >
                <option value="Healthy" style={{ background: '#0f1117', color: '#e2e8f0' }}>Healthy</option>
                <option value="Degraded" style={{ background: '#0f1117', color: '#e2e8f0' }}>Degraded</option>
                <option value="Down" style={{ background: '#0f1117', color: '#e2e8f0' }}>Down</option>
              </select>
            </div>

            {/* Node type — read only */}
            <div>
              <Label>Node type</Label>
              <div className="flex gap-2">
                <Badge variant={data.type === 'service' ? 'default' : 'secondary'}>
                  {data.type === 'service' ? '⚙ Service' : '🗄 Database'}
                </Badge>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <Textarea
                value={data.description ?? ''}
                onChange={(e) => patch({ description: e.target.value })}
                placeholder="Add a description..."
                rows={3}
              />
            </div>
          </TabsContent>

          {/* ── Runtime Tab ── */}
          <TabsContent value="runtime" className="px-4 pb-4 space-y-4">
            {/* Synced slider + numeric input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Resource usage</Label>
                <span className="text-xs font-mono text-purple-400">{data.resourceValue}%</span>
              </div>

              {/* Slider */}
              <Slider
                value={data.resourceValue}
                onChange={(v) => patch({ resourceValue: v })}
                min={0}
                max={100}
                step={1}
              />

              {/* Numeric input — synced with slider */}
              <div className="flex items-center gap-3 mt-3">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={data.resourceValue}
                  onChange={(e) => {
                    const v = Math.min(100, Math.max(0, Number(e.target.value)))
                    patch({ resourceValue: v })
                  }}
                  className="w-20 font-mono text-center"
                />
                <span className="text-xs text-[--color-muted-foreground]">
                  out of 100 — synced with slider
                </span>
              </div>
            </div>

            {/* Resource bar preview */}
            <div>
              <Label>Usage bar preview</Label>
              <div className="h-2 rounded-full bg-[--color-muted] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${data.resourceValue}%`,
                    background:
                      data.resourceValue > 70
                        ? 'linear-gradient(90deg, #3b82f6, #ef4444)'
                        : data.resourceValue > 40
                          ? 'linear-gradient(90deg, #3b82f6, #f59e0b)'
                          : 'linear-gradient(90deg, #3b82f6, #22c55e)',
                  }}
                />
              </div>
            </div>

            {/* Cost */}
            <div>
              <Label>Estimated cost</Label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border border-[--color-border] bg-[--color-muted]">
                <span className="text-sm font-mono text-emerald-400">{data.cost}</span>
              </div>
            </div>

            {/* Provider */}
            <div>
              <Label>Provider</Label>
              <div className="flex items-center px-3 py-2 rounded-md border border-[--color-border] bg-[--color-muted]">
                <span className="text-sm font-bold text-[#FF9900] font-mono tracking-wide">
                  {data.provider ?? 'aws'}
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
