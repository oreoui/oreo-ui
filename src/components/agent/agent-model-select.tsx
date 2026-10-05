"use client"

import { ChevronDown } from "lucide-react"
import Image from "next/image"
import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * Figma "Modal Select" inside the Prompt set (23:12294): 32px cap, 8px radius,
 * 8px padding, 4px gap: 16px model logo, 14px model name, 10px chevron.
 */
export interface AgentModelSelectProps {
  name: string
  /** Logo image src; 12px of the 16px logo box. */
  logoSrc?: string
  disabled?: boolean
  onOpen?: () => void
  className?: string
}

export function AgentModelSelect({ name, logoSrc, disabled = false, onOpen, className }: AgentModelSelectProps) {
  return (
    <button
      type="button"
      disabled={disabled || undefined}
      aria-haspopup="listbox"
      onClick={onOpen}
      className={cn(
        "inline-flex h-[32px] oreo-clickable select-none items-center gap-1 rounded-[var(--oreo-radius-sm)] px-2 py-2 text-[14px] leading-[1.43] text-[var(--oreo-text-primary)] transition-colors",
        !disabled && "hover:bg-[var(--oreo-interaction-hover)] active:bg-[var(--oreo-interaction-press)]",
        disabled && "opacity-30",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)]",
        className
      )}
    >
      <span className="inline-flex size-4 shrink-0 items-center justify-center">
        {logoSrc ? <Image src={logoSrc} alt="" width={12} height={12} className="size-3" /> : null}
      </span>
      <span className="truncate">{name}</span>
      <ChevronDown size={10} className="shrink-0" />
    </button>
  )
}