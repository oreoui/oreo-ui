"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * Figma "Chip" (23:13061) — Selected x Disabled x Status.
 * 36px tall, 8px radius, 12/8 padding, 6px gap, 16px icon, 14px label.
 * Selected swaps the hairline border for a 1px near-black border.
 */
const chipVariants = cva(
  "inline-flex h-[36px] oreo-clickable shrink-0 select-none items-center gap-[6px] whitespace-nowrap rounded-[8px] px-[12px] py-[8px] text-[14px] font-normal leading-[1.43] transition-[background-color,box-shadow,border-color] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
  {
    variants: {
      selected: {
        true: "border border-[rgba(0,0,0,0.87)] text-[var(--oreo-text-primary)]",
        false: "border-[0.5px] border-[var(--oreo-border-default)] text-[var(--oreo-text-secondary)]",
      },
      status: {
        default: "",
        hover: "",
        press: "",
      },
      disabled: {
        true: "opacity-30",
        false: "",
      },
    },
    compoundVariants: [
      /* Live states, see Button. Unselected hover lifts a shadow, selected hover darkens. */
      { selected: false, status: "default", className: "bg-[var(--oreo-bg-base)] enabled:hover:shadow-[var(--oreo-shadow-active)] enabled:active:oreo-fill-press" },
      { selected: true, status: "default", className: "bg-[var(--oreo-bg-base)] enabled:hover:oreo-fill-hover enabled:active:oreo-fill-press" },

      /* Pinned states, for spec sheets that render a single Figma variant. */
      { selected: false, status: "hover", className: "bg-[var(--oreo-bg-base)] shadow-[var(--oreo-shadow-active)]" },
      { selected: false, status: "press", className: "bg-[var(--oreo-bg-base)] oreo-fill-press" },
      { selected: true, status: "hover", className: "bg-[var(--oreo-bg-base)] oreo-fill-hover" },
      { selected: true, status: "press", className: "bg-[var(--oreo-bg-base)] oreo-fill-press" },

      { selected: true, disabled: true, className: "border-[var(--oreo-text-disabled)] text-[var(--oreo-text-disabled)]" },
      { selected: false, disabled: true, className: "text-[var(--oreo-text-tertiary)]" },
    ],
    defaultVariants: {
      selected: false,
      status: "default",
      disabled: false,
    },
  }
)

export interface ChipProps
  extends Omit<HTMLMotionProps<"button">, "disabled" | "children">,
    VariantProps<typeof chipVariants> {
  children?: React.ReactNode
  leadingIcon?: React.ReactNode
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected, status, disabled, leadingIcon, children, ...props }, ref) => {
    const reduceMotion = useReducedMotion()

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={disabled || undefined}
        aria-pressed={selected ?? undefined}
        whileTap={disabled || reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0 : 0.15, ease: [0.2, 0, 0, 1] }}
        className={cn(chipVariants({ selected, status, disabled, className }))}
        {...props}
      >
        {leadingIcon && <span className="inline-flex size-4 shrink-0 items-center justify-center">{leadingIcon}</span>}
        <span className="truncate">{children}</span>
      </motion.button>
    )
  }
)
Chip.displayName = "Chip"