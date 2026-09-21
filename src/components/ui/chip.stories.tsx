"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { Sparkles } from "lucide-react"
import * as React from "react"

import { Chip } from "./chip"

const meta: Meta<typeof Chip> = {
  title: "Primitives/Chip",
  component: Chip,
}

export default meta
type Story = StoryObj<typeof Chip>

const statuses = ["default", "hover", "press"] as const

export const FigmaMatrix: Story = {
  name: "Selected x Disabled x Status",
  render: () => (
    <div className="inline-flex flex-col gap-5 bg-white p-7">
      {statuses.map((status) => (
        <div key={status} className="flex items-center gap-6">
          <Chip status={status} leadingIcon={<Sparkles className="size-4" />}>Make an App</Chip>
          <Chip status={status} selected leadingIcon={<Sparkles className="size-4" />}>Make an App</Chip>
        </div>
      ))}
      <div className="flex items-center gap-6">
        <Chip disabled leadingIcon={<Sparkles className="size-4" />}>Make an App</Chip>
        <Chip disabled selected leadingIcon={<Sparkles className="size-4" />}>Make an App</Chip>
      </div>
    </div>
  ),
}

const suggestions = ["Make an App", "Write a landing page", "Refactor this module", "Summarise a paper"]

export const SelectableSuggestions: Story = {
  name: "Selectable suggestions",
  render: () => <Suggestions />
}

function Suggestions() {
  const [active, setActive] = React.useState<string | null>(suggestions[0])

  return (
    <div className="flex flex-wrap gap-2 bg-white p-8">
      {suggestions.map((suggestion) => (
        <Chip
          key={suggestion}
          selected={active === suggestion}
          leadingIcon={<Sparkles className="size-4" />}
          onClick={() => setActive((current) => (current === suggestion ? null : suggestion))}
        >
          {suggestion}
        </Chip>
      ))}
    </div>
  )
}