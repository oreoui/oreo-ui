"use client"

import * as React from "react"

/** Client-only media query. The server snapshot is false so hydration matches. */
export function useMediaQuery(query: string): boolean {
  return React.useSyncExternalStore(
    (onStoreChange) => {
      const media = window.matchMedia(query)
      media.addEventListener("change", onStoreChange)
      return () => media.removeEventListener("change", onStoreChange)
    },
    () => window.matchMedia(query).matches,
    () => false
  )
}

/** True after hydration. Lets portals render without a setState-in-effect mount flag. */
export function useIsClient(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}
