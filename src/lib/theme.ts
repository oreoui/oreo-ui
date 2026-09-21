/**
 * Theme storage and DOM contracts for OreoUI.
 *
 * Single source of truth for the theme attribute, class, and storage key.
 * Used by both layout.tsx's pre-paint script and client components.
 */

export type ThemeName = "light" | "dark"

export const THEME_STORAGE_KEY = "oreo-theme"
export const THEME_ATTR = "data-theme"
export const THEME_CLASS = "dark"

type ThemeListener = (theme: ThemeName) => void
const listeners = new Set<ThemeListener>()

/**
 * Returns the currently applied theme from the root element.
 * Safe in SSR (defaults to "light").
 */
export function getAppliedTheme(): ThemeName {
  if (typeof document === "undefined") return "light"
  const attr = document.documentElement.getAttribute(THEME_ATTR)
  if (attr === "dark" || attr === "light") return attr
  return document.documentElement.classList.contains(THEME_CLASS) ? "dark" : "light"
}

/**
 * Commits the theme to the DOM and localStorage, then notifies subscribers.
 */
export function commitTheme(theme: ThemeName): void {
  if (typeof document === "undefined") return
  document.documentElement.setAttribute(THEME_ATTR, theme)
  document.documentElement.classList.toggle(THEME_CLASS, theme === "dark")

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Ignore storage write errors (e.g. private browsing quota)
  }

  for (const listener of listeners) {
    listener(theme)
  }
}

/**
 * Subscribes to theme changes across the window.
 */
export function subscribeTheme(callback: ThemeListener): () => void {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

/**
 * Toggles the theme to the opposite of what is currently applied.
 */
export function toggleTheme(): ThemeName {
  const next = getAppliedTheme() === "dark" ? "light" : "dark"
  commitTheme(next)
  return next
}
