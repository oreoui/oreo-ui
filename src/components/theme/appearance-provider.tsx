"use client"

import * as React from "react"

import {
  type Appearance,
  type ColorId,
  type FontId,
  type RadiusId,
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE,
  applyAppearance,
  parseAppearance,
  persistAppearance,
} from "@/lib/appearance"

type AppearanceContextValue = {
  appearance: Appearance
  setColor: (color: ColorId) => void
  setRadius: (radius: RadiusId) => void
  setFont: (font: FontId) => void
}

const AppearanceContext = React.createContext<AppearanceContextValue | null>(null)

const APPEARANCE_EVENT = "oreo-appearance"

let cachedRaw: string | null | undefined
let cachedAppearance: Appearance = DEFAULT_APPEARANCE

function readSnapshot(): Appearance {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(APPEARANCE_STORAGE_KEY)
  } catch {
    return DEFAULT_APPEARANCE
  }
  if (raw === cachedRaw) return cachedAppearance
  cachedRaw = raw
  if (!raw) {
    cachedAppearance = DEFAULT_APPEARANCE
    return cachedAppearance
  }
  try {
    cachedAppearance = parseAppearance(JSON.parse(raw) as unknown)
  } catch {
    cachedAppearance = DEFAULT_APPEARANCE
  }
  return cachedAppearance
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(APPEARANCE_EVENT, onStoreChange)
  window.addEventListener("storage", onStoreChange)
  return () => {
    window.removeEventListener(APPEARANCE_EVENT, onStoreChange)
    window.removeEventListener("storage", onStoreChange)
  }
}

function publish(next: Appearance) {
  persistAppearance(window.localStorage, next)
  cachedRaw = window.localStorage.getItem(APPEARANCE_STORAGE_KEY)
  cachedAppearance = next
  applyAppearance(document.documentElement, next)
  window.dispatchEvent(new Event(APPEARANCE_EVENT))
}

export function useAppearance() {
  const context = React.useContext(AppearanceContext)
  if (!context) throw new Error("useAppearance must be used within AppearanceProvider")
  return context
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const appearance = React.useSyncExternalStore(subscribe, readSnapshot, () => DEFAULT_APPEARANCE)

  React.useLayoutEffect(() => {
    applyAppearance(document.documentElement, appearance)
  }, [appearance])

  const value = React.useMemo<AppearanceContextValue>(
    () => ({
      appearance,
      setColor: (color) => publish({ ...appearance, color }),
      setRadius: (radius) => publish({ ...appearance, radius }),
      setFont: (font) => publish({ ...appearance, font }),
    }),
    [appearance]
  )

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}
