export type DateRange = {
  from: Date | null
  to: Date | null
}

export type TimeValue = {
  /** 0–23 */
  hour: number
  /** 0–59 */
  minute: number
}

export type HourCycle = "12" | "24"

const dayFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" })
const monthFormatter = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" })
const shortFormatter = new Intl.DateTimeFormat("en", { month: "short", day: "numeric" })

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

export function addDays(date: Date, amount: number): Date {
  const next = startOfDay(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/** Six stable weeks, Sunday-first, matching the shadcn calendar. */
export function buildMonthGrid(month: Date): Date[] {
  const first = startOfMonth(month)
  const gridStart = addDays(first, -first.getDay())
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

export function isInRange(day: Date, from: Date | null, to: Date | null): boolean {
  if (!from || !to) return false
  const time = startOfDay(day).getTime()
  const start = Math.min(startOfDay(from).getTime(), startOfDay(to).getTime())
  const end = Math.max(startOfDay(from).getTime(), startOfDay(to).getTime())
  return time >= start && time <= end
}

/** First click starts a range. Second click closes it, swapping if the user picks backwards. */
export function selectRangeDay(current: DateRange, day: Date): DateRange {
  const next = startOfDay(day)
  if (!current.from || current.to) return { from: next, to: null }
  if (next.getTime() < startOfDay(current.from).getTime()) return { from: next, to: startOfDay(current.from) }
  return { from: startOfDay(current.from), to: next }
}

export function commitRange(range: DateRange): DateRange {
  if (!range.from) return { from: null, to: null }
  if (!range.to) return { from: startOfDay(range.from), to: startOfDay(range.from) }
  return {
    from: startOfDay(range.from),
    to: startOfDay(range.to),
  }
}

export type RangePreset = {
  id: string
  label: string
  range: DateRange
}

export function rangePresets(today: Date): RangePreset[] {
  const day = startOfDay(today)
  const thisMonth = startOfMonth(day)
  const lastMonth = addMonths(day, -1)
  return [
    { id: "today", label: "Today", range: { from: day, to: day } },
    { id: "7d", label: "Last 7 days", range: { from: addDays(day, -6), to: day } },
    { id: "30d", label: "Last 30 days", range: { from: addDays(day, -29), to: day } },
    { id: "month", label: "This month", range: { from: thisMonth, to: endOfMonth(day) } },
    { id: "last-month", label: "Last month", range: { from: lastMonth, to: endOfMonth(lastMonth) } },
  ]
}

export function formatDay(date: Date): string {
  return dayFormatter.format(date)
}

export function formatMonth(date: Date): string {
  return monthFormatter.format(date)
}

export function formatRange(range: DateRange, placeholder = "Select dates"): string {
  if (!range.from) return placeholder
  if (!range.to || isSameDay(range.from, range.to)) return formatDay(range.from)
  const sameYear = range.from.getFullYear() === range.to.getFullYear()
  const start = sameYear ? shortFormatter.format(range.from) : formatDay(range.from)
  return `${start} – ${formatDay(range.to)}`
}

export function clampTime(value: TimeValue): TimeValue {
  const hour = Number.isFinite(value.hour) ? Math.min(23, Math.max(0, Math.trunc(value.hour))) : 0
  const minute = Number.isFinite(value.minute) ? Math.min(59, Math.max(0, Math.trunc(value.minute))) : 0
  return { hour, minute }
}

export function formatTime(value: TimeValue, cycle: HourCycle = "12"): string {
  const time = clampTime(value)
  if (cycle === "24") {
    return `${String(time.hour).padStart(2, "0")}:${String(time.minute).padStart(2, "0")}`
  }
  const period = time.hour >= 12 ? "PM" : "AM"
  const hour12 = time.hour % 12 || 12
  return `${hour12}:${String(time.minute).padStart(2, "0")} ${period}`
}

export function toHour12(hour: number): { hour: number; period: "AM" | "PM" } {
  return { hour: hour % 12 || 12, period: hour >= 12 ? "PM" : "AM" }
}

export function toHour24(hour12: number, period: "AM" | "PM"): number {
  const normalized = ((hour12 % 12) + 12) % 12
  return period === "PM" ? normalized + 12 : normalized
}

export function shiftTime(value: TimeValue, part: "hour" | "minute", delta: number): TimeValue {
  const time = clampTime(value)
  if (part === "hour") return clampTime({ ...time, hour: (time.hour + delta + 24) % 24 })
  const total = time.hour * 60 + time.minute + delta
  const wrapped = ((total % (24 * 60)) + 24 * 60) % (24 * 60)
  return { hour: Math.floor(wrapped / 60), minute: wrapped % 60 }
}
