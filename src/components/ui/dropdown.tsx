"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Check } from "lucide-react"
import * as React from "react"

import { Loading } from "@/components/ui/loading"
import { ShortcutKey } from "@/components/ui/shortcut-key"
import { cn } from "@/lib/cn"

/* ------------------------------------------------------------------ *
 * Context & Positioning
 * ------------------------------------------------------------------ */

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerElement: HTMLElement | null
  setTriggerElement: (el: HTMLElement | null) => void
  contentRef: React.RefObject<HTMLDivElement | null>
  coords: { top: number; left: number; placement: "bottom" | "top"; align: "start" | "end" | "center" }
  closeOnSelect: boolean
  updatePosition: () => void
  /** Set when the menu was opened from the keyboard, so the first item receives focus. */
  focusFirstOnOpenRef: React.RefObject<boolean>
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null)

function useDropdown() {
  const context = React.useContext(DropdownContext)
  if (!context) {
    throw new Error("Dropdown components must be used within a <Dropdown> provider")
  }
  return context
}

export interface DropdownProps {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  align?: "start" | "end" | "center"
  sideOffset?: number
  closeOnSelect?: boolean
}

export function Dropdown({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  align = "start",
  sideOffset = 6,
  closeOnSelect = true,
}: DropdownProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null)
  const focusFirstOnOpenRef = React.useRef(false)
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  const [coords, setCoords] = React.useState<{
    top: number
    left: number
    placement: "bottom" | "top"
    align: "start" | "end" | "center"
  }>({
    top: 0,
    left: 0,
    placement: "bottom",
    align,
  })

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange]
  )

  // Auto-repositioning collision detection
  const updatePosition = React.useCallback(() => {
    const trigger = triggerElement
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const content = contentRef.current
    const menuWidth = content ? content.offsetWidth : 220
    const menuHeight = content ? content.offsetHeight : 180

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // Check vertical space (flip to top if bottom overflows)
    const spaceBelow = viewportHeight - rect.bottom
    const spaceAbove = rect.top
    let placement: "bottom" | "top" = "bottom"
    let top = rect.bottom + sideOffset

    if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
      placement = "top"
      top = Math.max(8, rect.top - menuHeight - sideOffset)
    }

    // Check horizontal alignment
    let left = rect.left
    if (align === "end") {
      left = rect.right - menuWidth
    } else if (align === "center") {
      left = rect.left + rect.width / 2 - menuWidth / 2
    }

    // Clamp horizontally to stay inside viewport padding (8px)
    if (left + menuWidth > viewportWidth - 8) {
      left = viewportWidth - menuWidth - 8
    }
    if (left < 8) {
      left = 8
    }

    setCoords({ top, left, placement, align })
  }, [align, sideOffset, triggerElement])

  React.useEffect(() => {
    if (!open) return
    updatePosition()

    // Scroll/resize fire far faster than paint, and updatePosition reads layout. Coalesce
    // reads into one per frame so the handler cannot thrash layout during a scroll.
    let frame = 0
    function schedulePosition() {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updatePosition)
    }

    function handlePointerDownOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node
      if (
        triggerElement?.contains(target) ||
        contentRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    function menuItems(): HTMLElement[] {
      const content = contentRef.current
      if (!content) return []
      return Array.from(content.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'))
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false)
        triggerElement?.focus()
        return
      }

      // Menu semantics: arrows move between items, Home/End jump to the ends, and moving
      // into an open menu from the trigger lands on the first item.
      const items = menuItems()
      if (items.length === 0) return
      const active = document.activeElement
      const index = items.findIndex((item) => item === active)

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault()
        const delta = event.key === "ArrowDown" ? 1 : -1
        const nextIndex = index === -1 ? (delta === 1 ? 0 : items.length - 1) : (index + delta + items.length) % items.length
        items[nextIndex]?.focus()
        return
      }

      if (event.key === "Home") {
        event.preventDefault()
        items[0]?.focus()
        return
      }

      if (event.key === "End") {
        event.preventDefault()
        items[items.length - 1]?.focus()
        return
      }

      // Tabbing out of the menu closes it, matching native menu behaviour.
      if (event.key === "Tab") {
        setOpen(false)
      }
    }

    window.addEventListener("scroll", schedulePosition, true)
    window.addEventListener("resize", schedulePosition)
    window.addEventListener("mousedown", handlePointerDownOutside)
    window.addEventListener("touchstart", handlePointerDownOutside)
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedulePosition, true)
      window.removeEventListener("resize", schedulePosition)
      window.removeEventListener("mousedown", handlePointerDownOutside)
      window.removeEventListener("touchstart", handlePointerDownOutside)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, setOpen, updatePosition, triggerElement])

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen,
        triggerElement,
        setTriggerElement,
        contentRef,
        coords,
        closeOnSelect,
        updatePosition,
        focusFirstOnOpenRef,
      }}
    >
      {children}
    </DropdownContext.Provider>
  )
}

