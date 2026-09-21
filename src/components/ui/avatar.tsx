"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { cn } from "@/lib/cn"

/* ------------------------------------------------------------------ *
 * Geometry lifted from the Figma "Avatar" component set (22:11356).
 * Every art layer is centred in a 64x64 viewBox; `pos` from Figma is
 * the top-left corner, so cx/cy derive from pos + size / 2.
 * ------------------------------------------------------------------ */

type ArtLayer = {
  w: number
  h: number
  cx: number
  cy: number
  rx: number
  rotate: number
  fill: string
  blur?: number
  opacity?: number
}

const gradientDefs = {
  jade: { type: "linear", from: "#f5ffe9", to: "#9ce7ad" },
  bloom: { type: "radial", from: "#fb4fbc", to: "#fb4fbc00" },
  flareTop: { type: "linear", from: "#f4dec3", to: "#ffdfa7" },
  flareCore: { type: "linear", from: "#ffc744", to: "#ff6044" },
} as const

const agentArt: Record<AgentArt, { glow: string; layers: ArtLayer[] }> = {
  nova: {
    glow: "inset 0 -1.12px 10.11px #7cb2ff, inset 0 0 2.25px 1.02px #88b9ff, inset 0 0 2.25px 1.02px #ffffff",
    layers: [
      { w: 75, h: 75, cx: 31.5, cy: 31.5, rx: 16.27, rotate: -51.57, fill: "#6550b9" },
      { w: 71, h: 84, cx: 31.5, cy: 15, rx: 33.68, rotate: 103.13, fill: "#ffffff", blur: 11.23 },
      { w: 58, h: 64, cx: 32, cy: 4, rx: 25.26, rotate: 103.13, fill: "#ff0084", blur: 16.84 },
    ],
  },
  void: {
    glow: "inset 0 0 11.23px #71abff, inset 0 0 4.49px 1.02px #71abff, inset 0 0 2.25px 1.02px #ffffff",
    layers: [
      { w: 75, h: 75, cx: 31.5, cy: 31.5, rx: 16.25, rotate: -51.57, fill: "#031a05" },
      { w: 64, h: 38, cx: 32, cy: 32, rx: 10.16, rotate: 103.13, fill: "#4229ff", blur: 27.43 },
      { w: 45, h: 18, cx: 31.5, cy: 32, rx: 5.08, rotate: 103.13, fill: "#57b565", blur: 10.16 },
    ],
  },
  jade: {
    glow: "inset 0 0 11.23px #42cba9, inset 0 0 3.37px 1.02px #42cba9, inset 0 0 2.25px 1.02px #ffffff",
    layers: [
      { w: 75, h: 75, cx: 31.5, cy: 31.5, rx: 16.27, rotate: -51.57, fill: "#8be8cb" },
      { w: 55, h: 57, cx: 32.5, cy: 60.5, rx: 10.17, rotate: -51.57, fill: "#c7f0df", blur: 27.46 },
      { w: 52, h: 52, cx: 33, cy: 58, rx: 26, rotate: -51.57, fill: "url(#oreo-avatar-jade)", blur: 10.17 },
    ],
  },
  bloom: {
    glow: "inset 0 0 11.23px #fee9f5, inset 0 0 4.49px 1.02px #fee9f5, inset 0 0 2.25px 1.02px #ffffff",
    layers: [
      { w: 75, h: 75, cx: 31.5, cy: 31.5, rx: 16.27, rotate: -51.57, fill: "#ffdedf" },
      { w: 129, h: 129, cx: 65.5, cy: 65.5, rx: 64.5, rotate: 25.78, fill: "#ffaaaa", blur: 6.45 },
      { w: 129, h: 129, cx: -1.5, cy: -1.5, rx: 64.5, rotate: 25.78, fill: "#ffaaaa", blur: 6.45 },
      { w: 108, h: 108, cx: 63, cy: 63, rx: 54, rotate: -77.35, fill: "url(#oreo-avatar-bloom)", blur: 2.15 },
      { w: 108, h: 108, cx: 0, cy: 0, rx: 54, rotate: 25.78, fill: "url(#oreo-avatar-bloom)", blur: 2.15 },
    ],
  },
  silk: {
    glow: "inset 0 0 11.85px #aec6cf, inset 0 0 2.96px 1.02px #aec6cf, inset 0 0 2.25px 1.02px #ffffff",
    layers: [
      { w: 64, h: 64, cx: 32, cy: 32, rx: 16.25, rotate: 0, fill: "#000000", blur: 25.4 },
      { w: 70, h: 75, cx: 32, cy: 34.5, rx: 16.25, rotate: 0, fill: "#e6c9c9" },
      { w: 94, h: 80, cx: 32, cy: 6, rx: 40, rotate: 0, fill: "#ffd9b8", blur: 20.74 },
      { w: 48, h: 43, cx: 32, cy: 18.5, rx: 21.5, rotate: 0, fill: "#fffce2", blur: 15.25 },
    ],
  },
  flare: {
    glow: "inset 0 0 11.23px #ffbe74, inset 0 0 4.49px 1.02px #ffdfda, inset 0 0 2.25px 1.02px #ffffff",
    layers: [
      { w: 64, h: 64, cx: 32, cy: 32, rx: 16.27, rotate: 0, fill: "#cc4e00", blur: 25.42 },
      { w: 70, h: 75, cx: 32, cy: 34.5, rx: 16.27, rotate: 0, fill: "#ff9a44" },
      { w: 70, h: 65, cx: 32, cy: 31.5, rx: 32.5, rotate: 0, fill: "url(#oreo-avatar-flare-top)", blur: 9.66 },
      { w: 44, h: 44, cx: 39, cy: 42, rx: 22, rotate: 0, fill: "url(#oreo-avatar-flare-core)", blur: 15.25 },
    ],
  },
}

