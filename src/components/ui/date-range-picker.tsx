"use client"

import { CalendarRange } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { CalendarMonth } from "@/components/ui/calendar"
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFormField } from "@/components/ui/form-input"
import { cn } from "@/lib/cn"
import {
  addMonths,
  commitRange,
  formatRange,
  rangePresets,
  selectRangeDay,
  startOfMonth,
  type DateRange,
} from "@/lib/datetime"

const emptyRange: DateRange = { from: null, to: null }

export function DateRangePicker({
  value,
  defaultValue = emptyRange,
  onValueChange,
  placeholder = "Select dates",
  className,
}: {
  value?: DateRange
  defaultValue?: DateRange
  onValueChange?: (value: DateRange) => void
  placeholder?: string
  className?: string
}) {
  const field = useFormField()
  const [uncontrolled, setUncontrolled] = React.useState<DateRange>(defaultValue)
  const selected = value ?? uncontrolled
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<DateRange>(selected)
  const [hoverDay, setHoverDay] = React.useState<Date | null>(null)
  const [month, setMonth] = React.useState(() => startOfMonth(selected.from ?? new Date()))
  const presets = rangePresets(new Date())

  function openModal() {
    setDraft(selected)
    setMonth(startOfMonth(selected.from ?? new Date()))
    setHoverDay(null)
    setOpen(true)
  }

  function apply() {
    const next = commitRange(draft)
    if (!value) setUncontrolled(next)
    onValueChange?.(next)
    setOpen(false)
  }

  return (
    <>
      <button
        id={field?.id}
        type="button"
        aria-haspopup="dialog"
        aria-describedby={field ? (field.hasError ? field.errorId : field.descriptionId) : undefined}
        onClick={openModal}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-3 rounded-[var(--oreo-radius-sm)] border bg-[var(--oreo-bg-surface)] px-3 text-left text-[16px] text-[var(--oreo-text-primary)] transition-colors oreo-clickable sm:text-[14px]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
          field?.hasError ? "border-[var(--oreo-status-error)]" : "border-[var(--oreo-border-default)]",
          className
        )}
      >
        <span className={selected.from ? undefined : "text-[var(--oreo-text-placeholder)]"}>{formatRange(selected, placeholder)}</span>
        <CalendarRange size={16} className="shrink-0 text-[var(--oreo-text-secondary)]" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent wide>
          <DialogHeader>
            <div className="min-w-0">
              <DialogTitle>Choose a date range</DialogTitle>
              <DialogDescription>Pick a start and an end. The range is saved when you apply it.</DialogDescription>
            </div>
            <DialogClose />
          </DialogHeader>
          <DialogBody>
            <div className="flex flex-col gap-4 pb-4 lg:flex-row">
              <div className="flex gap-2 overflow-x-auto lg:w-40 lg:flex-col lg:overflow-visible">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setDraft(preset.range)
                      if (preset.range.from) setMonth(startOfMonth(preset.range.from))
                    }}
                    className="min-h-11 shrink-0 rounded-[var(--oreo-radius-sm)] px-3 py-2 text-left text-[13px] text-[var(--oreo-text-secondary)] oreo-clickable hover:bg-[var(--oreo-interaction-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)] lg:w-full"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="grid min-w-0 flex-1 gap-6 sm:grid-cols-2">
                <CalendarMonth
                  month={month}
                  onMonthChange={setMonth}
                  range={draft}
                  hoverDay={hoverDay}
                  onHoverDay={setHoverDay}
                  onSelectDay={(day) => setDraft((current) => selectRangeDay(current, day))}
                />
                <CalendarMonth
                  month={addMonths(month, 1)}
                  onMonthChange={setMonth}
                  navigation={false}
                  range={draft}
                  hoverDay={hoverDay}
                  onHoverDay={setHoverDay}
                  onSelectDay={(day) => setDraft((current) => selectRangeDay(current, day))}
                  className="hidden sm:block"
                />
              </div>
            </div>
          </DialogBody>
          <DialogFooter className="sm:justify-between">
            <p className="hidden text-[13px] text-[var(--oreo-text-secondary)] sm:block">{formatRange(commitRange(draft), "No dates selected")}</p>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button variant="ghost" onClick={() => setDraft(emptyRange)}>
                Clear
              </Button>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" disabled={!draft.from} onClick={apply}>
                Apply
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
