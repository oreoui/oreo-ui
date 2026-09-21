"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { Paperclip, Trash2 } from "lucide-react"

import { Button } from "./button"

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
}

export default meta
type Story = StoryObj<typeof Button>

const variants = ["primary", "secondary", "ghost"] as const
const statuses = ["default", "hover", "press"] as const

export const FigmaMatrix: Story = {
  name: "Type x Status x Disabled x Danger",
  render: () => (
    <div className="inline-flex flex-col gap-5 bg-white p-7">
      {statuses.map((status) => (
        <div key={status} className="flex items-center gap-8">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} status={status} leadingIcon={<Paperclip className="size-4" />}>
              Button
            </Button>
          ))}
          <Button variant="primary" danger status={status} leadingIcon={<Paperclip className="size-4" />}>
            Button
          </Button>
        </div>
      ))}
      <div className="flex items-center gap-8">
        {variants.map((variant) => (
          <Button key={variant} variant={variant} disabled leadingIcon={<Paperclip className="size-4" />}>
            Button
          </Button>
        ))}
        <Button variant="primary" danger disabled leadingIcon={<Paperclip className="size-4" />}>
          Button
        </Button>
      </div>
    </div>
  ),
}

export const States: Story = {
  name: "Idle, loading, disabled",
  render: () => (
    <div className="flex flex-col gap-4 bg-white p-8">
      {variants.map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <Button variant={variant} leadingIcon={<Paperclip className="size-4" />}>Generate</Button>
          <Button variant={variant} loading>Generate</Button>
          <Button variant={variant} disabled leadingIcon={<Paperclip className="size-4" />}>Generate</Button>
          <Button variant={variant} danger leadingIcon={<Trash2 className="size-4" />}>Delete</Button>
        </div>
      ))}
    </div>
  ),
}

export const WithIcons: Story = {
  name: "Leading, trailing, text-only",
  render: () => (
    <div className="flex items-center gap-4 bg-white p-8">
      <Button variant="primary" leadingIcon={<Paperclip className="size-4" />}>Attach</Button>
      <Button variant="secondary" trailingIcon={<Trash2 className="size-4" />}>Remove</Button>
      <Button variant="secondary" leadingIcon={<Paperclip className="size-4" />} trailingIcon={<Trash2 className="size-4" />}>Both</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  ),
}