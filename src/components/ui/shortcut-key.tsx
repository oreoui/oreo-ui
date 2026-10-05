"use client"

import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/cn"

/**
 * Figma "Shortcuts" (337:1611) — Key x Combine.
 * 20px tall caps, 4px radius, 12px mono label, 14px glyph, 0.5px border.
 * A combination (Command + A) renders inside ONE cap, matching the
 * `Combine=2 Key` / `Combine=3 Key` variants.
 */
export type ShortcutGlyph = "command" | "shift" | "option" | "control" | "at" | "slash" | "backspace"

const glyphs: Record<ShortcutGlyph, string> = {
  command: "⌘",
  shift: "⇧",
  option: "⌥",
  control: "⌃",
  at: "@",
  slash: "/",
  backspace: "⌫",
}

export interface ShortcutKeyProps {
  /** One symbol for a single cap, or several for a combination cap. */
  keys: string | Array<string | ShortcutGlyph>
  /** Renders the combination with the "then" separator used by Figma's 3-key variant. */
  className?: string
}

function Glyph({ value }: { value: string }) {
  const glyph = glyphs[value as ShortcutGlyph]
  return <span className={glyph ? "text-[14px] leading-none" : "font-mono text-[12px] leading-[1.33]"}>{glyph ?? value}</span>
}

export function ShortcutKey({ keys, className }: ShortcutKeyProps) {
  const reduceMotion = useReducedMotion()
  const sequence = Array.isArray(keys) ? keys : [keys]

  return (
    <motion.kbd
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      transition={{ duration: reduceMotion ? 0 : 0.12, ease: [0.2, 0, 0, 1] }}
      className={cn(
        "inline-flex h-[20px] min-w-[20px] select-none items-center justify-center gap-[1px] rounded-[var(--oreo-radius-xs)] border-[0.5px] border-[var(--oreo-border-default)] bg-[var(--oreo-bg-surface)] px-[4px] py-[2px] text-[var(--oreo-text-placeholder)]",
        className
      )}
    >
      {sequence.map((key, index) => (
        <Glyph key={`${key}-${index}`} value={key} />
      ))}
    </motion.kbd>
  )
}