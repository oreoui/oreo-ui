"use client"

import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/cn"

export type LoadingType = "spin" | "dot" | "step" | "progress"

export interface LoadingProps {
  /** Figma `Type` axis: Spin wheel, pulsing Dot, 3-dot Step, or circular Progress. */
  type?: LoadingType
  size?: number
  /** Accessible label; also rendered visually when `showLabel` is set. */
  label?: string
  showLabel?: boolean
  className?: string
}

const LINE = "var(--oreo-text-disabled)"
const ACTIVE = "var(--oreo-text-secondary)"
const TRACK = "var(--oreo-text-waiting)"
const PROGRESS = "var(--oreo-status-progress)"

function Spin({ size }: { size: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.span
      aria-hidden="true"
      className="inline-flex shrink-0"
      style={{ width: size, height: size }}
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={reduceMotion ? undefined : { duration: 0.9, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
    >
      <svg viewBox="0 0 16 16" className="size-full">
        {Array.from({ length: 8 }, (_, index) => (
          <rect
            key={index}
            x={7.4}
            y={index % 2 === 0 ? 0.6 : 0.9}
            width={1.2}
            height={4}
            rx={0.6}
            fill={LINE}
            opacity={0.25 + (index / 8) * 0.75}
            transform={`rotate(${index * 45} 8 8)`}
          />
        ))}
      </svg>
    </motion.span>
  )
}

function Dot({ size }: { size: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <motion.span
        className="rounded-full"
        style={{ width: size * 0.25, height: size * 0.25, background: ACTIVE }}
        animate={reduceMotion ? undefined : { scale: [1, 0.4, 1], opacity: [1, 0.35, 1] }}
        transition={reduceMotion ? undefined : { duration: 1.1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
    </span>
  )
}

function Step({ size }: { size: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <span className="flex items-center" style={{ gap: size * 0.09 }}>
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="rounded-full"
            style={{ width: size * 0.15, height: size * 0.15, background: TRACK }}
            animate={reduceMotion ? undefined : { backgroundColor: [TRACK, ACTIVE, TRACK] }}
            transition={reduceMotion ? undefined : { duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: index * 0.16 }}
          />
        ))}
      </span>
    </span>
  )
}

function Progress({ size }: { size: number }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.span
      aria-hidden="true"
      className="inline-flex shrink-0"
      style={{ width: size, height: size }}
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={reduceMotion ? undefined : { duration: 1, ease: "linear", repeat: Number.POSITIVE_INFINITY }}
    >
      <svg viewBox="0 0 12 12" className="size-full">
        <circle cx="6" cy="6" r="5.2" fill="none" stroke={TRACK} strokeWidth="1.6" />
        <path d="M6 0.8 A5.2 5.2 0 0 1 11.2 6" fill="none" stroke={PROGRESS} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </motion.span>
  )
}

const indicators: Record<LoadingType, React.ComponentType<{ size: number }>> = {
  spin: Spin,
  dot: Dot,
  step: Step,
  progress: Progress,
}

export function Loading({ type = "spin", size = 20, label = "Loading", showLabel = false, className }: LoadingProps) {
  const Indicator = indicators[type]

  return (
    <span role="status" aria-live="polite" aria-label={label} className={cn("inline-flex items-center gap-2", className)}>
      <Indicator size={size} />
      {showLabel && <span className="text-[14px] leading-[1.43] text-[var(--oreo-text-secondary)]">{label}</span>}
    </span>
  )
}
