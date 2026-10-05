"use client"

import { Moon, Sun } from "lucide-react"
import * as React from "react"

import { IconButton } from "@/components/ui/icon-button"
import { getAppliedTheme, subscribeTheme, toggleTheme, type ThemeName } from "@/lib/theme"

export function ThemeToggle() {
  const theme = React.useSyncExternalStore(subscribeTheme, getAppliedTheme, (): ThemeName => "light")
  const nextLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme"

  return (
    <IconButton
      variant="secondary"
      shape="rectangle"
      aria-label={nextLabel}
      icon={theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      onClick={() => toggleTheme()}
    />
  )
}
