"use client"

import { Clock } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFormField } from "@/components/ui/form-input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/cn"
import { clampTime, formatTime, shiftTime, toHour12, toHour24, type HourCycle, type TimeValue } from "@/lib/datetime"
import { useMediaQuery } from "@/lib/use-media-query"

const presets: TimeValue[] = [
  { hour: 9, minute: 0 },
  { hour: 12, minute: 0 },
  { hour: 18, minute: 30 },
]

function TimePanel({
  value,
  cycle,
  onCycleChange,
  onChange,
}: {
  value: TimeValue
  cycle: HourCycle
  onCycleChange: (cycle: HourCycle) => void
  onChange: (value: TimeValue) => void
}) {
  const time = clampTime(value)
  const hour12 = toHour12(time.hour)

  function setHour(raw: string) {
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) return
    if (cycle === "24") onChange(clampTime({ ...time, hour: parsed }))
    else onChange(clampTime({ ...time, hour: toHour24(parsed, hour12.period) }))
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] text-[var(--oreo-text-secondary)]">Time</p>
        <div className="flex rounded-[var(--oreo-radius-sm)] border border-[var(--oreo-border-default)] p-0.5">
          {(["12", "24"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={cycle === option}
              onClick={() => onCycleChange(option)}
              className={cn(
                "h-8 rounded-[var(--oreo-radius-xs)] px-2.5 text-[12px] font-medium oreo-clickable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
                cycle === option ? "bg-[var(--oreo-bg-inverse)] text-[var(--oreo-text-on-inverse)]" : "text-[var(--oreo-text-secondary)]"
              )}
            >
              {option}h
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <TimeColumn
          label="Hour"
          value={cycle === "24" ? String(time.hour).padStart(2, "0") : String(hour12.hour)}
          onChange={setHour}
          onStep={(delta) => onChange(shiftTime(time, "hour", delta))}
        />
        <span className="pb-6 font-display text-[28px] text-[var(--oreo-text-tertiary)]">:</span>
        <TimeColumn
          label="Minute"
          value={String(time.minute).padStart(2, "0")}
          onChange={(raw) => {
            const parsed = Number(raw)
            if (Number.isFinite(parsed)) onChange(clampTime({ ...time, minute: parsed }))
          }}
          onStep={(delta) => onChange(shiftTime(time, "minute", delta))}
        />
        {cycle === "12" ? (
          <div className="ml-1 flex flex-col gap-1 self-end">
            {(["AM", "PM"] as const).map((period) => (
              <button
                key={period}
                type="button"
                aria-pressed={hour12.period === period}
                onClick={() => onChange({ ...time, hour: toHour24(hour12.hour, period) })}
                className={cn(
                  "h-9 min-w-12 rounded-[var(--oreo-radius-sm)] text-[12px] font-medium oreo-clickable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
                  hour12.period === period
                    ? "bg-[var(--oreo-bg-inverse)] text-[var(--oreo-text-on-inverse)]"
                    : "border border-[var(--oreo-border-default)] text-[var(--oreo-text-secondary)]"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <button
            key={`${preset.hour}-${preset.minute}`}
            type="button"
            onClick={() => onChange(preset)}
            className="h-10 rounded-[var(--oreo-radius-sm)] bg-[var(--oreo-bg-elevated)] text-[12px] text-[var(--oreo-text-secondary)] oreo-clickable hover:bg-[var(--oreo-interaction-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]"
          >
            {formatTime(preset, cycle)}
          </button>
        ))}
      </div>
    </div>
  )
}

function TimeColumn({
  label,
  value,
  onChange,
  onStep,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onStep: (delta: number) => void
}) {
  const inputId = React.useId()
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        onClick={() => onStep(1)}
        className="flex size-11 items-center justify-center rounded-[var(--oreo-radius-sm)] text-[18px] oreo-clickable hover:bg-[var(--oreo-interaction-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]"
      >
        +
      </button>
      <label className="sr-only" htmlFor={inputId}>
        {label}
      </label>
      <input
        id={inputId}
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, "").slice(0, 2))}
        className="h-12 w-16 rounded-[var(--oreo-radius-md)] border border-[var(--oreo-border-default)] bg-[var(--oreo-bg-base)] text-center font-display text-[28px] text-[var(--oreo-text-primary)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]"
      />
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        onClick={() => onStep(-1)}
        className="flex size-11 items-center justify-center rounded-[var(--oreo-radius-sm)] text-[18px] oreo-clickable hover:bg-[var(--oreo-interaction-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]"
      >
        –
      </button>
    </div>
  )
}

export function TimePicker({
  value,
  defaultValue = { hour: 9, minute: 0 },
  onValueChange,
  hourCycle = "12",
  onHourCycleChange,
  className,
}: {
  value?: TimeValue
  defaultValue?: TimeValue
  onValueChange?: (value: TimeValue) => void
  hourCycle?: HourCycle
  onHourCycleChange?: (cycle: HourCycle) => void
  className?: string
}) {
  const field = useFormField()
  const narrow = useMediaQuery("(max-width: 639px)")
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const [uncontrolledCycle, setUncontrolledCycle] = React.useState<HourCycle>(hourCycle)
  const cycle = onHourCycleChange ? hourCycle : uncontrolledCycle
  const [open, setOpen] = React.useState(false)
  const selected = value ?? uncontrolled

  function change(next: TimeValue) {
    const time = clampTime(next)
    if (!value) setUncontrolled(time)
    onValueChange?.(time)
  }

  function changeCycle(next: HourCycle) {
    if (!onHourCycleChange) setUncontrolledCycle(next)
    onHourCycleChange?.(next)
  }

  const panel = <TimePanel value={selected} cycle={cycle} onCycleChange={changeCycle} onChange={change} />
  const label = formatTime(selected, cycle)

  const triggerClass = cn(
    "flex h-11 w-full items-center justify-between gap-3 rounded-[var(--oreo-radius-sm)] border bg-[var(--oreo-bg-surface)] px-3 text-left text-[16px] text-[var(--oreo-text-primary)] oreo-clickable sm:text-[14px]",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
    field?.hasError ? "border-[var(--oreo-status-error)]" : "border-[var(--oreo-border-default)]",
    className
  )

  if (narrow) {
    return (
      <>
        <button
          id={field?.id}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={triggerClass}
        >
          <span>{label}</span>
          <Clock size={16} className="text-[var(--oreo-text-secondary)]" />
        </button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <div>
                <DialogTitle>Choose a time</DialogTitle>
                <DialogDescription>Use the steppers, type a value, or pick a preset.</DialogDescription>
              </div>
              <DialogClose />
            </DialogHeader>
            <DialogBody className="pb-4">
              {panel}
              <Button variant="primary" className="mt-4 w-full" onClick={() => setOpen(false)}>
                Done
              </Button>
            </DialogBody>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger id={field?.id} className={triggerClass}>
        <span>{label}</span>
        <Clock size={16} className="text-[var(--oreo-text-secondary)]" />
      </PopoverTrigger>
      <PopoverContent className="w-[280px]">
        {panel}
        <Button variant="primary" className="mt-3 w-full" onClick={() => setOpen(false)}>
          Done
        </Button>
      </PopoverContent>
    </Popover>
  )
}
