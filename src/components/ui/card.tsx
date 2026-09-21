"use client"

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/cn"

/* ------------------------------------------------------------------ *
 * Card Root
 * ------------------------------------------------------------------ */

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode
  variant?: "default" | "elevated" | "floating" | "outline" | "ghost"
  padding?: "none" | "sm" | "md" | "lg"
  /** Enables hover elevation and active tap micro-interactions */
  interactive?: boolean
  className?: string
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  default: "border-[0.5px] border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] shadow-[var(--oreo-shadow-default)]",
  elevated: "border-[0.5px] border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] shadow-[var(--oreo-shadow-default)]",
  floating: "border-[0.5px] border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] shadow-[var(--oreo-shadow-floating)]",
  outline: "border border-[var(--oreo-border-default)] bg-[var(--oreo-bg-base)]",
  ghost: "bg-transparent border-0 shadow-none",
}

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "p-0",
  sm: "p-3",
  md: "p-5",
  lg: "p-6 sm:p-8",
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", padding = "md", interactive = false, className, onClick, onKeyDown, ...props }, ref) => {
    const reduceMotion = useReducedMotion()
    // Elevation only moves if the card actually does something; a hover-lift on a
    // non-interactive container is a lie, and a div that reacts to the mouse but not the
    // keyboard is an accessibility bug. So: clickable cards become real controls.
    const clickable = Boolean(onClick)
    const lifted = (interactive || clickable) && !reduceMotion

    function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
      onKeyDown?.(event)
      if (!onClick || event.defaultPrevented) return
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        event.currentTarget.click()
      }
    }

    return (
      <motion.div
        ref={ref}
        role={clickable ? "button" : undefined}
        tabIndex={clickable ? 0 : undefined}
        whileHover={lifted ? { y: -2 } : undefined}
        whileTap={clickable && !reduceMotion ? { scale: 0.99 } : undefined}
        transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.2, 0, 0, 1] }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative flex flex-col overflow-hidden rounded-[16px] text-[var(--oreo-text-primary)] transition-shadow",
          variantStyles[variant],
          paddingStyles[padding],
          clickable
            ? "oreo-clickable select-none hover:shadow-[var(--oreo-shadow-active)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]"
            : interactive
              ? "select-none hover:shadow-[var(--oreo-shadow-active)]"
              : undefined,
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
Card.displayName = "Card"

/* ------------------------------------------------------------------ *
 * Card Header, Title, Description, Content, Footer
 * ------------------------------------------------------------------ */

export function CardHeader({
  children,
  action,
  className,
}: {
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 pb-4", className)}>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardTitle({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizeClasses = {
    sm: "text-[15px] font-semibold leading-snug tracking-[-0.01em]",
    md: "text-[17px] font-semibold leading-normal tracking-[-0.01em]",
    lg: "text-[20px] font-semibold leading-tight tracking-[-0.02em]",
  }[size]

  return <h3 className={cn("truncate text-[var(--oreo-text-primary)]", sizeClasses, className)}>{children}</h3>
}

export function CardDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p className={cn("text-[14px] leading-[1.43] text-[var(--oreo-text-secondary)]", className)}>
      {children}
    </p>
  )
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("min-w-0 flex-1", className)}>{children}</div>
}

export function CardFooter({
  children,
  divider = false,
  className,
}: {
  children: React.ReactNode
  divider?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 pt-4",
        divider && "-mx-5 -mb-5 mt-4 border-t-[0.5px] border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] px-5 py-3",
        className
      )}
    >
      {children}
    </div>
  )
}
