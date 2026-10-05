"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import * as React from "react"

import { Loading } from "@/components/ui/loading"
import { cn } from "@/lib/cn"

/**
 * Figma "Icon Button" (23:11978) — Variant x Shape x Status x Disabled x Floating.
 * 32px square with a 20px icon box.
 */
const iconButtonVariants = cva(
  "inline-flex size-[32px] oreo-clickable shrink-0 select-none items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
  {
    variants: {
      variant: {
        primary: "bg-[var(--oreo-bg-inverse)] text-[var(--oreo-text-on-inverse)]",
        secondary: "border-[0.5px] border-[var(--oreo-border-default)] bg-[var(--oreo-bg-base)] text-[var(--oreo-text-primary)]",
        ghost: "bg-transparent text-[var(--oreo-text-primary)]",
      },
      shape: {
        rounded: "rounded-full",
        rectangle: "rounded-[var(--oreo-radius-sm)]",
      },
      floating: {
        true: "shadow-[var(--oreo-shadow-default)]",
        false: "",
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
      /* Live states, see Button. The floating hover elevation now coexists with the hover
         fill because the fill is a background-image layer, not an inset shadow. */
      { variant: "primary", status: "default", className: "enabled:hover:oreo-fill-hover-inverse enabled:active:oreo-fill-press-inverse" },
      { variant: "secondary", status: "default", className: "enabled:hover:oreo-fill-hover enabled:active:oreo-fill-press" },
      { variant: "ghost", status: "default", className: "enabled:hover:bg-[var(--oreo-interaction-hover)] enabled:active:bg-[var(--oreo-interaction-press)]" },
      { floating: true, status: "default", className: "enabled:hover:shadow-[var(--oreo-shadow-active)]" },

      /* Pinned states, for spec sheets that render a single Figma variant. */
      { variant: "primary", status: "hover", className: "bg-[var(--oreo-bg-inverse)] oreo-fill-hover-inverse" },
      { variant: "primary", status: "press", className: "bg-[var(--oreo-bg-inverse)] oreo-fill-press-inverse" },
      { variant: "primary", disabled: true, className: "border-[0.5px] border-[var(--oreo-border-default)] bg-[var(--oreo-bg-elevated)] text-[var(--oreo-text-disabled)] opacity-100" },

      { variant: "secondary", status: "hover", className: "bg-[var(--oreo-bg-base)] oreo-fill-hover" },
      { variant: "secondary", status: "press", className: "bg-[var(--oreo-bg-base)] oreo-fill-press" },

      { variant: "ghost", status: "hover", className: "bg-[var(--oreo-interaction-hover)]" },
      { variant: "ghost", status: "press", className: "bg-[var(--oreo-interaction-press)]" },

      { floating: true, status: "hover", className: "shadow-[var(--oreo-shadow-active)]" },
    ],
    defaultVariants: {
      variant: "secondary",
      shape: "rounded",
      floating: false,
      status: "default",
      disabled: false,
    },
  }
)

type IconButtonBase = Omit<HTMLMotionProps<"button">, "disabled" | "aria-label"> &
  VariantProps<typeof iconButtonVariants> & {
    /** Replaces the icon with a spinner and blocks interaction. */
    loading?: boolean
    /** Icon-only controls carry no text, so an accessible name is required. */
    "aria-label": string
  }

export type IconButtonProps = IconButtonBase &
  ({ loading: true; icon?: React.ReactNode } | { loading?: false; icon: React.ReactNode })

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, shape, floating, status, disabled, loading = false, icon, ...props }, ref) => {
    const reduceMotion = useReducedMotion()
    const inert = Boolean(disabled) || loading

    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={inert || undefined}
        aria-busy={loading || undefined}
        whileTap={inert || reduceMotion ? undefined : { scale: 0.94 }}
        transition={{ duration: reduceMotion ? 0 : 0.15, ease: [0.2, 0, 0, 1] }}
        className={cn(iconButtonVariants({ variant, shape, floating, status, disabled: inert, className }))}
        {...props}
      >
        <span className="inline-flex size-[20px] items-center justify-center">
          {loading ? <Loading type="spin" size={16} label={props["aria-label"]} /> : icon}
        </span>
      </motion.button>
    )
  }
)
IconButton.displayName = "IconButton"