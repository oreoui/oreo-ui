"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import * as React from "react"

import { Loading } from "@/components/ui/loading"
import { cn } from "@/lib/cn"

/**
 * Figma "Button" (23:11448) — Variant x Status x Disabled x Danger.
 * 32px tall, 8px radius, 6/12 padding, 4px gap between 16px icons and the label.
 * Hover/press fills use the Interaction tokens so one class set resolves in both
 * themes, matching the Figma fill stacks (Hover/Press over the base colour).
 */
const buttonVariants = cva(
  "inline-flex h-[32px] oreo-clickable select-none items-center justify-center gap-1 whitespace-nowrap rounded-[8px] px-[12px] py-[6px] text-[14px] font-medium leading-[1.43] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--oreo-bg-inverse)] text-[var(--oreo-text-on-inverse)]",
        secondary: "border-[0.5px] border-[var(--oreo-border-default)] bg-[var(--oreo-bg-base)] text-[var(--oreo-text-primary)]",
        ghost: "bg-transparent text-[var(--oreo-text-primary)]",
      },
      status: {
        default: "",
        hover: "",
        press: "",
      },
      danger: {
        true: "bg-[var(--oreo-status-error)] text-[var(--oreo-text-on-inverse)]",
        false: "",
      },
      disabled: {
        true: "opacity-30",
        false: "",
      },
    },
    compoundVariants: [
      /* Live states. `enabled:` keeps hover/press off the disabled button, and the fill
         utilities layer over the base colour instead of replacing the elevation shadow. */
      { variant: "primary", status: "default", className: "enabled:hover:oreo-fill-hover-inverse enabled:active:oreo-fill-press-inverse" },
      { variant: "secondary", status: "default", className: "enabled:hover:oreo-fill-hover enabled:active:oreo-fill-press" },
      { variant: "ghost", status: "default", className: "enabled:hover:bg-[var(--oreo-interaction-hover)] enabled:active:bg-[var(--oreo-interaction-press)]" },
      { danger: true, status: "default", className: "enabled:hover:oreo-fill-hover-inverse enabled:active:oreo-fill-press-inverse" },

      /* Pinned states, for spec sheets that render a single Figma variant. */
      { variant: "primary", status: "hover", className: "bg-[var(--oreo-bg-inverse)] oreo-fill-hover-inverse" },
      { variant: "primary", status: "press", className: "bg-[var(--oreo-bg-inverse)] oreo-fill-press-inverse" },
      { variant: "primary", disabled: true, className: "border-[0.5px] border-[var(--oreo-border-default)] bg-[var(--oreo-bg-elevated)] text-[var(--oreo-text-disabled)] opacity-100" },

      { variant: "secondary", status: "hover", className: "bg-[var(--oreo-bg-base)] oreo-fill-hover" },
      { variant: "secondary", status: "press", className: "bg-[var(--oreo-bg-base)] oreo-fill-press" },

      { variant: "ghost", status: "hover", className: "bg-[var(--oreo-interaction-hover)]" },
      { variant: "ghost", status: "press", className: "bg-[var(--oreo-interaction-press)]" },

      { danger: true, status: "hover", className: "bg-[var(--oreo-status-error)] oreo-fill-hover-inverse" },
      { danger: true, status: "press", className: "bg-[var(--oreo-status-error)] oreo-fill-press-inverse" },
    ],
    defaultVariants: {
      variant: "secondary",
      status: "default",
      danger: false,
      disabled: false,
    },
  }
)

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "disabled" | "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  /** Replaces the leading icon with a spinner and blocks interaction. */
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, status, danger, disabled, loading = false, leadingIcon, trailingIcon, children, ...props }, ref) => {
    const reduceMotion = useReducedMotion()
    const inert = Boolean(disabled) || loading

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={inert || undefined}
        aria-busy={loading || undefined}
        whileTap={inert || reduceMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0 : 0.15, ease: [0.2, 0, 0, 1] }}
        className={cn(buttonVariants({ variant, status, danger, disabled: inert, className }))}
        {...props}
      >
        {loading ? (
          <Loading type="spin" size={16} label="Working" />
        ) : (
          leadingIcon && <span className="inline-flex size-4 shrink-0 items-center justify-center">{leadingIcon}</span>
        )}
        {children && <span className="truncate">{children}</span>}
        {trailingIcon && <span className="inline-flex size-4 shrink-0 items-center justify-center">{trailingIcon}</span>}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

/** Figma "Button Group" (57:12052) — a row of buttons sharing 8px spacing. */
export function ButtonGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="group" className={cn("inline-flex items-center gap-2", className)}>
      {children}
    </div>
  )
}