"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { ChevronDown, Copy, Edit3, Trash2, UserPlus, Settings, LogOut, Sparkles } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownGroup,
  DropdownLabel,
  DropdownSeparator,
} from "./dropdown"

const meta: Meta<typeof Dropdown> = {
  title: "Primitives/Dropdown",
  component: Dropdown,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Dropdown>
function InteractiveMenuDemo() {
  const [actionState, setActionState] = React.useState<string>("None")
  const [isLoading, setIsLoading] = React.useState(false)

  const simulateAsync = (action: string) => {
    setActionState(action)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Dropdown closeOnSelect={false}>
        <DropdownTrigger asChild>
          <Button variant="secondary" trailingIcon={<ChevronDown size={14} />}>
            Agent Actions
          </Button>
        </DropdownTrigger>

        <DropdownContent width={240}>
          <DropdownGroup>
            <DropdownLabel>Model & Reasoning</DropdownLabel>
            <DropdownItem
              leadingIcon={<Sparkles size={16} />}
              shortcut={["command", "R"]}
              onSelect={() => setActionState("Synthesizing")}
            >
              Synthesize plan
            </DropdownItem>
            <DropdownItem
              leadingIcon={<Copy size={16} />}
              shortcut={["command", "C"]}
              onSelect={() => setActionState("Copied link")}
            >
              Copy link
            </DropdownItem>
          </DropdownGroup>

          <DropdownSeparator />

          <DropdownGroup>
            <DropdownLabel>Collaboration</DropdownLabel>
            <DropdownItem
              leadingIcon={<UserPlus size={16} />}
              onSelect={() => setActionState("Inviting team")}
            >
              Invite members
            </DropdownItem>
            {/* Inherits Button loading state */}
            <DropdownItem
              leadingIcon={<Edit3 size={16} />}
              loading={isLoading}
              onSelect={() => simulateAsync("Generating patch")}
            >
              {isLoading ? "Generating patch..." : "Generate patch"}
            </DropdownItem>
            {/* Inherits Button disabled state */}
            <DropdownItem
              leadingIcon={<Settings size={16} />}
              disabled
              shortcut={["command", ","]}
            >
              Advanced settings
            </DropdownItem>
          </DropdownGroup>

          <DropdownSeparator />

          <DropdownGroup>
            <DropdownItem
              variant="danger"
              leadingIcon={<Trash2 size={16} />}
              shortcut={["backspace"]}
              onSelect={() => setActionState("Deleted chat")}
            >
              Delete thread
            </DropdownItem>
          </DropdownGroup>
        </DropdownContent>
      </Dropdown>

      <p className="font-mono text-[12px] text-[var(--oreo-text-tertiary)]">
        Last action: <span className="font-semibold text-[var(--oreo-text-primary)]">{actionState}</span>
      </p>
    </div>
  )
}

export const InteractiveMenu: Story = {
  name: "Interactive menu with button states",
  render: () => <InteractiveMenuDemo />,
}

export const ViewportCollisionFlipping: Story = {
  name: "Auto-repositioning collision test",
  parameters: { layout: "fullscreen" },
  render: () => {
    return (
      <div className="relative flex h-screen min-h-[500px] w-full flex-col justify-between p-6">
        {/* Top edge: opens downward */}
        <div className="flex justify-between">
          <Dropdown align="start">
            <DropdownTrigger asChild>
              <Button variant="secondary" trailingIcon={<ChevronDown size={14} />}>
                Top Left (Opens Down)
              </Button>
            </DropdownTrigger>
            <DropdownContent width={200}>
              <DropdownItem leadingIcon={<Sparkles size={16} />}>Option A</DropdownItem>
              <DropdownItem leadingIcon={<Settings size={16} />}>Option B</DropdownItem>
            </DropdownContent>
          </Dropdown>

          <Dropdown align="end">
            <DropdownTrigger asChild>
              <Button variant="secondary" trailingIcon={<ChevronDown size={14} />}>
                Top Right (Clamps to edge)
              </Button>
            </DropdownTrigger>
            <DropdownContent width={200}>
              <DropdownItem leadingIcon={<Sparkles size={16} />}>Option A</DropdownItem>
              <DropdownItem leadingIcon={<Settings size={16} />}>Option B</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>

        {/* Bottom edge: auto-flips upward */}
        <div className="flex justify-between">
          <Dropdown align="start">
            <DropdownTrigger asChild>
              <Button variant="primary" trailingIcon={<ChevronDown size={14} />}>
                Bottom Left (Flips Upward)
              </Button>
            </DropdownTrigger>
            <DropdownContent width={220}>
              <DropdownItem leadingIcon={<Sparkles size={16} />}>Auto flipped up</DropdownItem>
              <DropdownItem leadingIcon={<Settings size={16} />}>Sub-option 2</DropdownItem>
              <DropdownSeparator />
              <DropdownItem variant="danger" leadingIcon={<LogOut size={16} />}>Exit</DropdownItem>
            </DropdownContent>
          </Dropdown>

          <Dropdown align="end">
            <DropdownTrigger asChild>
              <Button variant="primary" trailingIcon={<ChevronDown size={14} />}>
                Bottom Right (Flips Up + Clamps)
              </Button>
            </DropdownTrigger>
            <DropdownContent width={220}>
              <DropdownItem leadingIcon={<Sparkles size={16} />}>Auto flipped up</DropdownItem>
              <DropdownItem leadingIcon={<Settings size={16} />}>Sub-option 2</DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    )
  },
}
