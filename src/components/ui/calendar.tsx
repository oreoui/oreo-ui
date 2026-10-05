"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"

import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/cn"
import { addDays, addMonths, buildMonthGrid, formatMonth, isInRange, isSameDay, isSameMonth, type DateRange } from "@/lib/datetime"

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export function CalendarMonth({
  month,
  onMonthChange,
  range,
  hoverDay,
  onHoverDay,
  onSelectDay,
  navigation = true,
  className,
}: {
  month: Date
  onMonthChange: (month: Date) => void
  range: DateRange
  hoverDay: Date | null
  onHoverDay: (day: Date | null) => void
  onSelectDay: (day: Date) => void
  navigation?: boolean
  className?: string
}) {
  const days = buildMonthGrid(month)
  const previewTo = range.to ?? hoverDay
  const gridRef = React.useRef<HTMLDivElement>(null)

  function moveFocus(day: Date, delta: number) {
    const next = addDays(day, delta)
    if (!isSameMonth(next, month)) onMonthChange(new Date(next.getFullYear(), next.getMonth(), 1))
    window.requestAnimationFrame(() => {
      gridRef.current?.querySelector<HTMLButtonElement>(`[data-date="${next.toDateString()}"]`)?.focus()
    })
  }

  return (
    <div className={cn("min-w-0", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        {navigation ? (
          <IconButton
            type="button"
            variant="ghost"
            aria-label="Previous month"
            icon={<ChevronLeft size={16} />}
            onClick={() => onMonthChange(addMonths(month, -1))}
          />
        ) : (
          <span className="size-8" />
        )}
        <p className="text-[14px] font-medium">{formatMonth(month)}</p>
        {navigation ? (
          <IconButton
            type="button"
            variant="ghost"
            aria-label="Next month"
            icon={<ChevronRight size={16} />}
            onClick={() => onMonthChange(addMonths(month, 1))}
          />
        ) : (
          <span className="size-8" />
        )}
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-medium uppercase tracking-wide text-[var(--oreo-text-tertiary)]">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday} className="py-1">
            {weekday}
          </span>
        ))}
      </div>
      <div ref={gridRef} className="grid grid-cols-7 gap-y-1" onMouseLeave={() => onHoverDay(null)}>
        {days.map((day) => {
          const outside = !isSameMonth(day, month)
          const start = isSameDay(day, range.from)
          const end = isSameDay(day, previewTo)
          const inRange = isInRange(day, range.from, previewTo)
          const single = start && end
          return (
            <button
              key={day.toDateString()}
              type="button"
              data-date={day.toDateString()}
              aria-pressed={start || end || undefined}
              aria-label={day.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              onMouseEnter={() => onHoverDay(day)}
              onFocus={() => onHoverDay(day)}
              onClick={() => onSelectDay(day)}
              onKeyDown={(event) => {
                const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key]
                if (!delta) return
                event.preventDefault()
                moveFocus(day, delta)
              }}
              className={cn(
                "relative flex h-11 items-center justify-center text-[13px] oreo-clickable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
                outside ? "text-[var(--oreo-text-placeholder)]" : "text-[var(--oreo-text-primary)]",
                inRange && !start && !end && "bg-[var(--accent)]",
                (start || end) && "bg-[var(--oreo-bg-inverse)] text-[var(--oreo-text-on-inverse)]",
                start && !single && "rounded-l-[var(--oreo-radius-sm)]",
                end && !single && "rounded-r-[var(--oreo-radius-sm)]",
                single && "rounded-[var(--oreo-radius-sm)]"
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
