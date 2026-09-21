"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { Paperclip } from "lucide-react"

import { IconButton } from "./icon-button"

const meta: Meta<typeof IconButton> = {
  title: "Primitives/IconButton",
  component: IconButton,
}

export default meta
type Story = StoryObj<typeof IconButton>

const variants = ["primary", "secondary", "ghost"] as const
const statuses = ["default", "hover", "press"] as const

export const FigmaMatrix: Story = {
  name: "Type x Shape x Status x Disabled x Floating",
  render: () => (
    <div className="inline-flex flex-col gap-6 bg-white p-7">
      {statuses.map((status) => (
        <div key={status} className="flex items-center gap-8">
          {variants.map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <IconButton variant={variant} shape="rounded" status={status} aria-label="Attach file" icon={<Paperclip className="size-4" />} />
              <IconButton variant={variant} shape="rectangle" status={status} aria-label="Attach file" icon={<Paperclip className="size-4" />} />
            </div>
          ))}
          <IconButton variant="secondary" shape="rounded" floating status={status} aria-label="Attach file" icon={<Paperclip className="size-4" />} />
        </div>
      ))}
      <div className="flex items-center gap-8">
        {variants.map((variant) => (
          <IconButton key={variant} variant={variant} disabled aria-label="Attach file" icon={<Paperclip className="size-4" />} />
        ))}
        <IconButton variant="primary" loading aria-label="Uploading" />
      </div>
    </div>
  ),
}

export const Loading: Story = {
  render: () => (
    <div className="flex items-center gap-4 bg-white p-8">
      {variants.map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <IconButton variant={variant} aria-label={`Send with ${variant}`} icon={<Paperclip className="size-4" />} />
          <IconButton variant={variant} loading aria-label={`Sending with ${variant}`} />
        </div>
      ))}
    </div>
  ),
}