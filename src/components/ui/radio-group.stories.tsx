"use client"

import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { RadioGroup, RadioGroupItem } from "./radio-group"

const meta: Meta = {
  title: "Primitives/RadioGroup",
  parameters: { layout: "centered" },
}

export default meta

function RadioDemo() {
  const [value, setValue] = React.useState("weekly")
  return (
    <div className="w-[360px] bg-[var(--oreo-bg-base)] p-6">
      <RadioGroup label="Check cadence" value={value} onValueChange={setValue}>
        <RadioGroupItem value="weekly" label="Weekly" description="One pass, kept for the record." />
        <RadioGroupItem value="daily" label="Daily queue" description="A short list, not an hourly crawl." />
        <RadioGroupItem value="paused" label="Paused" description="Unavailable on this plan." disabled />
      </RadioGroup>
    </div>
  )
}

export const Default: StoryObj = {
  render: () => <RadioDemo />,
}
