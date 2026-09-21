"use client"

import { ChevronDown, Menu, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"

/**
 * Figma "Top Nav Bar" (23:11825) — 1440x72, row gap 24, 36px side padding.
 * Logo = 24px logo Avatar + 17px/600 wordmark; nav items 14px/500 with the
 * selected one in Text/Primary and the rest in Text/Tertiary; actions are the
 * Secondary "English" button (trailing chevron) and the Primary "Sign in".
 */
const sections = ["Studio", "Templates", "Pricing"] as const

export type NavSection = (typeof sections)[number]

export interface AgentTopNavProps {
  activeSection?: NavSection
  onNavigate?: (section: NavSection) => void
  onSignIn?: () => void
  onLanguage?: () => void
}

export function AgentTopNav({ activeSection = "Studio", onNavigate, onSignIn, onLanguage }: AgentTopNavProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.25, ease: [0.2, 0, 0, 1] as const }

  function navigate(section: NavSection) {
    onNavigate?.(section)
    setMobileOpen(false)
  }

  return (
    <header className="relative z-20 w-full bg-[var(--oreo-bg-base)]">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-6 px-4 sm:px-9">
        <button
          type="button"
          className="oreo-clickable flex min-w-0 items-center gap-[6px] rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]"
          onClick={() => navigate("Studio")}
        >
          <Avatar type="logo" size={24} />
          <span className="truncate text-[17px] font-semibold tracking-[-0.01em]">OreoUI</span>
        </button>

        <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              aria-current={activeSection === section ? "page" : undefined}
              onClick={() => navigate(section)}
              className={`oreo-clickable text-[14px] font-medium leading-[1.43] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)] ${
                activeSection === section
                  ? "text-[var(--oreo-text-primary)]"
                  : "text-[var(--oreo-text-tertiary)] hover:text-[var(--oreo-text-primary)]"
              }`}
            >
              {section}
            </button>
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Button variant="secondary" trailingIcon={<ChevronDown className="size-4" />} onClick={onLanguage}>
            English
          </Button>
          <Button variant="primary" onClick={onSignIn}>
            Sign in
          </Button>
        </div>

        <IconButton
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          variant="ghost"
          className="ml-auto md:hidden"
          icon={mobileOpen ? <X size={20} /> : <Menu size={20} />}
          onClick={() => setMobileOpen((open) => !open)}
        />
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={transition}
            className="overflow-hidden border-t border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-base)] md:hidden"
          >
            <nav aria-label="Mobile primary" className="flex flex-col gap-2 px-4 py-4">
              {sections.map((section) => (
                <button
                  key={section}
                  type="button"
                  aria-current={activeSection === section ? "page" : undefined}
                  onClick={() => navigate(section)}
                  className={`oreo-clickable min-h-11 rounded-[10px] px-3 text-left text-[14px] font-medium ${
                    activeSection === section
                      ? "bg-[var(--oreo-interaction-hover)] text-[var(--oreo-text-primary)]"
                      : "text-[var(--oreo-text-tertiary)]"
                  }`}
                >
                  {section}
                </button>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-[var(--oreo-border-subtle)] pt-4">
                <Button variant="secondary" onClick={onLanguage}>English</Button>
                <Button variant="primary" onClick={onSignIn}>Sign in</Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/**
 * Figma "Header" (358:17810) — 48px content header: 14px/500 title plus a ghost
 * icon cap, 8/24 padding.
 */
export function AgentHeader({
  title,
  action,
  className,
}: {
  title: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex h-[48px] items-center gap-2 px-6 py-2 ${className ?? ""}`}>
      <span className="min-w-0 flex-1 truncate text-[14px] font-medium leading-[1.43]">{title}</span>
      {action}
    </div>
  )
}