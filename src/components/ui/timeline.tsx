"use client"

import { Check, AlertCircle } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { Loading } from "@/components/ui/loading"
import { cn } from "@/lib/cn"

export type TimelineStatus = "completed" | "in-progress" | "pending" | "error"

export interface TimelineProps {
  children: React.ReactNode
  orientation?: "vertical" | "horizontal"
  className?: string
}

export function Timeline({ children, orientation = "vertical", className }: TimelineProps) {
  return (
    <div
      role="list"
      className={cn(
        "flex w-full",
        orientation === "vertical" ? "flex-col" : "flex-row items-start overflow-x-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Timeline Item
 * ------------------------------------------------------------------ */

export interface TimelineItemProps {
  children: React.ReactNode
  status?: TimelineStatus
  isLast?: boolean
  className?: string
}

export function TimelineItem({
  children,
  status,
  isLast = false,
  className,
}: TimelineItemProps) {
  return (
    <div
      role="listitem"
      data-status={status}
      className={cn(
        "relative flex gap-4",
        !isLast && "pb-8",
        className
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Timeline Connector (Vertical / Horizontal Track)
 * ------------------------------------------------------------------ */

export function TimelineConnector({
  status = "pending",
  dashed = true,
  className,
}: {
  status?: TimelineStatus
  dashed?: boolean
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute left-[11px] top-[24px] bottom-0 w-[1px]",
        dashed ? "border-l border-dashed border-[var(--oreo-border-default)]" : "bg-[var(--oreo-border-default)]",
        status === "completed" && "border-[var(--oreo-status-success)]/40",
        className
      )}
    />
  )
}

/* ------------------------------------------------------------------ *
 * Timeline Point (Indicator / Icon)
 * ------------------------------------------------------------------ */

export interface TimelinePointProps {
  status?: TimelineStatus
  icon?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function TimelinePoint({ status = "pending", icon, children, className }: TimelinePointProps) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative z-10 flex shrink-0 items-center justify-center pt-0.5">
      {children ? (
        children
      ) : icon ? (
        <span
          className={cn(
            "flex size-[24px] items-center justify-center rounded-full border text-[12px]",
            status === "completed" && "border-[var(--oreo-status-success)] bg-[var(--oreo-status-success-subtle)] text-[var(--oreo-status-success)]",
            status === "in-progress" && "border-[var(--oreo-status-progress)] bg-[var(--oreo-status-progress-subtle)] text-[var(--oreo-status-progress)]",
            status === "error" && "border-[var(--oreo-status-error)] bg-[var(--oreo-status-error-subtle)] text-[var(--oreo-status-error)]",
            status === "pending" && "border-[var(--oreo-border-default)] bg-[var(--oreo-bg-surface)] text-[var(--oreo-text-tertiary)]",
            className
          )}
        >
          {icon}
        </span>
      ) : status === "completed" ? (
        <span className={cn("grid size-[24px] place-items-center rounded-full bg-[var(--oreo-status-success)] text-white shadow-sm", className)}>
          <Check size={13} strokeWidth={2.8} />
        </span>
      ) : status === "in-progress" ? (
        <span className={cn("relative grid size-[24px] place-items-center rounded-full bg-[var(--oreo-status-progress-subtle)]", className)}>
          <motion.span
            animate={reduceMotion ? undefined : { scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-[var(--oreo-status-progress)]"
          />
          <Loading type="spin" size={14} className="relative z-10 text-white" />
        </span>
      ) : status === "error" ? (
        <span className={cn("grid size-[24px] place-items-center rounded-full bg-[var(--oreo-status-error)] text-white", className)}>
          <AlertCircle size={13} strokeWidth={2.5} />
        </span>
      ) : (
        <span className={cn("size-[10px] my-1.5 ml-1.5 rounded-full border-2 border-[var(--oreo-bg-surface)] bg-[var(--oreo-text-disabled)] ring-1 ring-[var(--oreo-border-default)]", className)} />
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Timeline Content
 * ------------------------------------------------------------------ */

export function TimelineContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn("flex min-w-0 flex-1 flex-col gap-1.5", className)}>{children}</div>
}

export function TimelineTitle({
  children,
  badge,
  timestamp,
  className,
}: {
  children: React.ReactNode
  badge?: React.ReactNode
  timestamp?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <h4 className="text-[14px] font-medium leading-[1.43] text-[var(--oreo-text-primary)]">{children}</h4>
      {badge && <span className="inline-flex shrink-0">{badge}</span>}
      {timestamp && (
        <span className="font-mono text-[12px] text-[var(--oreo-text-tertiary)] ml-auto">
          {timestamp}
        </span>
      )}
    </div>
  )
}

export function TimelineDescription({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("text-[14px] leading-[1.5] text-[var(--oreo-text-secondary)]", className)}>
      {children}
    </div>
  )
}
