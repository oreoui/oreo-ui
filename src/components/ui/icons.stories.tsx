/**
 * Icon foundation page.
 *
 * The catalogue is resolved by name at render time, which is why this file imports the
 * `lucide-react` namespace: the page exists to list what the library ships, so the icon set
 * is the data. That namespace import is Storybook-only and never reaches the app bundle.
 */
"use client"

import type { Meta, StoryObj } from "@storybook/react"
import * as icons from "lucide-react"

const meta: Meta = {
  title: "Foundations/Icons",
  parameters: { layout: "fullscreen" },
}

export default meta

const catalogue = [
  "Paperclip", "AtSign", "ArrowUp", "ChevronDown", "Check", "X", "Menu", "Search", "Folder",
  "Image", "Video", "Code2", "MessageCircle", "MoreHorizontal", "PanelLeftClose", "PanelLeftOpen",
  "Command", "Slash", "Maximize2", "Loader2", "Sparkles", "Trash2",
] as const

function IconFoundations() {
  return (
    <main className="min-h-dvh bg-[var(--oreo-bg-base)] px-4 py-10 text-[var(--oreo-text-primary)] sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[998px]">
        <p className="font-mono text-[14px] text-[var(--oreo-text-tertiary)]">Foundations</p>
        <h1 className="mt-4 text-6xl font-medium tracking-[-0.06em]">Icon</h1>
        <p className="mt-4 max-w-[640px] text-[14px] leading-[1.43] text-[var(--oreo-text-secondary)]">
          Lucide at 16px for controls and 20px inside icon buttons, inheriting the surrounding text colour.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {catalogue.map((name) => {
            const Glyph = icons[name] as React.ComponentType<{ className?: string }> | undefined
            if (!Glyph) return null
            return (
              <div key={name} className="flex flex-col items-center gap-3 rounded-[var(--oreo-radius-lg)] border-[0.5px] border-[var(--oreo-border-subtle)] p-4">
                <Glyph className="size-5" />
                <span className="font-mono text-[11px] text-[var(--oreo-text-tertiary)]">{name}</span>
              </div>
            )
          })}
        </div>

        <h2 className="mt-16 text-2xl font-semibold">Sizes</h2>
        <div className="mt-6 flex items-end gap-8">
          {[12, 14, 16, 20, 24, 32].map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <icons.Sparkles style={{ width: size, height: size }} />
              <span className="font-mono text-[11px] text-[var(--oreo-text-tertiary)]">{size}px</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export const Overview: StoryObj = {
  render: () => <IconFoundations />,
}