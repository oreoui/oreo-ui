"use client"

import { ChevronDown, ChevronRight, Copy, Check, RotateCcw } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { Avatar, type AgentArt } from "@/components/ui/avatar"
import { IconButton } from "@/components/ui/icon-button"
import { Loading } from "@/components/ui/loading"
import { Markdown } from "@/components/ui/markdown"
import { Tag } from "@/components/ui/tag"
import { cn } from "@/lib/cn"

/* ------------------------------------------------------------------ *
 * Collapsible Thought Chain (Agent Reasoning)
 * ------------------------------------------------------------------ */

export interface ThoughtChainProps {
  thoughts: string
  thinking?: boolean
  durationSeconds?: number
  defaultExpanded?: boolean
  className?: string
}

export function ThoughtChain({
  thoughts,
  thinking = false,
  durationSeconds,
  defaultExpanded = false,
  className,
}: ThoughtChainProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded || thinking)
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={cn(
        "my-3 overflow-hidden rounded-[var(--oreo-radius-md)] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] text-[13px]",
        className
      )}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="oreo-clickable flex w-full items-center gap-2 px-3.5 py-2.5 text-left font-medium text-[var(--oreo-text-secondary)] transition-colors hover:bg-[var(--oreo-interaction-hover)]"
      >
        {thinking ? (
          <Loading type="spin" size={14} className="text-[var(--oreo-status-progress)]" />
        ) : (
          <span className="grid size-4 place-items-center text-[var(--oreo-status-success)]">
            <Check size={12} strokeWidth={3} />
          </span>
        )}

        <span className="truncate">
          {thinking ? "Thinking..." : durationSeconds ? `Thought for ${durationSeconds}s` : "Reasoning process"}
        </span>

        <span className="ml-auto text-[var(--oreo-text-tertiary)]">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
          >
            <div className="border-t border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] p-3.5 font-mono text-[12px] leading-[1.6] text-[var(--oreo-text-secondary)] whitespace-pre-wrap">
              {thoughts}
              {thinking && <span className="animate-pulse ml-0.5">▍</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Chat Message
 * ------------------------------------------------------------------ */

export interface ChatMessageProps {
  id?: string
  role: "user" | "assistant" | "system"
  authorName?: string
  agentArt?: AgentArt
  avatarSrc?: string
  content?: string
  children?: React.ReactNode
  timestamp?: string
  streaming?: boolean
  thoughtChain?: {
    thoughts: string
    thinking?: boolean
    durationSeconds?: number
  }
  tag?: string
  onRetry?: () => void
  onCopy?: () => void
  className?: string
}

export function ChatMessage({
  role,
  authorName,
  agentArt = "bloom",
  avatarSrc,
  content,
  children,
  timestamp,
  streaming = false,
  thoughtChain,
  tag,
  onRetry,
  onCopy,
  className,
}: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => undefined)
    }
    onCopy?.()
  }

  if (role === "system") {
    return (
      <div className={cn("my-4 flex justify-center text-center", className)}>
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] px-3 py-1 font-mono text-[11px] text-[var(--oreo-text-tertiary)]">
          {content || children}
        </span>
      </div>
    )
  }

  if (role === "user") {
    return (
      <div className={cn("my-4 flex justify-end gap-3", className)}>
        <div className="flex max-w-[85%] flex-col items-end gap-1 sm:max-w-[75%]">
          <div className="rounded-[var(--oreo-radius-lg)] bg-[var(--oreo-bg-inverse)] px-4 py-2.5 text-[14px] leading-[1.5] text-[var(--oreo-text-on-inverse)] shadow-sm">
            {content || children}
          </div>
          {timestamp && (
            <span className="font-mono text-[11px] text-[var(--oreo-text-tertiary)]">
              {timestamp}
            </span>
          )}
        </div>
      </div>
    )
  }

  // Assistant Message
  return (
    <div className={cn("group my-6 flex items-start gap-3.5", className)}>
      <Avatar
        type={avatarSrc ? "image" : "agent"}
        src={avatarSrc}
        agentArt={agentArt}
        size={32}
        alt={authorName || "OreoUI"}
        className="mt-0.5"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-semibold text-[var(--oreo-text-primary)]">
            {authorName || "OreoUI"}
          </span>
          {tag && <Tag palette="mint">{tag}</Tag>}
          {timestamp && (
            <span className="font-mono text-[11px] text-[var(--oreo-text-tertiary)]">
              {timestamp}
            </span>
          )}
        </div>

        {/* Optional Collapsible Thought Chain */}
        {thoughtChain && (
          <ThoughtChain
            thoughts={thoughtChain.thoughts}
            thinking={thoughtChain.thinking}
            durationSeconds={thoughtChain.durationSeconds}
          />
        )}

        {/* Message Content */}
        <div className="text-[14px] leading-[1.6] text-[var(--oreo-text-primary)]">
          {content ? <Markdown content={content} /> : children}
          {streaming && (
            <span aria-hidden="true" className="ml-1 inline-block h-4 w-1 animate-pulse bg-[var(--oreo-text-primary)] align-middle" />
          )}
        </div>

        {/* Message Action Toolbar */}
        {!streaming && (
          <div className="mt-1 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <IconButton
              variant="ghost"
              aria-label={copied ? "Copied" : "Copy response"}
              icon={copied ? <Check size={14} className="text-[var(--oreo-status-success)]" /> : <Copy size={14} />}
              onClick={handleCopy}
              className="size-[28px] text-[var(--oreo-text-tertiary)] hover:text-[var(--oreo-text-primary)]"
            />
            {onRetry && (
              <IconButton
                variant="ghost"
                aria-label="Retry response"
                icon={<RotateCcw size={14} />}
                onClick={onRetry}
                className="size-[28px] text-[var(--oreo-text-tertiary)] hover:text-[var(--oreo-text-primary)]"
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Chat Container
 * ------------------------------------------------------------------ */

export interface ChatContainerProps {
  children: React.ReactNode
  autoScroll?: boolean
  /**
   * Value that changes when new content should pull the viewport down. Defaults to the
   * message count, which is enough for append-only threads. Pass the streaming text length
   * (or a token counter) when you also want to follow in-place updates.
   */
  scrollKey?: string | number
  className?: string
}

export function ChatContainer({ children, autoScroll = true, scrollKey, className }: ChatContainerProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const pinnedRef = React.useRef(true)
  const frameRef = React.useRef(0)
  const key = scrollKey ?? React.Children.count(children)

  // Only auto-follow while the reader is already at the bottom; scrolling up to read
  // history must not be yanked back on the next token.
  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    pinnedRef.current = distanceFromBottom < 80
  }

  React.useEffect(() => {
    if (!autoScroll || !pinnedRef.current) return
    // One scroll per frame, not one per render: streaming re-renders far faster than paint.
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    })
    return () => cancelAnimationFrame(frameRef.current)
  }, [key, autoScroll])

  return (
    <div className={cn("mx-auto flex w-full max-w-3xl flex-col px-4 py-6 sm:px-6", className)}>
      <div ref={scrollRef} onScroll={handleScroll} className="flex flex-col">
        {children}
      </div>
    </div>
  )
}
