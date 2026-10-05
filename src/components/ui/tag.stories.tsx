"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { Sparkles } from "lucide-react"
import * as React from "react"

import { Tag, type TagPalette } from "./tag"

const meta: Meta<typeof Tag> = {
  title: "Primitives/Tag",
  component: Tag,
}

export default meta
type Story = StoryObj<typeof Tag>

const palettes: TagPalette[] = ["default", "purple", "blue", "mint", "pink", "brown", "orange"]

export const FigmaMatrix: Story = {
  name: "Palette x Icon x Remove",
  render: () => (
    <div className="inline-flex flex-col gap-4 bg-white p-7">
      {palettes.map((palette) => (
        <div key={palette} className="flex items-center gap-4">
          <Tag palette={palette}>Property Tag</Tag>
          <Tag palette={palette} leadingIcon={<Sparkles className="size-4" />}>Property Tag</Tag>
          <Tag palette={palette} onRemove={() => undefined}>Property Tag</Tag>
          <Tag palette={palette} leadingIcon={<Sparkles className="size-4" />} onRemove={() => undefined}>Property Tag</Tag>
        </div>
      ))}
    </div>
  ),
}

export const RemovableList: Story = {
  name: "Removable filter list",
  render: () => <FilterList />
}

function FilterList() {
  const [filters, setFilters] = React.useState<TagPalette[]>(["mint", "purple", "orange"])

  return (
    <div className="flex min-h-[72px] flex-wrap items-center gap-2 bg-white p-8">
      {filters.map((palette) => (
        <Tag key={palette} palette={palette} leadingIcon={<Sparkles className="size-4" />} onRemove={() => setFilters((current) => current.filter((entry) => entry !== palette))}>
          {palette}
        </Tag>
      ))}
      {filters.length === 0 && (
        <button type="button" className="rounded-[var(--oreo-radius-sm)] bg-[#f9f9f9] px-3 py-1 text-[12px] text-[#646464]" onClick={() => setFilters(["mint", "purple", "orange"])}>
          Restore filters
        </button>
      )}
    </div>
  )
}