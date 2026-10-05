"use client"

import { Sparkles, X } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Loading } from "@/components/ui/loading"
import { cn } from "@/lib/cn"

export interface GenerationSkeletonProps {
  type?: "image" | "video" | "code"
  aspectRatio?: "1:1" | "16:9" | "9:16" | "4:3"
  statusText?: string
  progress?: number
  elapsedSeconds?: number
  onCancel?: () => void
  className?: string
}

const ratioClasses = {
  "1:1": "aspect-square",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
  "4:3": "aspect-[4/3]",
}

export function GenerationSkeleton({
  type = "image",
  aspectRatio = "1:1",
  statusText,
  progress,
  elapsedSeconds,
  onCancel,
  className,
}: GenerationSkeletonProps) {
  const reduceMotion = useReducedMotion()
  const defaultLabel = type === "video" ? "Rendering video..." : type === "code" ? "Generating code..." : "Generating image..."
  const label = statusText ?? defaultLabel

  return (
    <div
      className={cn(
        "relative flex w-full flex-col justify-between overflow-hidden rounded-[var(--oreo-radius-lg)] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] p-4 shadow-[var(--oreo-shadow-default)]",
        ratioClasses[aspectRatio],
        className
      )}
    >
      {/* Background Animated Shimmer */}
      <motion.div
        aria-hidden="true"
        animate={reduceMotion ? undefined : { x: ["-100%", "100%"] }}
        transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/5"
      />

      {/* Top Header: Badge & Cancel */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 rounded-full border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] px-2.5 py-1 shadow-sm">
          <Sparkles size={13} className="text-[var(--oreo-status-progress)] animate-pulse" />
          <span className="font-mono text-[11px] font-medium text-[var(--oreo-text-secondary)] uppercase tracking-wider">
            AI {type}
          </span>
        </div>

        {onCancel && (
          <Button
            variant="ghost"
            onClick={onCancel}
            className="size-[28px] rounded-full p-0 text-[var(--oreo-text-tertiary)] hover:text-[var(--oreo-text-primary)]"
          >
            <X size={14} />
          </Button>
        )}
      </div>

      {/* Center Ambient Icon & Pulse */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-2 text-center">
        <Loading type="step" size={24} />
        <p
          role="status"
          aria-live="polite"
          className="max-w-[200px] truncate text-[14px] font-medium leading-[1.43] text-[var(--oreo-text-primary)]"
        >
          {label}
        </p>
      </div>

      {/* Bottom Progress Bar & Elapsed Info */}
      <div className="relative z-10 flex flex-col gap-1.5">
        {progress !== undefined && (
          <div className="relative h-1 w-full overflow-hidden rounded-full bg-[var(--oreo-border-default)]">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-[var(--oreo-status-progress)]"
            />
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--oreo-text-tertiary)]">
          <span>{progress !== undefined ? `${Math.round(progress)}%` : "Processing"}</span>
          {elapsedSeconds !== undefined && <span>0:{elapsedSeconds.toString().padStart(2, "0")}</span>}
        </div>
      </div>
    </div>
  )
}
