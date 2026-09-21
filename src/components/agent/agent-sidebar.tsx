"use client"

import { Code2, Folder, Image, Menu, MessageCircle, MoreHorizontal, PanelLeftClose, PanelLeftOpen, Search, Video, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/cn"

/**
 * Figma "Side Bar" (101:10856) — Active=True (260px) / Active=False (52px),
 * built from "List Item" (101:10834) and the footer user block.
 * `expanded` widths: 260 / 52, background Bg/Elevated, list gap 20, items 36px
 * tall with 10px radius, 8/10 padding, 6px gap, 20px leading icon, 14px label.
 */
const primaryGroup = [
  { label: "New chat", icon: MessageCircle },
  { label: "Search chats", icon: Search },
  { label: "Library", icon: Folder },
] as const

const secondaryGroup = [
  { label: "AI Video", icon: Video },
  { label: "AI images", icon: Image },
  { label: "Generate code", icon: Code2 },
] as const

const HISTORY = [
  "Give this photo a new life",
  "Tighten the onboarding copy",
  "Draft a launch checklist",
  "Summarise the research doc",
] as const

export interface AgentSidebarProps {
  defaultExpanded?: boolean
  selectedItem?: string
  onSelect?: (item: string) => void
  userName?: string
  accountLabel?: string
}

interface ListItemProps {
  label: string
  icon?: React.ComponentType<{ size?: number; className?: string }>
  active?: boolean
  expanded: boolean
  onSelect?: (item: string) => void
}

/** Figma "List Item": Hovered / Pressed reveal a trailing ⋯ cap. */
function ListItem({ label, icon: Icon, active, expanded, onSelect }: ListItemProps) {
  return (
    <button
      type="button"
      title={expanded ? undefined : label}
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect?.(label)}
      className={cn(
        "group flex h-[36px] w-full oreo-clickable items-center gap-[6px] rounded-[10px] py-2 text-left text-[14px] leading-[1.43] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
        expanded ? "px-[10px]" : "justify-center px-2",
        active
          ? "bg-[var(--oreo-interaction-press)] font-medium text-[var(--oreo-text-primary)]"
          : "text-[var(--oreo-text-primary)] hover:bg-[var(--oreo-interaction-hover)] active:bg-[var(--oreo-interaction-press)]"
      )}
    >
      {Icon && <Icon size={20} className="shrink-0" />}
      {expanded && (
        <>
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <MoreHorizontal
            size={20}
            aria-hidden="true"
            className="shrink-0 text-[var(--oreo-text-tertiary)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        </>
      )}
    </button>
  )
}

