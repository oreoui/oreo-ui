"use client"

import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import { AgentHeader, AgentTopNav, type NavSection } from "./agent-top-nav"
import { AgentModelSelect } from "./agent-model-select"
import { AgentPopup, AgentPopupCard } from "./agent-popup"
import { AgentPrompt } from "./agent-prompt"
import { AgentSidebar } from "./agent-sidebar"
import { Button } from "@/components/ui/button"

const meta: Meta = {
  title: "Agent components/Overview",
  parameters: { layout: "fullscreen" },
}

export default meta

function NavBarPlayground() {
  const [section, setSection] = React.useState<NavSection>("Studio")

  return (
    <div className="min-h-dvh bg-white">
      <AgentTopNav activeSection={section} onNavigate={setSection} onSignIn={() => undefined} onLanguage={() => undefined} />
      <AgentHeader title="The meaning of AI" />
    </div>
  )
}

function SideBarPlayground() {
  const [selected, setSelected] = React.useState("New chat")

  return (
    <div className="flex min-h-dvh bg-white">
      <AgentSidebar selectedItem={selected} onSelect={setSelected} />
      <main className="grid min-h-dvh flex-1 place-items-center p-6">
        <p className="text-[14px] text-[var(--oreo-text-secondary)]">{selected}</p>
      </main>
    </div>
  )
}

function PromptPlayground() {
  const [value, setValue] = React.useState("")
  const [running, setRunning] = React.useState(true)

  return (
    <div className="grid min-h-dvh place-items-center bg-[var(--oreo-bg-base)] p-6">
      <div className="flex w-full max-w-[800px] flex-col gap-10">
        <AgentPrompt onSubmit={(prompt) => { setValue(prompt); setRunning(true) }} />
        <AgentPrompt
          placeholder="Continue asking..."
          statusPlacement="header"
          running={running}
          onStop={() => setRunning(false)}
        />
        <AgentPrompt
          placeholder="Continue asking..."
          statusPlacement="footer"
          running={running}
          onStop={() => setRunning(false)}
        />
      </div>
      {value && <p className="sr-only" role="status">Queued {value}</p>}
    </div>
  )
}

function PopupPlayground() {
  const [modalOpen, setModalOpen] = React.useState(false)

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-[var(--oreo-bg-elevated)] p-6">
      <AgentPopupCard
        onDismiss={() => undefined}
        onLearnMore={() => undefined}
      />
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          Preview as modal dialog
        </Button>
      </div>
      <AgentPopup
        open={modalOpen}
        modal={true}
        onDismiss={() => setModalOpen(false)}
        onLearnMore={() => setModalOpen(false)}
      />
    </div>
  )
}

export const NavBar: StoryObj = { render: () => <NavBarPlayground /> }
export const SideBar: StoryObj = { render: () => <SideBarPlayground /> }
export const Prompt: StoryObj = { render: () => <PromptPlayground /> }
export const PopUp: StoryObj = { render: () => <PopupPlayground /> }
export const ModelSelect: StoryObj = {
  render: () => (
    <div className="flex items-center gap-4 bg-white p-8">
      <AgentModelSelect name="Opus 4.6" logoSrc="/assets/model-claude.svg" />
      <AgentModelSelect name="Opus 4.6" logoSrc="/assets/model-claude.svg" disabled />
    </div>
  ),
}
