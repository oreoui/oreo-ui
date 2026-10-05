"use client"

import { useReducedMotion } from "framer-motion"
import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts"

import { cn } from "@/lib/cn"

const chartPalette = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

export type ChartSeries = {
  key: string
  label: string
  color?: string
}

export type ChartPoint = Record<string, string | number>

function seriesColor(series: ChartSeries, index: number) {
  return series.color ?? chartPalette[index % chartPalette.length]
}

function ChartTooltipContent({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[var(--oreo-radius-md)] border border-[var(--border)] bg-[var(--popover)] px-3 py-2 text-[var(--popover-foreground)] shadow-[var(--oreo-shadow-floating)]">
      {label ? <p className="mb-1 text-[12px] text-[var(--muted-foreground)]">{label}</p> : null}
      <div className="flex flex-col gap-1">
        {payload.map((item) => (
          <div key={String(item.dataKey)} className="flex items-center gap-2 text-[13px]">
            <span className="size-2 rounded-full" style={{ background: item.color }} />
            <span className="text-[var(--muted-foreground)]">{item.name}</span>
            <span className="ml-auto font-medium tabular-nums">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartFrame({
  children,
  height,
  className,
  empty,
}: {
  children: React.ReactElement
  height: number
  className?: string
  empty?: boolean
}) {
  const frameRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const frame = frameRef.current
    if (!frame || empty) return
    const observer = new ResizeObserver((entries) => {
      const next = Math.floor(entries[0]?.contentRect.width ?? 0)
      setWidth((current) => (current === next ? current : next))
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [empty])

  if (empty) {
    return (
      <div
        className={cn(
          "grid place-items-center rounded-[var(--oreo-radius-lg)] border border-dashed border-[var(--border)] text-[13px] text-[var(--muted-foreground)]",
          className
        )}
        style={{ height }}
      >
        No data yet
      </div>
    )
  }

  return (
    <div ref={frameRef} className={cn("w-full min-w-0", className)} style={{ height }}>
      {width > 0 ? React.cloneElement(children, { width, height }) : null}
    </div>
  )
}

export function TrendAreaChart({
  data,
  xKey,
  series,
  height = 240,
  yReversed = false,
  tone = "default",
  className,
}: {
  data: ChartPoint[]
  xKey: string
  series: ChartSeries[]
  height?: number
  yReversed?: boolean
  tone?: "default" | "inverse"
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const tick = tone === "inverse" ? "var(--oreo-text-on-inverse)" : "var(--oreo-text-tertiary)"
  const grid = tone === "inverse" ? "var(--oreo-border-inverse)" : "var(--oreo-border-subtle)"
  const gradientId = React.useId().replace(/:/g, "")

  return (
    <ChartFrame height={height} className={className} empty={data.length === 0}>
      <AreaChart data={data} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          {series.map((item, index) => (
            <linearGradient key={item.key} id={`${gradientId}-${item.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={seriesColor(item, index)} stopOpacity={0.35} />
              <stop offset="100%" stopColor={seriesColor(item, index)} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} stroke={grid} />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fill: tick, fontSize: 12 }} dy={8} />
        <YAxis
          reversed={yReversed}
          width={32}
          tickLine={false}
          axisLine={false}
          tick={{ fill: tick, fontSize: 12 }}
        />
        <Tooltip content={<ChartTooltipContent />} cursor={{ stroke: grid }} />
        {series.map((item, index) => (
          <Area
            key={item.key}
            type="monotone"
            dataKey={item.key}
            name={item.label}
            stroke={seriesColor(item, index)}
            strokeWidth={2}
            fill={`url(#${gradientId}-${item.key})`}
            isAnimationActive={!reduceMotion}
            animationDuration={700}
          />
        ))}
      </AreaChart>
    </ChartFrame>
  )
}

export function CompareBarChart({
  data,
  xKey,
  series,
  height = 240,
  className,
}: {
  data: ChartPoint[]
  xKey: string
  series: ChartSeries[]
  height?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  return (
    <ChartFrame height={height} className={className} empty={data.length === 0}>
      <BarChart data={data} accessibilityLayer margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--oreo-border-subtle)" />
        <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={{ fill: "var(--oreo-text-tertiary)", fontSize: 12 }} dy={8} />
        <YAxis width={32} tickLine={false} axisLine={false} tick={{ fill: "var(--oreo-text-tertiary)", fontSize: 12 }} />
        <Tooltip content={<ChartTooltipContent />} cursor={{ fill: "var(--oreo-bg-subtle)" }} />
        {series.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            name={item.label}
            fill={seriesColor(item, index)}
            radius={[6, 6, 0, 0]}
            isAnimationActive={!reduceMotion}
            animationDuration={700}
          />
        ))}
      </BarChart>
    </ChartFrame>
  )
}

export type ShareSlice = {
  label: string
  value: number
  color?: string
}

export function ShareDonutChart({
  data,
  height = 240,
  className,
}: {
  data: ShareSlice[]
  height?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  const total = data.reduce((sum, slice) => sum + slice.value, 0)
  return (
    <div className={cn("grid items-center gap-4 sm:grid-cols-[minmax(0,1fr)_140px]", className)}>
      <ChartFrame height={height} empty={data.length === 0 || total === 0}>
        <PieChart accessibilityLayer>
          <Tooltip content={<ChartTooltipContent />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={3}
            stroke="transparent"
            isAnimationActive={!reduceMotion}
            animationDuration={700}
          >
            {data.map((slice, index) => (
              <Cell key={slice.label} fill={slice.color ?? chartPalette[index % chartPalette.length]} />
            ))}
          </Pie>
        </PieChart>
      </ChartFrame>
      <ul className="flex flex-col gap-2">
        {data.map((slice, index) => (
          <li key={slice.label} className="flex items-center gap-2 text-[13px]">
            <span className="size-2 rounded-full" style={{ background: slice.color ?? chartPalette[index % chartPalette.length] }} />
            <span className="min-w-0 flex-1 truncate text-[var(--oreo-text-secondary)]">{slice.label}</span>
            <span className="tabular-nums text-[var(--oreo-text-primary)]">{total ? Math.round((slice.value / total) * 100) : 0}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
