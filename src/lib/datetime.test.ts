import { describe, expect, it } from "vitest"

import {
  buildMonthGrid,
  commitRange,
  formatRange,
  formatTime,
  isInRange,
  rangePresets,
  selectRangeDay,
  shiftTime,
  toHour24,
} from "./datetime"

const day = (year: number, month: number, date: number) => new Date(year, month - 1, date)

describe("calendar range", () => {
  it("builds a stable 6-week grid starting on Sunday", () => {
    const grid = buildMonthGrid(day(2026, 10, 5))
    expect(grid).toHaveLength(42)
    expect(grid[0]?.getDay()).toBe(0)
    expect(grid[0]).toEqual(day(2026, 9, 27))
    expect(grid[41]).toEqual(day(2026, 11, 7))
  })

  it("starts a range, then closes it in calendar order", () => {
    const started = selectRangeDay({ from: null, to: null }, day(2026, 10, 8))
    expect(started).toEqual({ from: day(2026, 10, 8), to: null })
    const closed = selectRangeDay(started, day(2026, 10, 2))
    expect(closed).toEqual({ from: day(2026, 10, 2), to: day(2026, 10, 8) })
  })

  it("treats a single committed day as a one-day range", () => {
    expect(commitRange({ from: day(2026, 10, 5), to: null })).toEqual({
      from: day(2026, 10, 5),
      to: day(2026, 10, 5),
    })
  })

  it("includes both ends of a range", () => {
    expect(isInRange(day(2026, 10, 1), day(2026, 10, 1), day(2026, 10, 3))).toBe(true)
    expect(isInRange(day(2026, 10, 3), day(2026, 10, 1), day(2026, 10, 3))).toBe(true)
    expect(isInRange(day(2026, 10, 4), day(2026, 10, 1), day(2026, 10, 3))).toBe(false)
  })

  it("builds last-7-days from the provided today", () => {
    const presets = rangePresets(day(2026, 10, 5))
    expect(presets.find((preset) => preset.id === "7d")?.range).toEqual({
      from: day(2026, 9, 29),
      to: day(2026, 10, 5),
    })
  })

  it("formats an open range and a same-day range", () => {
    expect(formatRange({ from: null, to: null })).toBe("Select dates")
    expect(formatRange({ from: day(2026, 10, 5), to: day(2026, 10, 5) })).toBe("Oct 5, 2026")
  })
})

describe("time", () => {
  it("formats 12-hour and 24-hour clocks", () => {
    expect(formatTime({ hour: 0, minute: 5 }, "12")).toBe("12:05 AM")
    expect(formatTime({ hour: 15, minute: 30 }, "24")).toBe("15:30")
  })

  it("wraps hours and carries minutes", () => {
    expect(shiftTime({ hour: 23, minute: 30 }, "minute", 45)).toEqual({ hour: 0, minute: 15 })
    expect(toHour24(12, "AM")).toBe(0)
    expect(toHour24(12, "PM")).toBe(12)
  })
})
