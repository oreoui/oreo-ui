"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { ArrowUpRight, MoreHorizontal } from "lucide-react"
import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { Tag } from "@/components/ui/tag"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card"

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Card>

export const Variants: Story = {
  name: "Elevation variants",
  render: () => (
    <div className="grid grid-cols-1 gap-6 p-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl">
      <Card variant="default">
        <CardHeader>
          <CardTitle size="sm">Default Surface</CardTitle>
          <CardDescription>White background with hairline border and subtle shadow.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] text-[var(--oreo-text-secondary)]">Standard card surface for everyday content modules.</p>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle size="sm">Elevated Surface</CardTitle>
          <CardDescription>#f9f9f9 surface matching toolbars and panels.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] text-[var(--oreo-text-secondary)]">Useful for secondary panels and sidebars.</p>
        </CardContent>
      </Card>

      <Card variant="floating">
        <CardHeader>
          <CardTitle size="sm">Floating Surface</CardTitle>
          <CardDescription>High elevation shadow for popovers and dialogs.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] text-[var(--oreo-text-secondary)]">Renders with 24px blur overlay shadow.</p>
        </CardContent>
      </Card>

      <Card variant="outline">
        <CardHeader>
          <CardTitle size="sm">Outline Surface</CardTitle>
          <CardDescription>Clean border with no shadow effect.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[13px] text-[var(--oreo-text-secondary)]">Crisp border for high density grid layouts.</p>
        </CardContent>
      </Card>
    </div>
  ),
}

export const InteractiveAgentCard: Story = {
  name: "Interactive agent card with footer",
  render: () => (
    <div className="flex flex-col gap-6 p-8 max-w-md w-full">
      <Card variant="default" interactive>
        <CardHeader
          action={<IconButton variant="ghost" aria-label="Card actions" icon={<MoreHorizontal size={18} />} />}
        >
          <div className="flex items-center gap-2 mb-1">
            <Avatar type="agent" agentArt="nova" size={28} />
            <Tag palette="purple">Autonomous Agent</Tag>
          </div>
          <CardTitle size="md">Architecture Synthesizer</CardTitle>
          <CardDescription>
            Continuously generates and verifies component layouts against design system tokens.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-[10px] bg-[var(--oreo-bg-elevated)] p-3 text-[13px]">
            <div className="flex justify-between font-mono text-[11px] text-[var(--oreo-text-tertiary)] mb-1">
              <span>Convergence</span>
              <span className="font-semibold text-[var(--oreo-text-primary)]">98.4%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
              <div className="h-full w-[98%] bg-[var(--oreo-status-success)] rounded-full" />
            </div>
          </div>
        </CardContent>

        <CardFooter divider>
          <span className="text-[12px] text-[var(--oreo-text-tertiary)]">Updated 2m ago</span>
          <Button variant="primary" trailingIcon={<ArrowUpRight size={14} />}>
            Open agent
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
}
