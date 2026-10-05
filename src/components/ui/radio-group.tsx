"use client"

import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/cn"

type RadioGroupContextValue = {
  name: string
  value?: string
  setValue: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

export function RadioGroup({
  value: controlledValue,
  defaultValue,
  onValueChange,
  name,
  label,
  description,
  error,
  orientation = "vertical",
  className,
  children,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  name?: string
  label?: string
  description?: string
  error?: string
  orientation?: "vertical" | "horizontal"
  className?: string
  children: React.ReactNode
}) {
  const generatedName = React.useId()
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = controlledValue ?? uncontrolled
  const labelId = React.useId()
  const descriptionId = React.useId()
  const errorId = React.useId()

  const setValue = React.useCallback(
    (next: string) => {
      if (controlledValue === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [controlledValue, onValueChange]
  )

  return (
    <RadioGroupContext.Provider value={{ name: name ?? generatedName, value, setValue }}>
      <div
        role="radiogroup"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error ? errorId : description ? descriptionId : undefined}
        aria-invalid={error ? true : undefined}
        className={cn("flex flex-col gap-2", className)}
      >
        {label ? (
          <span id={labelId} className="text-[13px] font-medium leading-none text-[var(--oreo-text-primary)]">
            {label}
          </span>
        ) : null}
        {description && !error ? (
          <p id={descriptionId} className="text-[12px] leading-[1.4] text-[var(--oreo-text-secondary)]">
            {description}
          </p>
        ) : null}
        <div className={cn("flex gap-2", orientation === "horizontal" ? "flex-col sm:flex-row" : "flex-col")}>{children}</div>
        {error ? (
          <p id={errorId} role="alert" className="text-[12px] font-medium text-[var(--oreo-status-error)]">
            {error}
          </p>
        ) : null}
      </div>
    </RadioGroupContext.Provider>
  )
}

export function RadioGroupItem({
  value,
  label,
  description,
  disabled = false,
  className,
}: {
  value: string
  label: string
  description?: string
  disabled?: boolean
  className?: string
}) {
  const context = React.useContext(RadioGroupContext)
  if (!context) throw new Error("RadioGroupItem must be used within RadioGroup")
  const checked = context.value === value
  const reduceMotion = useReducedMotion()
  const id = React.useId()

  return (
    <label
      htmlFor={id}
      data-disabled={disabled || undefined}
      className={cn(
        "flex min-h-11 flex-1 oreo-clickable items-start gap-3 rounded-[var(--oreo-radius-md)] border px-3 py-3 transition-colors focus-within:ring-1 focus-within:ring-[var(--oreo-border-focus)]",
        checked
          ? "border-[var(--oreo-border-focus)] bg-[var(--accent)]"
          : "border-[var(--oreo-border-default)] bg-[var(--oreo-bg-surface)] hover:bg-[var(--oreo-interaction-hover)]",
        disabled && "opacity-40",
        className
      )}
    >
      <input
        id={id}
        type="radio"
        name={context.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => context.setValue(value)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full border transition-colors",
          "peer-focus-visible:ring-1 peer-focus-visible:ring-[var(--oreo-border-focus)]",
          checked ? "border-[var(--oreo-bg-inverse)]" : "border-[var(--oreo-border-default)]"
        )}
      >
        {checked ? (
          <motion.span
            initial={{ scale: reduceMotion ? 1 : 0.6 }}
            animate={{ scale: 1 }}
            className="size-2 rounded-full bg-[var(--oreo-bg-inverse)]"
          />
        ) : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-medium leading-snug text-[var(--oreo-text-primary)]">{label}</span>
        {description ? <span className="mt-0.5 block text-[12px] leading-[1.4] text-[var(--oreo-text-secondary)]">{description}</span> : null}
      </span>
    </label>
  )
}
