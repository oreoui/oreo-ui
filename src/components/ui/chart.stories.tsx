"use client"

import type { Meta, StoryObj } from "@storybook/react"

import { communityGrowth, trafficShare, visibilityTrend } from "@/lib/sample-metrics"
import { CompareBarChart, ShareDonutChart, TrendAreaChart } from "./chart"

const meta: Meta = {
  title: "Primitives/Charts",
  parameters: { layout: "padded" },
}

export default meta

export const Area: StoryObj = {
  render: () => (
    <div className="max-w-xl bg-[var(--oreo-bg-base)] p-6">
      <TrendAreaChart data={visibilityTrend} xKey="week" yReversed series={[{ key: "you", label: "You" }, { key: "rival", label: "Rival" }]} />
    </div>
  ),
}

export const Bars: StoryObj = {
  render: () => (
    <div className="max-w-xl bg-[var(--oreo-bg-base)] p-6">
      <CompareBarChart data={communityGrowth} xKey="month" series={[{ key: "projects", label: "Projects" }, { key: "members", label: "Members" }]} />
    </div>
  ),
}

export const Donut: StoryObj = {
  render: () => (
    <div className="max-w-xl bg-[var(--oreo-bg-base)] p-6">
      <ShareDonutChart data={trafficShare} />
    </div>
  ),
}
