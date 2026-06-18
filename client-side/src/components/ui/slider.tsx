import { cn } from '@/lib/utils'
import { useRef, useCallback, useEffect, useState } from 'react'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, className }: SliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  const barColor =
    pct > 70
      ? 'linear-gradient(90deg, #3b82f6, #ef4444)'
      : pct > 40
        ? 'linear-gradient(90deg, #3b82f6, #f59e0b)'
        : 'linear-gradient(90deg, #3b82f6, #22c55e)'

  const calcValue = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
      const raw = min + ratio * (max - min)
      const stepped = Math.round(raw / step) * step
      const clamped = Math.min(max, Math.max(min, stepped))
      onChange(clamped)
    },
    [min, max, step, onChange]
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setDragging(true)
      calcValue(e.clientX)
    },
    [calcValue]
  )

  useEffect(() => {
    if (!dragging) return

    const onMouseMove = (e: MouseEvent) => {
      calcValue(e.clientX)
    }

    const onMouseUp = () => {
      setDragging(false)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [dragging, calcValue])

  return (
    <div
      ref={trackRef}
      className={cn('relative w-full h-5 flex items-center cursor-pointer select-none', className)}
      onMouseDown={onMouseDown}
    >
      {/* Track */}
      <div className="absolute w-full h-1.5 rounded-full bg-[#1e2240]">
        {/* Fill */}
        <div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>

      {/* Thumb */}
      <div
        className="absolute w-4 h-4 rounded-full bg-purple-500 z-10"
        style={{
          left: `calc(${pct}% - 8px)`,
          border: '2px solid #0d0d1a',
          boxShadow: dragging ? '0 0 0 4px rgba(168,85,247,0.4)' : '0 0 0 2px rgba(168,85,247,0.2)',
        }}
      />
    </div>
  )
}
