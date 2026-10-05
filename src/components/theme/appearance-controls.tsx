"use client"

import { COLOR_OPTIONS, FONT_OPTIONS, RADIUS_OPTIONS, type ColorId, type FontId, type RadiusId } from "@/lib/appearance"
import { cn } from "@/lib/cn"
import { useAppearance } from "@/components/theme/appearance-provider"

export function AppearanceControls({ className }: { className?: string }) {
  const { appearance, setColor, setRadius, setFont } = useAppearance()

  return (
    <div className={cn("grid gap-5", className)}>
      <OptionRow
        label="Color"
        hint="--primary, --background, --chart-*"
        value={appearance.color}
        options={COLOR_OPTIONS.map((option) => ({
          id: option.id,
          label: option.label,
          description: option.description,
          swatch: option.swatch,
        }))}
        onChange={(id) => setColor(id as ColorId)}
      />
      <OptionRow
        label="Radius"
        hint="--radius"
        value={appearance.radius}
        options={RADIUS_OPTIONS}
        onChange={(id) => setRadius(id as RadiusId)}
      />
      <OptionRow
        label="Type"
        hint="--font-sans, --font-display, --font-mono"
        value={appearance.font}
        options={FONT_OPTIONS}
        onChange={(id) => setFont(id as FontId)}
      />
    </div>
  )
}

function OptionRow({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string
  hint: string
  value: string
  options: { id: string; label: string; description: string; swatch?: string }[]
  onChange: (id: string) => void
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[13px] font-medium">{label}</span>
        <span className="font-mono text-[11px] text-[var(--oreo-text-tertiary)]">{hint}</span>
      </legend>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((option) => {
          const selected = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-[var(--oreo-radius-md)] border px-3 py-2 text-left oreo-clickable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
                selected
                  ? "border-[var(--oreo-border-focus)] bg-[var(--accent)]"
                  : "border-[var(--oreo-border-default)] bg-[var(--oreo-bg-surface)] hover:bg-[var(--oreo-interaction-hover)]"
              )}
            >
              {option.swatch ? (
                <span className="size-3 shrink-0 rounded-full" style={{ background: option.swatch }} />
              ) : null}
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-medium">{option.label}</span>
                <span className="block truncate text-[11px] text-[var(--oreo-text-secondary)]">{option.description}</span>
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
