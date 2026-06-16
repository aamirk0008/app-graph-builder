import {
  LayoutDashboard,
  GitBranch,
  Database,
  Box,
  Network,
  Activity,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
}

function NavItem({ icon, label, active }: NavItemProps) {
  return (
    <button
      title={label}
      className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
        active
          ? 'bg-purple-600/20 text-purple-400'
          : 'text-[--color-muted-foreground] hover:text-[--color-foreground] hover:bg-[--color-accent]'
      )}
    >
      {icon}
    </button>
  )
}

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', active: true },
  { icon: <GitBranch size={18} />,      label: 'Services' },
  { icon: <Database size={18} />,       label: 'Databases' },
  { icon: <Box size={18} />,            label: 'Storage' },
  { icon: <Network size={18} />,        label: 'Network' },
  { icon: <Activity size={18} />,       label: 'Metrics' },
]

export function LeftRail() {
  return (
    <nav className="hidden md:flex flex-col items-center gap-1 w-14 py-3 shrink-0 border-r border-[--color-border] bg-[#0f0f1e]">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.label} {...item} />
      ))}

      {/* Settings pinned to bottom */}
      <div className="mt-auto">
        <NavItem icon={<Settings size={18} />} label="Settings" />
      </div>
    </nav>
  )
}