const palette = {
  black: "bg-[var(--oreo-bg-inverse)] text-[var(--oreo-text-on-inverse)]",
  white: "bg-[var(--oreo-palette-default-bg)] text-[var(--oreo-palette-default-text)]",
  mint: "bg-[var(--oreo-palette-mint-bg)] text-[var(--oreo-palette-mint-text)]",
  pink: "bg-[var(--oreo-palette-pink-bg)] text-[var(--oreo-palette-pink-text)]",
  blue: "bg-[var(--oreo-palette-blue-bg)] text-[var(--oreo-palette-blue-text)]",
  purple: "bg-[var(--oreo-palette-purple-bg)] text-[var(--oreo-palette-purple-text)]",
  orange: "bg-[var(--oreo-palette-orange-bg)] text-[var(--oreo-palette-orange-text)]",
  brown: "bg-[var(--oreo-palette-brown-bg)] text-[var(--oreo-palette-brown-text)]",
} as const

export type AvatarColor = keyof typeof palette
export type AgentArt = "nova" | "void" | "jade" | "bloom" | "silk" | "flare"

export interface AvatarProps {
  /** `logo` renders the Oreo mark, `initials` a colour-coded monogram, `agent` an agent identity artwork. */
  type?: "empty" | "image" | "logo" | "initials" | "agent"
  color?: AvatarColor
  /** Agent artwork name — required when `type="agent"`. */
  agentArt?: AgentArt
  size?: number
  src?: string
  alt?: string
  /** Monogram text. Defaults to the first two characters of `alt`. */
  initials?: string
  /** Brand mark used by `type="logo"`. */
  logoSrc?: string
  /** Skeleton shimmer while the identity resolves. */
  loading?: boolean
  className?: string
}