function SidebarBody({ expanded, selectedItem, onSelect, userName, accountLabel, onToggle }: {
  expanded: boolean
  selectedItem: string
  onSelect?: (item: string) => void
  userName: string
  accountLabel: string
  onToggle: () => void
}) {
  return (
    <>
      {/* Side Bar Navigation — 48px tall, avatar + ghost cap, 8/8/8/12 padding.
          Collapsed per Figma the cap is hidden, so it is revealed on hover/focus
          as an overlay to keep the rail expandable. */}
      <div className={cn("group/nav relative flex h-[48px] shrink-0 items-center gap-2 py-2 pr-3", expanded ? "pl-2" : "justify-center pl-2")}>
        <Avatar type="logo" size={26} />
        {expanded ? (
          <IconButton
            aria-label="Collapse sidebar"
            variant="ghost"
            shape="rectangle"
            className="ml-auto"
            icon={<PanelLeftClose size={20} />}
            onClick={onToggle}
          />
        ) : (
          <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover/nav:pointer-events-auto group-hover/nav:opacity-100 group-focus-within/nav:pointer-events-auto group-focus-within/nav:opacity-100">
            <IconButton
              aria-label="Expand sidebar"
              variant="ghost"
              shape="rectangle"
              className="bg-[var(--oreo-bg-base)] shadow-[var(--oreo-shadow-floating)]"
              icon={<PanelLeftOpen size={20} />}
              onClick={onToggle}
            />
          </span>
        )}
      </div>

      <nav aria-label="Workspace" className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-[6px] py-[6px]">
        <div className="flex flex-col">
          {primaryGroup.map((item) => (
            <ListItem key={item.label} {...item} expanded={expanded} active={selectedItem === item.label} onSelect={onSelect} />
          ))}
        </div>

        <div className="flex flex-col">
          {secondaryGroup.map((item) => (
            <ListItem key={item.label} {...item} expanded={expanded} active={selectedItem === item.label} onSelect={onSelect} />
          ))}
        </div>

        {expanded && (
          <div className="flex flex-col">
            <p className="flex h-[36px] items-center px-[10px] py-2 text-[14px] leading-[1.43] text-[var(--oreo-text-tertiary)]">History</p>
            {HISTORY.map((entry) => (
              <ListItem key={entry} label={entry} expanded active={selectedItem === entry} onSelect={onSelect} />
            ))}
          </div>
        )}
      </nav>

      {/* Side Bar Footer — 64px, Bg/Elevated, user row 24px avatar + name/account */}
      <div className={cn("flex h-[64px] shrink-0 items-center bg-[var(--oreo-bg-elevated)] px-[6px] py-2", expanded ? "justify-start" : "justify-center")}>
        <div className={cn("flex h-[48px] items-center gap-2 rounded-[10px] py-[6px]", expanded ? "w-full pl-[6px] pr-0" : "justify-center px-1")}>
          <Avatar type="initials" color="black" initials="NI" size={24} alt={userName} />
          {expanded && (
            <span className="flex min-w-0 flex-1 flex-col justify-center">
              <span className="truncate text-[14px] font-medium leading-[1.43]">{userName}</span>
              <span className="truncate text-[12px] leading-[1.33] text-[var(--oreo-text-tertiary)]">{accountLabel}</span>
            </span>
          )}
        </div>
      </div>
    </>
  )
}

export function AgentSidebar({
  defaultExpanded = true,
  selectedItem = "New chat",
  onSelect,
  userName = "Nicole",
  accountLabel = "Plus subscriber",
}: AgentSidebarProps) {
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.25, ease: [0.2, 0, 0, 1] as const }

  React.useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [])

  const body = (
    <SidebarBody
      expanded={expanded}
      selectedItem={selectedItem}
      onSelect={onSelect}
      userName={userName}
      accountLabel={accountLabel}
      onToggle={() => setExpanded((value) => !value)}
    />
  )

  return (
    <>
      <IconButton
        aria-label="Open workspace navigation"
        className="fixed left-4 top-4 z-20 shadow-[var(--oreo-shadow-floating)] md:hidden"
        icon={<Menu size={20} />}
        onClick={() => setMobileOpen(true)}
      />

      <motion.aside
        animate={{ width: expanded ? 260 : 52 }}
        transition={transition}
        className={cn(
          "hidden h-dvh shrink-0 flex-col bg-[var(--oreo-bg-elevated)] md:flex",
          expanded ? "border-r border-transparent" : "border-r-[0.5px] border-[var(--oreo-border-subtle)]"
        )}
      >
        {body}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close workspace navigation"
              className="fixed inset-0 z-30 bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Workspace navigation"
              className="fixed inset-y-0 left-0 z-40 flex w-[min(260px,calc(100vw-32px))] flex-col border-r-[0.5px] border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] shadow-[var(--oreo-shadow-overlay)]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={transition}
            >
              <div className="absolute right-2 top-2 z-10">
                <IconButton aria-label="Close workspace navigation" variant="ghost" icon={<X size={20} />} onClick={() => setMobileOpen(false)} />
              </div>
              <SidebarBody
                expanded
                selectedItem={selectedItem}
                onSelect={(item) => {
                  onSelect?.(item)
                  setMobileOpen(false)
                }}
                userName={userName}
                accountLabel={accountLabel}
                onToggle={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}