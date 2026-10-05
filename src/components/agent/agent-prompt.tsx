"use client"

import { ArrowUp, AtSign, Paperclip } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { AgentModelSelect } from "@/components/agent/agent-model-select"
import { IconButton } from "@/components/ui/icon-button"
import { Loading } from "@/components/ui/loading"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import { cn } from "@/lib/cn"

export type PromptStatusPlacement = "none" | "header" | "footer"

export interface AgentPromptProps {
  defaultValue?: string
  placeholder?: string
  statusPlacement?: PromptStatusPlacement
  running?: boolean
  completedTasks?: number
  totalTasks?: number
  modelName?: string
  modelLogoSrc?: string
  onSubmit?: (value: string) => void
  onStop?: () => void
  onSelectModel?: () => void
  className?: string
}

function StatusBar({
  placement,
  running,
  completedTasks,
  totalTasks,
}: {
  placement: "header" | "footer"
  running: boolean
  completedTasks: number
  totalTasks: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 44 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "flex h-[44px] shrink-0 items-center gap-1.5 overflow-hidden bg-[var(--oreo-bg-elevated)] px-3.5",
        placement === "header"
          ? "border-b-[0.5px] border-[var(--oreo-border-subtle)]"
          : "border-t-[0.5px] border-[var(--oreo-border-subtle)]"
      )}
    >
      <Loading type="step" size={16} label={running ? "Agent is working" : "Tasks in progress"} />
      <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[1.43] text-[var(--oreo-text-primary)]">
        {completedTasks}/{totalTasks} tasks in progress
      </span>
    </motion.div>
  )
}

export function AgentPrompt({
  defaultValue = "",
  placeholder = "Type a prompt or press {key} for commands",
  statusPlacement = "none",
  running = false,
  completedTasks = 2,
  totalTasks = 4,
  modelName = "Opus 4.6",
  modelLogoSrc = "/assets/model-claude.svg",
  onSubmit,
  onStop,
  onSelectModel,
  className,
}: AgentPromptProps) {
  const [value, setValue] = React.useState(defaultValue)
  const hasStatus = statusPlacement !== "none"
  const [placeholderBefore, placeholderAfter] = placeholder.split("{key}")
  const showsCommandKey = placeholderAfter !== undefined
  const canSubmit = Boolean(value.trim()) && !running

  function submit() {
    const prompt = value.trim()
    if (!prompt || running) return
    onSubmit?.(prompt)
  }

  return (
    <div
      className={cn(
        "relative flex w-full max-w-[800px] flex-col overflow-hidden rounded-[var(--oreo-radius-lg)] border-[0.5px] border-[var(--oreo-border-default)] bg-[var(--oreo-bg-base)] shadow-[var(--oreo-shadow-default)]",
        className
      )}
    >
      <AnimatePresence initial={false}>
        {hasStatus && statusPlacement === "header" && (
          <StatusBar placement="header" running={running} completedTasks={completedTasks} totalTasks={totalTasks} />
        )}
      </AnimatePresence>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          submit()
        }}
        className="flex flex-col gap-3 p-3.5"
      >
        <div className="relative">
          <label className="sr-only" htmlFor="agent-prompt-input">Prompt</label>
          <textarea
            id="agent-prompt-input"
            rows={2}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                submit()
              }
            }}
            className="block min-h-[56px] w-full resize-none bg-transparent text-[14px] leading-[1.43] text-[var(--oreo-text-primary)] outline-none"
          />
          {!value && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-[6px] text-[14px] leading-[1.43] text-[var(--oreo-text-placeholder)]">
              <span className="truncate">{placeholderBefore.trimEnd()}</span>
              {showsCommandKey && <ShortcutKey keys="/" className="shrink-0" />}
              <span className="truncate">{placeholderAfter?.trimStart()}</span>
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <IconButton variant="secondary" aria-label="Attach file" icon={<Paperclip size={16} />} />
            <IconButton variant="secondary" aria-label="Mention item" icon={<AtSign size={16} />} />
          </div>
          <div className="flex items-center justify-end gap-3">
            <AgentModelSelect name={modelName} logoSrc={modelLogoSrc} onOpen={onSelectModel} />
            {running ? (
              <IconButton
                variant="primary"
                aria-label="Stop generating"
                icon={<span className="size-[10px] rounded-[1px] bg-[var(--oreo-text-on-inverse)]" />}
                onClick={onStop}
              />
            ) : (
              <IconButton
                variant="primary"
                aria-label="Submit prompt"
                disabled={!canSubmit}
                icon={<ArrowUp size={16} />}
                onClick={submit}
              />
            )}
          </div>
        </div>
      </form>

      <AnimatePresence initial={false}>
        {hasStatus && statusPlacement === "footer" && (
          <StatusBar placement="footer" running={running} completedTasks={completedTasks} totalTasks={totalTasks} />
        )}
      </AnimatePresence>
    </div>
  )
}
