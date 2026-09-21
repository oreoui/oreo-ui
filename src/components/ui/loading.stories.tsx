"use client"

import type { Meta, StoryObj } from "@storybook/react"

import { Loading, type LoadingType } from "./loading"

const meta: Meta<typeof Loading> = {
  title: "Primitives/Loading",
  component: Loading,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Loading>

const types: LoadingType[] = ["spin", "dot", "step", "progress"]

export const FigmaMatrix: Story = {
  name: "Type axis (Step, Spin, Dot, Progress)",
  render: () => (
    <div className="flex items-center gap-16 bg-white px-6 py-8">
      {types.map((type) => (
        <Loading key={type} type={type} size={20} label={`Loading — ${type}`} />
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6 bg-white p-8">
      {[12, 16, 20, 32, 48].map((size) => (
        <Loading key={size} type="spin" size={size} label={`Spin ${size}px`} />
      ))}
    </div>
  ),
}

export const WithLabel: Story = {
  render: () => (
    <div className="flex flex-col gap-4 bg-white p-8">
      <Loading type="spin" label="Working" showLabel />
      <Loading type="step" label="3 steps remaining" showLabel />
      <Loading type="progress" label="Uploading 62%" showLabel />
    </div>
  ),
}