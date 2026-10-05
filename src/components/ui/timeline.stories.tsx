"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { Search, Terminal } from "lucide-react"
import * as React from "react"
import { Tag } from "@/components/ui/tag"
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelinePoint,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
} from "./timeline"

const meta: Meta<typeof Timeline> = {
  title: "Primitives/Timeline",
  component: Timeline,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Timeline>

export const AgentExecutionPlan: Story = {
  name: "Agent execution plan",
  render: () => (
    <div className="w-[520px] rounded-[var(--oreo-radius-lg)] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] p-6 shadow-[var(--oreo-shadow-default)]">
      <div className="mb-6 flex items-center justify-between border-b border-[var(--oreo-border-subtle)] pb-4">
        <div>
          <h3 className="text-[17px] font-semibold text-[var(--oreo-text-primary)]">Agent Reasoning Plan</h3>
          <p className="text-[13px] text-[var(--oreo-text-secondary)]">Automated task pipeline for OreoUI</p>
        </div>
        <Tag palette="mint">3/4 Steps</Tag>
      </div>

      <Timeline>
        {/* Step 1: Completed */}
        <TimelineItem status="completed">
          <TimelineConnector status="completed" />
          <TimelinePoint status="completed" />
          <TimelineContent>
            <TimelineTitle
              badge={<Tag palette="default">Analysis</Tag>}
              timestamp="0.4s"
            >
              Parse prompt intent & extract design nodes
            </TimelineTitle>
            <TimelineDescription>
              Scanned Figma node tree for component sets matching Button, Pop-up, and Sidebar.
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        {/* Step 2: Completed with custom icon */}
        <TimelineItem status="completed">
          <TimelineConnector status="completed" />
          <TimelinePoint status="completed" icon={<Search size={12} />} />
          <TimelineContent>
            <TimelineTitle
              badge={<Tag palette="blue">Inspection</Tag>}
              timestamp="1.2s"
            >
              Sample token dimensions and colors
            </TimelineTitle>
            <TimelineDescription>
              Retrieved 16 color tokens, 8 spacing scales, and stroke radii from Figma token catalog.
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>

        {/* Step 3: In-Progress with pulsating progress dot */}
        <TimelineItem status="in-progress">
          <TimelineConnector status="in-progress" />
          <TimelinePoint status="in-progress" />
          <TimelineContent>
            <TimelineTitle
              badge={<Tag palette="purple">Synthesizing</Tag>}
              timestamp="Active"
            >
              Generate component JSX & styles
            </TimelineTitle>
            <TimelineDescription>
              Writing single-element Framer Motion wrappers and verifying layout margins.
            </TimelineDescription>
            <div className="mt-2 rounded-[var(--oreo-radius-sm)] bg-[var(--oreo-bg-elevated)] p-2.5 font-mono text-[12px] text-[var(--oreo-text-secondary)]">
              <div className="flex items-center gap-1.5 text-[var(--oreo-text-tertiary)] mb-1">
                <Terminal size={12} />
                <span>Compiler output</span>
              </div>
              <p className="text-[var(--oreo-status-success)]">✓ Typechecked 6 component modules</p>
            </div>
          </TimelineContent>
        </TimelineItem>

        {/* Step 4: Pending */}
        <TimelineItem status="pending" isLast>
          <TimelinePoint status="pending" />
          <TimelineContent>
            <TimelineTitle timestamp="Queued">
              Run visual regression verification
            </TimelineTitle>
            <TimelineDescription>
              Take headless browser screenshots and confirm zero pixel clipping on buttons.
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
}

export const StateVariants: Story = {
  name: "State indicators",
  render: () => (
    <div className="flex gap-8 p-6 bg-white max-w-lg">
      <Timeline>
        <TimelineItem status="completed">
          <TimelineConnector status="completed" />
          <TimelinePoint status="completed" />
          <TimelineContent>
            <TimelineTitle>Completed state</TimelineTitle>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem status="in-progress">
          <TimelineConnector status="in-progress" />
          <TimelinePoint status="in-progress" />
          <TimelineContent>
            <TimelineTitle>In-progress with spinner</TimelineTitle>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem status="error">
          <TimelineConnector status="pending" />
          <TimelinePoint status="error" />
          <TimelineContent>
            <TimelineTitle>Error / Rejected state</TimelineTitle>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem status="pending" isLast>
          <TimelinePoint status="pending" />
          <TimelineContent>
            <TimelineTitle>Pending queue item</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
}
