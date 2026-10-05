"use client"

import Image from "next/image"
import { Maximize2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/cn"

export type ImageAspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9"

const ratios: Record<ImageAspectRatio, string> = {
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
  "4:3": "aspect-[4/3]",
  "9:16": "aspect-[9/16]",
  "16:9": "aspect-[16/9]",
}

export interface ImageTileProps {
  src: string
  alt?: string
  aspectRatio?: ImageAspectRatio
  /** Figma "Image" (636:5336) hover state: 1.2x zoom plus a floating action cap. */
  onExpand?: () => void
  expandLabel?: string
  priority?: boolean
  className?: string
  style?: React.CSSProperties
}

export function ImageTile({
  src,
  alt = "",
  aspectRatio = "1:1",
  onExpand,
  expandLabel = "Expand image",
  priority = false,
  className,
  style,
}: ImageTileProps) {
  const [hovered, setHovered] = React.useState(false)
  const reduceMotion = useReducedMotion()
  const active = hovered && !reduceMotion

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "relative overflow-hidden rounded-[var(--oreo-radius-sm)] bg-[var(--oreo-bg-elevated)]",
        ratios[aspectRatio],
        className
      )}
      style={style}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: active ? 1.2 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.2, 0, 0, 1] }}
      >
        <Image src={src} alt={alt} fill sizes="(max-width: 640px) 50vw, 33vw" priority={priority} className="object-cover" />
      </motion.div>
      {active && onExpand && (
        <span className="absolute bottom-5 right-5">
          <IconButton variant="secondary" shape="rounded" floating icon={<Maximize2 size={16} />} aria-label={expandLabel} onClick={onExpand} />
        </span>
      )}
    </div>
  )
}

export interface ImageGridProps {
  images: Array<Omit<ImageTileProps, "className"> & { id?: string | number }>
  columns?: 2 | 3 | 4
  className?: string
}

export function ImageGrid({ images, columns = 3, className }: ImageGridProps) {
  const columnClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  }[columns]

  return (
    <div className={cn("grid w-full gap-2", columnClass, className)}>
      {images.map(({ id, ...image }, index) => (
        <ImageTile key={id ?? index} {...image} />
      ))}
    </div>
  )
}

/** Figma "Cover" (632:7137) — one constant row height, width driven by each ratio. */
const ratioWidths: Record<ImageAspectRatio, number> = {
  "1:1": 1,
  "3:4": 3 / 4,
  "4:3": 4 / 3,
  "9:16": 9 / 16,
  "16:9": 16 / 9,
}

export function ImageStrip({ images, height = 160, className }: { images: ImageGridProps["images"]; height?: number; className?: string }) {
  return (
    <div className={cn("flex w-full items-start gap-2 overflow-x-auto pb-2", className)}>
      {images.map(({ id, aspectRatio = "1:1", ...image }, index) => (
        <ImageTile
          key={id ?? index}
          {...image}
          aspectRatio={aspectRatio}
          className="h-(--strip-height) w-[calc(var(--strip-height)*var(--strip-ratio))] shrink-0"
          style={{ "--strip-height": `${height}px`, "--strip-ratio": ratioWidths[aspectRatio] } as React.CSSProperties}
        />
      ))}
    </div>
  )
}