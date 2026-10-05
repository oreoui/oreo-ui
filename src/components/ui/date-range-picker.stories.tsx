"use client"

import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { DateRangePicker } from "./date-range-picker"
import type { DateRange } from "@/lib/datetime"

const meta: Meta = {
  title: "Primitives/DateRangePicker",
  parameters: { layout: "centered" },
}

export default meta

function DateDemo() {
  const [value, setValue] = React.useState<DateRange>({ from: null, to: null })
  return (
    <div className="w-[320px] bg-[var(--oreo-bg-base)] p-6">
      <DateRangePicker value={value} onValueChange={setValue} />
    </div>
  )
}

export const Modal: StoryObj = {
  render: () => <DateDemo />,
}