function AgentArtwork({ art, id }: { art: AgentArt; id: string }) {
  const { layers } = agentArt[art]

  return (
    <svg viewBox="0 0 64 64" className="size-full" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-jade`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={gradientDefs.jade.from} />
          <stop offset="1" stopColor={gradientDefs.jade.to} />
        </linearGradient>
        <radialGradient id={`${id}-bloom`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={gradientDefs.bloom.from} />
          <stop offset="1" stopColor={gradientDefs.bloom.to} />
        </radialGradient>
        <linearGradient id={`${id}-flare-top`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={gradientDefs.flareTop.from} />
          <stop offset="1" stopColor={gradientDefs.flareTop.to} />
        </linearGradient>
        <linearGradient id={`${id}-flare-core`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={gradientDefs.flareCore.from} />
          <stop offset="1" stopColor={gradientDefs.flareCore.to} />
        </linearGradient>
        {layers.map((layer, index) =>
          layer.blur ? (
            <filter key={index} id={`${id}-blur-${index}`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation={layer.blur / 2} />
            </filter>
          ) : null
        )}
      </defs>
      {layers.map((layer, index) => (
        <rect
          key={index}
          x={layer.cx - layer.w / 2}
          y={layer.cy - layer.h / 2}
          width={layer.w}
          height={layer.h}
          rx={layer.rx}
          fill={layer.fill.replace(/url\(#oreo-avatar-([a-z-]+)\)/, `url(#${id}-$1)`)}
          transform={`rotate(${layer.rotate} ${layer.cx} ${layer.cy})`}
          filter={layer.blur ? `url(#${id}-blur-${index})` : undefined}
          opacity={layer.opacity}
        />
      ))}
    </svg>
  )
}

export function Avatar({
  type = "initials",
  color = "black",
  agentArt: artName,
  size = 32,
  src,
  alt,
  initials,
  logoSrc = "/brand/oreoui-mark.png",
  loading = false,
  className,
}: AvatarProps) {
  const reduceMotion = useReducedMotion()
  const id = React.useId().replace(/:/g, "")
  const monogram = initials ?? (alt ? alt.slice(0, 2).toUpperCase() : "OR")
  const label = alt ?? (type === "logo" ? "OreoUI" : monogram)

  const shell = cn(
    "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full",
    type === "empty" && "bg-[linear-gradient(135deg,var(--oreo-bg-elevated)_0%,var(--oreo-bg-base)_76%,var(--oreo-bg-elevated)_100%)]",
    type === "initials" && palette[color],
    type === "image" && "border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)]",
    // The brand mark is a dark plate, so it needs a hairline to stay legible on dark surfaces.
    type === "logo" && "border-[0.5px] border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-base)]",
    type === "agent" && "bg-[var(--oreo-bg-base)]",
    loading && "bg-[var(--oreo-bg-elevated)]",
    className
  )

  const style = type === "agent" && artName ? { boxShadow: agentArt[artName].glow } : undefined

  if (loading) {
    return (
      <span role="status" aria-label="Loading avatar" className={shell} style={{ width: size, height: size }}>
        <motion.span
          aria-hidden="true"
          className="size-full bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.05),transparent)]"
          animate={reduceMotion ? undefined : { x: ["-100%", "100%"] }}
          transition={reduceMotion ? undefined : { duration: 1.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
      </span>
    )
  }

  return (
    <span role="img" aria-label={label} className={shell} style={{ width: size, height: size, ...style }}>
      {type === "image" && src && <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />}

      {type === "logo" && <Image src={logoSrc} alt="" fill sizes={`${size}px`} className="object-cover" />}

      {type === "initials" && <span className="font-semibold" style={{ fontSize: size * 0.375 }}>{monogram}</span>}

      {type === "agent" && artName && <AgentArtwork art={artName} id={id} />}
    </span>
  )
}

export function AvatarGroup({
  children,
  max = 3,
  size = 32,
  className,
}: {
  children: React.ReactNode
  max?: number
  size?: number
  className?: string
}) {
  const items = React.Children.toArray(children)
  const visible = items.slice(0, max)
  const overflow = items.length - visible.length

  return (
    <span className={cn("inline-flex items-center", className)}>
      {visible.map((child, index) => (
        <span key={index} className="-ml-2 inline-flex rounded-full ring-2 ring-[var(--oreo-bg-base)] first:ml-0">
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <span
          className="-ml-2 inline-flex items-center justify-center rounded-full bg-[var(--oreo-bg-inverse)] font-medium text-[var(--oreo-text-on-inverse)] ring-2 ring-[var(--oreo-bg-base)]"
          style={{ width: size, height: size, fontSize: size * 0.34 }}
        >
          +{overflow}
        </span>
      )}
    </span>
  )
}
