"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/cn"
import { useIsClient } from "@/lib/use-media-query"

type DialogContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  titleId: string
  descriptionId: string
}

const DialogContext = React.createContext<DialogContextValue | null>(null)

function useDialog() {
  const context = React.useContext(DialogContext)
  if (!context) throw new Error("Dialog components must be used within <Dialog>")
  return context
}

export function Dialog({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = controlledOpen ?? uncontrolledOpen
  const titleId = React.useId()
  const descriptionId = React.useId()

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange]
  )

  return <DialogContext.Provider value={{ open, setOpen, titleId, descriptionId }}>{children}</DialogContext.Provider>
}

export function DialogContent({
  children,
  className,
  wide = false,
}: {
  children: React.ReactNode
  className?: string
  wide?: boolean
}) {
  const { open, setOpen, titleId, descriptionId } = useDialog()
  const reduceMotion = useReducedMotion()
  const panelRef = React.useRef<HTMLDivElement>(null)
  const mounted = useIsClient()

  React.useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const panel = panelRef.current
    const frame = window.requestAnimationFrame(() => panel?.focus())

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    function focusable(): HTMLElement[] {
      if (!panel) return []
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => element.tabIndex !== -1 && !element.hasAttribute("disabled"))
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault()
        setOpen(false)
        return
      }
      if (event.key !== "Tab" || !panel) return
      const items = focusable()
      if (items.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) return
      const active = document.activeElement
      const inside = active instanceof Node && panel.contains(active)
      if (event.shiftKey && (!inside || active === first || active === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (!inside || active === last || active === panel)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = originalOverflow
      document.removeEventListener("keydown", onKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, setOpen])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
          <motion.button
            type="button"
            tabIndex={-1}
            aria-label="Close dialog"
            className="absolute inset-0 bg-[var(--oreo-bg-scrim)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
            className={cn(
              "relative flex max-h-[min(92dvh,880px)] w-full flex-col overflow-hidden bg-[var(--oreo-bg-surface)] text-[var(--oreo-text-primary)] shadow-[var(--oreo-shadow-overlay)] outline-none",
              "relative z-[1] rounded-t-[var(--oreo-radius-xl)] sm:mx-4 sm:max-h-[min(88dvh,760px)] sm:rounded-[var(--oreo-radius-xl)]",
              wide ? "sm:w-[min(56rem,calc(100%-2rem))]" : "sm:w-[min(32rem,calc(100%-2rem))]",
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-start justify-between gap-4 px-4 pb-2 pt-4 sm:px-5 sm:pt-5", className)}>{children}</div>
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  const { titleId } = useDialog()
  return (
    <h2 id={titleId} className={cn("font-display text-[20px] font-medium leading-tight tracking-[-0.02em]", className)}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  const { descriptionId } = useDialog()
  return (
    <p id={descriptionId} className={cn("mt-1 text-[13px] leading-[1.45] text-[var(--oreo-text-secondary)]", className)}>
      {children}
    </p>
  )
}

export function DialogBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("min-h-0 flex-1 overflow-y-auto px-4 sm:px-5", className)}>{children}</div>
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col-reverse gap-2 border-t border-[var(--oreo-border-subtle)] px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-5", className)}>
      {children}
    </div>
  )
}

export function DialogClose({ className, label = "Close" }: { className?: string; label?: string }) {
  const { setOpen } = useDialog()
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => setOpen(false)}
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-[var(--oreo-radius-sm)] text-[var(--oreo-text-secondary)] oreo-clickable hover:bg-[var(--oreo-interaction-hover)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
        className
      )}
    >
      <X size={16} />
    </button>
  )
}
