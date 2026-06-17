import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Settings, Cpu, HardDrive, Server, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { NodeStatus } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ServiceNodeData {
  label: string
  type: 'service' | 'database'
  status: NodeStatus
  cost: string
  resourceValue: number
  description?: string
  provider?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusVariant(status: NodeStatus) {
  if (status === 'Healthy') return 'healthy' as const
  if (status === 'Degraded') return 'degraded' as const
  return 'down' as const
}

function statusIcon(status: NodeStatus) {
  if (status === 'Healthy') return '✓'
  if (status === 'Degraded') return '⚠'
  return '✕'
}

function NodeIcon({ type }: { type: string }) {
  const base = 'w-7 h-7 rounded-md flex items-center justify-center text-white'
  if (type === 'database') {
    return (
      <div className={cn(base, 'bg-blue-600')}>
        <HardDrive size={14} />
      </div>
    )
  }
  return (
    <div className={cn(base, 'bg-purple-600')}>
      <Server size={14} />
    </div>
  )
}

const RESOURCE_TABS = [
  { id: 'cpu',    label: 'CPU',    Icon: Cpu },
  { id: 'memory', label: 'Memory', Icon: Server },
  { id: 'disk',   label: 'Disk',   Icon: HardDrive },
  { id: 'region', label: 'Region', Icon: Globe },
]

// ─── Component ────────────────────────────────────────────────────────────────

function ServiceNodeComponent(props: NodeProps) {
  const data = props.data as unknown as ServiceNodeData
  const selected = props.selected ?? false
  const pct = data.resourceValue ?? 0
  const barColor = pct > 70 ? '#ef4444' : pct > 40 ? '#f59e0b' : '#3b82f6'

  return (
    <div
      className={cn(
        'w-[280px] rounded-xl border bg-[#1a1a2e] text-white shadow-xl',
        'transition-all duration-150 select-none',
        selected
          ? 'border-purple-500 ring-2 ring-purple-500/30'
          : 'border-[#2a2a4a] hover:border-purple-400/40'
      )}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-purple-500 !border-2 !border-[#1a1a2e]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-purple-500 !border-2 !border-[#1a1a2e]"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <NodeIcon type={data.type} />
          <span className="font-semibold text-sm leading-tight">
            {data.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge variant="cost">{data.cost}</Badge>
          <button
            className="text-gray-400 hover:text-white transition-colors p-0.5 rounded"
            title="Settings"
          >
            <Settings size={13} />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex justify-between px-3 pb-1 text-[11px] text-gray-400 font-mono">
        <span>0.02</span>
        <span>0.05 GB</span>
        <span>10.00 GB</span>
        <span>1</span>
      </div>

      {/* Resource tabs */}
      <div className="flex gap-1 px-3 pb-2">
        {RESOURCE_TABS.map(({ id, label, Icon }, i) => (
          <button
            key={id}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-colors',
              i === 0
                ? 'bg-[#2a2a5a] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[#2a2a4a]'
            )}
          >
            <Icon size={10} />
            {label}
          </button>
        ))}
      </div>

      {/* Resource bar */}
      <div className="flex items-center gap-2 px-3 pb-2">
        <div className="flex-1 h-1.5 rounded-full bg-[#2a2a4a] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, #3b82f6, ${barColor})`,
            }}
          />
        </div>
        <span className="text-[11px] font-mono text-gray-300 min-w-[32px] text-right">
          {((pct / 100) * 0.04).toFixed(2)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 pb-3">
        <Badge variant={statusVariant(data.status)}>
          {statusIcon(data.status)} {data.status}
        </Badge>
        <span className="text-xs font-bold text-[#FF9900] tracking-wide font-mono">
          aws
        </span>
      </div>
    </div>
  )
}

export const ServiceNode = memo(ServiceNodeComponent)