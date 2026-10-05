import type { ReactNode } from "react"

import { cn } from "@/lib/cn"

const displaySize = {
  sm: "text-[32px] leading-[1.05] tracking-[-0.04em] sm:text-[40px]",
  md: "text-[40px] leading-[1.02] tracking-[-0.045em] sm:text-[56px]",
  lg: "text-[44px] leading-none tracking-[-0.05em] sm:text-[72px]",
} as const

export function Display({
  children,
  size = "md",
  className,
}: {
  children: ReactNode
  size?: keyof typeof displaySize
  className?: string
}) {
  return <p className={cn("font-display font-medium text-[var(--oreo-text-primary)]", displaySize[size], className)}>{children}</p>
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--oreo-text-secondary)]", className)}>
      {children}
    </p>
  )
}

export function Headline({
  children,
  as: Tag = "h2",
  className,
}: {
  children: ReactNode
  as?: "h1" | "h2" | "h3" | "h4"
  className?: string
}) {
  return <Tag className={cn("font-display text-[24px] font-medium leading-tight tracking-[-0.03em] sm:text-[32px]", className)}>{children}</Tag>
}

export function Text({
  children,
  tone = "secondary",
  size = "md",
  className,
}: {
  children: ReactNode
  tone?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  return (
    <p
      className={cn(
        "max-w-[68ch]",
        size === "sm" && "text-[13px] leading-[1.5]",
        size === "md" && "text-[14px] leading-[1.6]",
        size === "lg" && "text-[16px] leading-[1.6] sm:text-[18px]",
        tone === "primary" ? "text-[var(--oreo-text-primary)]" : "text-[var(--oreo-text-secondary)]",
        className
      )}
    >
      {children}
    </p>
  )
}

export function Mono({ children, className }: { children: ReactNode; className?: string }) {
  return <code className={cn("font-mono text-[12px] text-[var(--oreo-text-secondary)]", className)}>{children}</code>
}
