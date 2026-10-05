"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * Figma "Tag" (666:3309) — Palette x Has Icon x Has Remove.
 * 24px tall, 8px radius, 12px semibold label, 16px icon.
 * Palette pairs resolve through --oreo-palette-* so tags re-derive for dark mode.
 * The remove control keeps a 24x24 hit target (WCAG 2.5.8) inside the 24px row.
 */
const palette = {
  default: "bg-[var(--oreo-palette-default-bg)] text-[var(--oreo-palette-default-text)]",
  purple: "bg-[var(--oreo-palette-purple-bg)] text-[var(--oreo-palette-purple-text)]",
  blue: "bg-[var(--oreo-palette-blue-bg)] text-[var(--oreo-palette-blue-text)]",
  mint: "bg-[var(--oreo-palette-mint-bg)] text-[var(--oreo-palette-mint-text)]",
  pink: "bg-[var(--oreo-palette-pink-bg)] text-[var(--oreo-palette-pink-text)]",
  brown: "bg-[var(--oreo-palette-brown-bg)] text-[var(--oreo-palette-brown-text)]",
  orange: "bg-[var(--oreo-palette-orange-bg)] text-[var(--oreo-palette-orange-text)]",
} as const

export type TagPalette = keyof typeof palette

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  palette?: TagPalette
  leadingIcon?: React.ReactNode
  onRemove?: () => void
  /** Accessible name for the remove control. */
  removeLabel?: string
  children: React.ReactNode
}

export function Tag({ palette: tone = "default", leadingIcon, onRemove, removeLabel, children, className, ...props }: TagProps) {
  const reduceMotion = useReducedMotion()

  const label = removeLabel ?? `Remove ${typeof children === "string" ? children : "tag"}`

  return (
    <span
      className={cn(
        "inline-flex h-[24px] min-w-[24px] select-none items-center justify-center gap-[2px] whitespace-nowrap rounded-[var(--oreo-radius-sm)] text-[12px] font-semibold leading-[1.33]",
        leadingIcon ? "py-[2px] pl-[6px]" : "py-[2px] pl-[8px]",
        onRemove ? "pr-0" : "pr-[8px]",
        palette[tone],
        className
      )}
      {...props}
    >
      {leadingIcon && <span className="inline-flex size-4 shrink-0 items-center justify-center">{leadingIcon}</span>}
      <span className="truncate">{children}</span>
      <AnimatePresence initial={false}>
        {onRemove && (
          <motion.button
            type="button"
            aria-label={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={reduceMotion ? undefined : { opacity: 1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            transition={{ duration: reduceMotion ? 0 : 0.15, ease: [0.2, 0, 0, 1] }}
            onClick={onRemove}
            className="oreo-clickable inline-flex size-[24px] shrink-0 items-center justify-center rounded-[6px] transition-colors hover:bg-black/[0.08] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)] dark:hover:bg-white/[0.10]"
          >
            <X className="size-[11px]" />
          </motion.button>
        )}
      </AnimatePresence>
    </span>
  )
}