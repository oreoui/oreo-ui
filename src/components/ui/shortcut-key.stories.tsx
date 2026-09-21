"use client"

import type { Meta, StoryObj } from "@storybook/react"

import { ShortcutKey } from "./shortcut-key"

const meta: Meta<typeof ShortcutKey> = {
  title: "Primitives/ShortcutKey",
  component: ShortcutKey,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof ShortcutKey>

export const SingleKeys: Story = {
  name: "Key axis",
  render: () => (
    <div className="flex flex-wrap items-center gap-3 bg-white p-8">
      {["command", "shift", "option", "control", "at", "slash", "backspace", "fn", "ESC", "Tab", "F1"].map((key) => (
        <ShortcutKey key={key} keys={key} />
      ))}
    </div>
  ),
}

export const Combinations: Story = {
  name: "Combine axis",
  render: () => (
    <div className="flex items-center gap-3 bg-white p-8">
      <ShortcutKey keys={["command", "K"]} />
      <ShortcutKey keys={["command", "shift", "P"]} />
      <ShortcutKey keys={["shift", "/"]} />
    </div>
  ),
}

export const InContext: Story = {
  name: "Command list",
  render: () => (
    <div className="w-[360px] bg-white p-4">
      {[
        { label: "Search", keys: ["command", "K"] },
        { label: "New chat", keys: ["command", "N"] },
        { label: "Shortcut help", keys: ["shift", "/"] },
        { label: "Close", keys: ["ESC"] },
      ].map((row) => (
        <div key={row.label} className="flex h-9 items-center justify-between border-b border-black/[0.09] text-[14px] last:border-b-0">
          <span>{row.label}</span>
          <ShortcutKey keys={row.keys} />
        </div>
      ))}
    </div>
  ),
}