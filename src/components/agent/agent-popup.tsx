"use client"

import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/cn"

export interface AgentPopupProps {
  open?: boolean
  /** When true, renders inside a centered backdrop dialog. When false, renders the card inline. */
  modal?: boolean
  onDismiss?: () => void
  onLearnMore?: () => void
  title?: string
  description?: string
  imageSrc?: string
  imageAlt?: string
  className?: string
}

/**
 * Figma "Pop-up" (782:28389) — Type=Banner.
 * 320px card, 16px radius, floating shadow. The top 180px is a Bg/Elevated panel holding a
 * 280px-wide image at a 20px inset (bleeding under the panel), faded into the panel and
 * closed by a 0.5px divider. Below: 17px/600 title, 14px description, then the Reversed
 * button group — Secondary "Dismiss" then Primary "Learn more".
 */
export function AgentPopupCard({
  onDismiss,
  onLearnMore,
  title = "Introducing Team function",
  description = "OreoUI now includes team collaboration. Invite your team members and build together.",
  imageSrc = "/assets/popup-banner.png",
  imageAlt = "",
  className,
}: Omit<AgentPopupProps, "open" | "modal">) {
  return (
    <article
      aria-labelledby="agent-popup-title"
      className={cn(
        "relative flex w-full max-w-[320px] flex-col overflow-hidden rounded-[16px] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] shadow-[var(--oreo-shadow-floating)]",
        className
      )}
    >
      <div className="relative h-[180px] overflow-hidden border-b-[0.5px] border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] p-5">
        <div className="relative h-[179px] w-full overflow-hidden rounded-[8px] shadow-[0px_2px_8px_rgba(0,0,0,0.06)]">
          <Image src={imageSrc} alt={imageAlt} fill sizes="280px" priority className="object-cover object-top" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[var(--oreo-bg-elevated)] to-transparent opacity-90" />
      </div>

      <div className="flex flex-col gap-5 p-5 pt-4">
        <div className="flex flex-col gap-2">
          <h2 id="agent-popup-title" className="text-[17px] font-semibold leading-snug tracking-[-0.01em] text-[var(--oreo-text-primary)]">
            {title}
          </h2>
          <p className="text-[14px] leading-[1.43] text-[var(--oreo-text-secondary)]">
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onDismiss}>
            Dismiss
          </Button>
          <Button variant="primary" onClick={onLearnMore}>
            Learn more
          </Button>
        </div>
      </div>
    </article>
  )
}

export function AgentPopup({
  open = true,
  modal = true,
  onDismiss,
  onLearnMore,
  title,
  description,
  imageSrc,
  imageAlt,
  className,
}: AgentPopupProps) {
  const reduceMotion = useReducedMotion()
  const dialogRef = React.useRef<HTMLDivElement | null>(null)
  const restoreFocusRef = React.useRef<HTMLElement | null>(null)
  const transition = { duration: reduceMotion ? 0 : 0.25, ease: [0.2, 0, 0, 1] as const }

  // Modal only: move focus into the dialog, keep Tab inside it, and hand focus back to
  // whatever opened it. An inline card claims none of this.
  React.useEffect(() => {
    if (!open || !modal) return
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const dialog = dialogRef.current
    const focusables = dialog?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    focusables?.[0]?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onDismiss?.()
        return
      }
      if (event.key !== "Tab" || !dialog) return

      const items = Array.from(
        dialog.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((item) => !item.hasAttribute("disabled"))
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      restoreFocusRef.current?.focus()
    }
  }, [open, modal, onDismiss])

  if (!modal) {
    return (
      <AgentPopupCard
        title={title}
        description={description}
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        onDismiss={onDismiss}
        onLearnMore={onLearnMore}
        className={className}
      />
    )
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Dismiss popup"
            className="oreo-clickable absolute inset-0 bg-[var(--oreo-bg-scrim)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            onClick={onDismiss}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="agent-popup-title"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={transition}
            className="relative z-10"
          >
            <AgentPopupCard
              title={title}
              description={description}
              imageSrc={imageSrc}
              imageAlt={imageAlt}
              onDismiss={onDismiss}
              onLearnMore={onLearnMore}
              className={className}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}