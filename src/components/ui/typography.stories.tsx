"use client"

import type { Meta, StoryObj } from "@storybook/react"

import { Display, Eyebrow, Headline, Mono, Text } from "./typography"

const meta: Meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
}

export default meta

export const Scale: StoryObj = {
  render: () => (
    <div className="max-w-3xl bg-[var(--oreo-bg-base)] p-8">
      <Eyebrow>Display / Sans / Mono</Eyebrow>
      <Display className="mt-4">Rank the work that matters.</Display>
      <Headline className="mt-8">A headline in the display face</Headline>
      <Text className="mt-3">Body copy stays in the sans stack so controls stay easy to scan.</Text>
      <Mono className="mt-4 block">--font-display · --font-sans · --font-mono</Mono>
    </div>
  ),
}