/* ------------------------------------------------------------------ *
 * Dropdown Trigger
 * ------------------------------------------------------------------ */

export interface DropdownTriggerProps {
  children: React.ReactNode
  asChild?: boolean
  className?: string
}

export const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(
  ({ children, asChild = false, className, ...props }, forwardedRef) => {
    const { open, setOpen, setTriggerElement, focusFirstOnOpenRef } = useDropdown()

    function openFromEvent(event: React.MouseEvent) {
      // detail === 0 marks a keyboard-activated click (Enter/Space on a button).
      focusFirstOnOpenRef.current = event.detail === 0
      setOpen(!open)
    }

    const handleRef = React.useCallback(
      (node: HTMLElement | null) => {
        setTriggerElement(node)
        if (typeof forwardedRef === "function") {
          forwardedRef(node as HTMLButtonElement)
        } else if (forwardedRef) {
          forwardedRef.current = node as HTMLButtonElement
        }
      },
      [forwardedRef, setTriggerElement]
    )

    if (asChild && React.isValidElement(children)) {
      const childProps = children.props
      const existingOnClick =
        typeof childProps === "object" && childProps !== null && "onClick" in childProps && typeof childProps.onClick === "function"
          ? (childProps.onClick as (e: React.MouseEvent) => void)
          : undefined

      return React.cloneElement(children, {
        ref: handleRef,
        "aria-haspopup": "menu",
        "aria-expanded": open,
        onClick: (event: React.MouseEvent) => {
          existingOnClick?.(event)
          openFromEvent(event)
        },
      } as React.HTMLAttributes<HTMLElement>)
    }

    return (
      <button
        ref={handleRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={openFromEvent}
        className={cn("inline-flex items-center", className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
DropdownTrigger.displayName = "DropdownTrigger"

/* ------------------------------------------------------------------ *
 * Dropdown Content (Floating Popover)
 * ------------------------------------------------------------------ */

export interface DropdownContentProps {
  children: React.ReactNode
  className?: string
  width?: number | string
}

export function DropdownContent({ children, className, width = "auto" }: DropdownContentProps) {
  const { open, contentRef, coords, updatePosition, focusFirstOnOpenRef } = useDropdown()
  const reduceMotion = useReducedMotion()

  React.useLayoutEffect(() => {
    if (!open) return
    updatePosition()

    // Keyboard opens move focus into the menu; pointer opens leave focus on the trigger.
    if (focusFirstOnOpenRef.current) {
      focusFirstOnOpenRef.current = false
      const first = contentRef.current?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])')
      first?.focus()
    }
  }, [open, updatePosition, contentRef, focusFirstOnOpenRef])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <motion.div
            ref={contentRef}
            role="menu"
            aria-orientation="vertical"
            initial={{ opacity: 0, scale: 0.96, y: coords.placement === "top" ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: coords.placement === "top" ? 6 : -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.2, 0, 0, 1] }}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              width,
            }}
            className={cn(
              "pointer-events-auto flex min-w-[180px] flex-col overflow-hidden rounded-[12px] border-[0.5px] border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] p-1.5 shadow-[var(--oreo-shadow-floating)]",
              className
            )}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ *
 * Dropdown Item (Inherits Button States: disabled, loading, variant)
 * ------------------------------------------------------------------ */

export interface DropdownItemProps {
  children: React.ReactNode
  variant?: "default" | "danger" | "ghost"
  /** Inherits Button disabled behavior */
  disabled?: boolean
  /** Inherits Button loading spinner and blocks interaction */
  loading?: boolean
  /** Leading icon slot */
  leadingIcon?: React.ReactNode
  /** Trailing icon slot */
  trailingIcon?: React.ReactNode
  /** Keyboard shortcut glyph or label */
  shortcut?: string | string[]
  /** Checked indicator state */
  checked?: boolean
  onSelect?: () => void
  className?: string
}

export function DropdownItem({
  children,
  variant = "default",
  disabled = false,
  loading = false,
  leadingIcon,
  trailingIcon,
  shortcut,
  checked,
  onSelect,
  className,
}: DropdownItemProps) {
  const { setOpen, closeOnSelect } = useDropdown()
  const inert = disabled || loading

  function handleClick() {
    if (inert) return
    onSelect?.()
    if (closeOnSelect) {
      setOpen(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      role={checked === undefined ? "menuitem" : "menuitemcheckbox"}
      type="button"
      disabled={inert || undefined}
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      aria-checked={checked}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group flex h-[34px] w-full oreo-clickable select-none items-center gap-2 rounded-[8px] px-2.5 text-left text-[14px] leading-[1.43] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
        variant === "default" && "text-[var(--oreo-text-primary)] enabled:hover:bg-[var(--oreo-interaction-hover)] enabled:active:bg-[var(--oreo-interaction-press)]",
        variant === "danger" && "text-[var(--oreo-status-error)] enabled:hover:bg-[var(--oreo-status-error-subtle)] enabled:active:bg-[var(--oreo-status-error-subtle)]",
        variant === "ghost" && "text-[var(--oreo-text-secondary)] enabled:hover:bg-[var(--oreo-interaction-hover)] enabled:hover:text-[var(--oreo-text-primary)]",
        className
      )}
    >
      {/* Icon / Loading Slot */}
      {loading ? (
        <Loading type="spin" size={16} label="Working" />
      ) : checked !== undefined ? (
        <span className="inline-flex size-4 shrink-0 items-center justify-center">
          {checked && <Check size={14} className="stroke-[2.5]" />}
        </span>
      ) : leadingIcon ? (
        <span className="inline-flex size-4 shrink-0 items-center justify-center text-[var(--oreo-text-secondary)] group-hover:text-current">
          {leadingIcon}
        </span>
      ) : null}

      <span className="min-w-0 flex-1 truncate">{children}</span>

      {/* Trailing Icon or Shortcut */}
      {trailingIcon && (
        <span className="inline-flex size-4 shrink-0 items-center justify-center text-[var(--oreo-text-secondary)]">
          {trailingIcon}
        </span>
      )}

      {shortcut && (
        <ShortcutKey keys={shortcut} className="ml-auto shrink-0" />
      )}
    </button>
  )
}

/* ------------------------------------------------------------------ *
 * Dropdown Group, Label, and Separator
 * ------------------------------------------------------------------ */

export function DropdownGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div role="group" className={cn("flex flex-col gap-0.5", className)}>{children}</div>
}

export function DropdownLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--oreo-text-tertiary)]", className)}>
      {children}
    </div>
  )
}

export function DropdownSeparator({ className }: { className?: string }) {
  return <div role="separator" aria-orientation="horizontal" className={cn("-mx-1.5 my-1 h-[0.5px] bg-[var(--oreo-border-subtle)]", className)} />
}
