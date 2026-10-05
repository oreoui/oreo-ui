"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import * as React from "react"
import { createPortal } from "react-dom"

import { cn } from "@/lib/cn"
import { useIsClient } from "@/lib/use-media-query"

type PopoverContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLElement | null>
}

const PopoverContext = React.createContext<PopoverContextValue | null>(null)

function usePopover() {
  const context = React.useContext(PopoverContext)
  if (!context) throw new Error("Popover components must be used within <Popover>")
  return context
}

export function Popover({
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const triggerRef = React.useRef<HTMLElement | null>(null)

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [controlledOpen, onOpenChange]
  )

  return <PopoverContext.Provider value={{ open, setOpen, triggerRef }}>{children}</PopoverContext.Provider>
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, onClick, children, ...props }, forwardedRef) => {
    const { open, setOpen, triggerRef } = usePopover()

    return (
      <button
        ref={(node) => {
          triggerRef.current = node
          if (typeof forwardedRef === "function") forwardedRef(node)
          else if (forwardedRef) forwardedRef.current = node
        }}
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        className={className}
        onClick={(event) => {
          onClick?.(event)
          setOpen(!open)
        }}
        {...props}
      >
        {children}
      </button>
    )
  }
)
PopoverTrigger.displayName = "PopoverTrigger"

export function PopoverContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open, setOpen, triggerRef } = usePopover()
  const reduceMotion = useReducedMotion()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const mounted = useIsClient()

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current
    const content = contentRef.current
    if (!trigger || !content) return
    const rect = trigger.getBoundingClientRect()
    const width = content.offsetWidth
    const height = content.offsetHeight
    let left = rect.left
    let top = rect.bottom + 8
    if (left + width > window.innerWidth - 8) left = window.innerWidth - width - 8
    if (left < 8) left = 8
    if (top + height > window.innerHeight - 8 && rect.top > height + 8) top = rect.top - height - 8
    content.style.top = `${top}px`
    content.style.left = `${left}px`
    content.style.visibility = "visible"
  }, [triggerRef])

  React.useLayoutEffect(() => {
    if (!open) return
    updatePosition()
  }, [open, updatePosition])

  React.useEffect(() => {
    if (!open) return
    updatePosition()
    let frame = 0
    function schedule() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updatePosition)
    }
    function onPointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return
      setOpen(false)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener("resize", schedule)
    window.addEventListener("scroll", schedule, true)
    window.addEventListener("mousedown", onPointerDown)
    window.addEventListener("touchstart", onPointerDown)
    window.addEventListener("keydown", onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("scroll", schedule, true)
      window.removeEventListener("mousedown", onPointerDown)
      window.removeEventListener("touchstart", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [open, setOpen, triggerRef, updatePosition])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={contentRef}
          role="dialog"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : 4 }}
          transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.2, 0, 0, 1] }}
          className={cn(
            "fixed z-[70] w-[280px] max-w-[calc(100vw-1rem)] rounded-[var(--oreo-radius-lg)] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] p-3 text-[var(--oreo-text-primary)] shadow-[var(--oreo-shadow-floating)]",
            className
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
