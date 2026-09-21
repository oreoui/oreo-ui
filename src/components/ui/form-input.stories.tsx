"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { Mail, Globe } from "lucide-react"
import * as React from "react"
import {
  Input,
  Textarea,
  FormField,
  Switch,
  Checkbox,
} from "./form-input"

const meta: Meta = {
  title: "Primitives/FormInput",
  parameters: { layout: "centered" },
}

export default meta

function InputTypesDemo() {
  const [searchValue, setSearchValue] = React.useState("Autonomous agent")
  const [passwordValue, setPasswordValue] = React.useState("super-secret-key-123")

  return (
    <div className="flex w-[380px] flex-col gap-5 p-6 bg-[var(--oreo-bg-surface)]">
        {/* Search with interactive clear button */}
        <FormField label="Search Components" description="Type to filter the Oreo design library">
          <Input
            isSearch
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue("")}
            placeholder="Search library..."
          />
        </FormField>

        {/* Password with eye toggle */}
        <FormField label="API Secret Key" required description="Used to authenticate tool execution">
          <Input
            isPassword
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
            placeholder="Enter API key"
          />
        </FormField>

        {/* Leading icon */}
        <FormField label="Author Email">
          <Input
            type="email"
            leadingIcon={<Mail size={15} />}
            placeholder="developer@oreo.ai"
          />
        </FormField>

        {/* Trailing icon */}
        <FormField label="Production Domain">
          <Input
            type="text"
            trailingIcon={<Globe size={15} />}
            defaultValue="https://oreo-ui.dev"
          />
        </FormField>
      </div>
    )
  }

export const InputTypes: StoryObj = {
  name: "Input variations (Search, Password, Icons)",
  render: () => <InputTypesDemo />,
}

export const ValidationAndStates: StoryObj = {
  name: "Validation errors & disabled states",
  render: () => (
    <div className="flex w-[380px] flex-col gap-5 p-6 bg-[var(--oreo-bg-surface)]">
      {/* Error state */}
      <FormField
        label="Project Identifier"
        required
        error="Project name contains invalid characters. Use alphanumeric and dashes only."
      >
        <Input defaultValue="my invalid project $$" />
      </FormField>

      {/* Disabled state */}
      <FormField label="Read-only System ID" description="Assigned automatically by the workspace broker">
        <Input disabled defaultValue="proj_01J8K9X24N8Z" />
      </FormField>

      {/* Textarea with character count */}
      <FormField label="System Instructions" description="Prompt instructions loaded before every turn">
        <Textarea
          maxCharacters={200}
          defaultValue="You are a trusted, evidence-first design systems engineer for OreoUI."
        />
      </FormField>
    </div>
  ),
}

function SwitchesAndCheckboxesDemo() {
  const [streamEnabled, setStreamEnabled] = React.useState(true)
  const [auditLog, setAuditLog] = React.useState(false)

  return (
    <div className="flex w-[380px] flex-col gap-5 p-6 bg-[var(--oreo-bg-surface)]">
        <div className="flex flex-col gap-3">
          <h4 className="text-[13px] font-semibold text-[var(--oreo-text-primary)]">Agent Permissions</h4>
          <Switch
            checked={streamEnabled}
            onCheckedChange={setStreamEnabled}
            label="Enable token streaming"
          />
          <Switch
            checked={auditLog}
            onCheckedChange={setAuditLog}
            label="Save thought chains to audit log"
          />
          <Switch
            disabled
            checked={false}
            label="Allow unverified bash execution (Disabled)"
          />
        </div>

        <div className="border-t border-[var(--oreo-border-subtle)] pt-4 flex flex-col gap-3">
          <h4 className="text-[13px] font-semibold text-[var(--oreo-text-primary)]">Notifications</h4>
          <Checkbox defaultChecked label="Notify on tool failure" />
          <Checkbox defaultChecked={false} label="Email weekly design convergence summaries" />
          <Checkbox disabled defaultChecked label="Compliance logging (Enforced)" />
        </div>
      </div>
  )
}

export const SwitchesAndCheckboxes: StoryObj = {
  name: "Switches & Checkboxes",
  render: () => <SwitchesAndCheckboxesDemo />,
}
