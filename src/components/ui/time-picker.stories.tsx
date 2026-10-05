"use client"

import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { TimePicker } from "./time-picker"
import type { TimeValue } from "@/lib/datetime"

const meta: Meta = {
  title: "Primitives/TimePicker",
  parameters: { layout: "centered" },
}

export default meta

function TimeDemo() {
  const [value, setValue] = React.useState<TimeValue>({ hour: 9, minute: 30 })
  return (
    <div className="w-[280px] bg-[var(--oreo-bg-base)] p-6">
      <TimePicker value={value} onValueChange={setValue} />
    </div>
  )
}

export const Popover: StoryObj = {
  render: () => <TimeDemo />,
}
