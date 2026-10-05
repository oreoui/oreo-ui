"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

import { cn } from "@/lib/cn"
import { getAppliedTheme, commitTheme, subscribeTheme, type ThemeName } from "@/lib/theme"

function sleep(ms: number): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>()
  setTimeout(resolve, ms)
  return promise
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOOK: useCelestialTheme
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CelestialThemeState {
  theme: ThemeName
  isDark: boolean
  isTransitioning: boolean
  toggleTheme: () => Promise<void>
  setTheme: (target: ThemeName) => Promise<void>
}

let activeTransitionPromise: Promise<void> | null = null
let isGlobalTransitioning = false
const busyListeners = new Set<() => void>()

function subscribeBusy(cb: () => void) {
  busyListeners.add(cb)
  return () => {
    busyListeners.delete(cb)
  }
}

function setGlobalTransitioning(busy: boolean) {
  isGlobalTransitioning = busy
  for (const fn of busyListeners) {
    fn()
  }
}

/**
 * Reactive hook for theme state and running the celestial transition.
 */
export function useCelestialTheme(): CelestialThemeState {
  const theme = React.useSyncExternalStore(
    subscribeTheme,
    getAppliedTheme,
    () => "light" as ThemeName
  )
  const isTransitioning = React.useSyncExternalStore(
    subscribeBusy,
    () => isGlobalTransitioning,
    () => false
  )
  const runTransition = React.useCallback(async (target: ThemeName) => {
    if (activeTransitionPromise) return activeTransitionPromise

    const current = getAppliedTheme()
    if (current === target) return

    setGlobalTransitioning(true)
    const promise = runCelestialOrchestration(target)
      .catch((err) => {
        console.error("Celestial transition error:", err)
        commitTheme(target)
      })
      .finally(() => {
        activeTransitionPromise = null
        setGlobalTransitioning(false)
      })

    activeTransitionPromise = promise
    return promise
  }, [])

  const toggle = React.useCallback(async () => {
    const current = getAppliedTheme()
    const next: ThemeName = current === "dark" ? "light" : "dark"
    return runTransition(next)
  }, [runTransition])

  return {
    theme,
    isDark: theme === "dark",
    isTransitioning,
    toggleTheme: toggle,
    setTheme: runTransition,
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CELESTIAL ORCHESTRATION PIPELINE
   ═══════════════════════════════════════════════════════════════════════════ */

type OrchestratorStage = "idle" | "celestial" | "radial" | "complete"

interface OrchestrationEvent {
  stage: OrchestratorStage
  targetTheme: ThemeName
}

let currentOrchestrationEvent: OrchestrationEvent = {
  stage: "idle",
  targetTheme: "light",
}
const orchestrationListeners = new Set<() => void>()

function subscribeOrchestration(cb: () => void) {
  orchestrationListeners.add(cb)
  return () => {
    orchestrationListeners.delete(cb)
  }
}

function emitStage(stage: OrchestratorStage, targetTheme: ThemeName) {
  currentOrchestrationEvent = { stage, targetTheme }
  for (const fn of orchestrationListeners) {
    fn()
  }
}

async function runCelestialOrchestration(targetTheme: ThemeName): Promise<void> {
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  if (prefersReduced) {
    commitTheme(targetTheme)
    return
  }

  // Phase 1: Reveal Sun / Moon icon at dead-center with popping companion clouds
  emitStage("celestial", targetTheme)
  await sleep(400)

  // Phase 2: Radial wave expansion from center + View Transition
  emitStage("radial", targetTheme)

  const hasViewTransition =
    typeof document !== "undefined" && "startViewTransition" in document

  if (hasViewTransition) {
    try {
      const vt = (
        document as unknown as {
          startViewTransition: (cb: () => void) => {
            ready: Promise<void>
            finished: Promise<void>
          }
        }
      ).startViewTransition(() => {
        commitTheme(targetTheme)
      })

      await vt.ready

      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2
      const maxRadius = Math.hypot(centerX, centerY)

      if ("animate" in document.documentElement) {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${centerX}px ${centerY}px)`,
              `circle(${maxRadius}px at ${centerX}px ${centerY}px)`,
            ],
          },
          {
            duration: 720,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      }

      await vt.finished
    } catch {
      commitTheme(targetTheme)
    }
  } else {
    // Fallback path: commit theme mid-wave
    await sleep(220)
    commitTheme(targetTheme)
    await sleep(480)
  }

  // Phase 4: Clean up overlay
  emitStage("complete", targetTheme)
  await sleep(180)
  emitStage("idle", targetTheme)
}

/* ═══════════════════════════════════════════════════════════════════════════
   OVERLAY: Full-Screen Celestial SVGs
   ═══════════════════════════════════════════════════════════════════════════ */

export function CelestialOverlayPortal() {
  const activeEvent = React.useSyncExternalStore(
    subscribeOrchestration,
    () => currentOrchestrationEvent,
    () => ({ stage: "idle" as OrchestratorStage, targetTheme: "light" as ThemeName })
  )

  if (typeof document === "undefined" || activeEvent.stage === "idle") return null

  const isSwitchingToLight = activeEvent.targetTheme === "light"
  const showCelestial = activeEvent.stage === "celestial" || activeEvent.stage === "radial"
  const showRadial = activeEvent.stage === "radial"

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[999999] select-none overflow-hidden"
    >
      {/* Background tint veil */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "absolute inset-0 backdrop-blur-[2px]",
          isSwitchingToLight
            ? "bg-amber-500/10"
            : "bg-indigo-950/20"
        )}
      />

      {/* DEAD-CENTER CELESTIAL GLYPH: Sun or Moon with Popping Companion Clouds */}

      {/* DEAD-CENTER CELESTIAL GLYPH: Velvety Pop and Settle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {showCelestial && (
            <motion.div
              key={activeEvent.targetTheme}
              initial={{ scale: 0.3, opacity: 0, rotate: -20, filter: "blur(6px)" }}
              animate={{ scale: 1, opacity: 1, rotate: 0, filter: "blur(0px)" }}
              exit={{ scale: 1.35, opacity: 0, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                stiffness: 150,
                damping: 20,
                mass: 0.85,
              }}
              className="relative flex items-center justify-center"
            >
              {isSwitchingToLight ? <CelestialSunIcon /> : <CelestialMoonIcon />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RADIAL WAVE RIPPLES EXPANDING FROM SCREEN CENTER */}
      {showRadial && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.circle
            cx="50%"
            cy="50%"
            r="12"
            initial={{ r: 12, opacity: 0.85, strokeWidth: 8 }}
            animate={{ r: "155vmax", opacity: 0, strokeWidth: 1.5 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            fill="none"
            stroke={isSwitchingToLight ? "#f59e0b" : "#6366f1"}
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="12"
            initial={{ r: 12, opacity: 0.65, strokeWidth: 14 }}
            animate={{ r: "145vmax", opacity: 0, strokeWidth: 1 }}
            transition={{ duration: 0.88, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            fill="none"
            stroke={isSwitchingToLight ? "#fbbf24" : "#818cf8"}
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="12"
            initial={{ r: 12, opacity: 0.45, strokeWidth: 20 }}
            animate={{ r: "135vmax", opacity: 0, strokeWidth: 0.5 }}
            transition={{ duration: 0.95, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            fill="none"
            stroke={isSwitchingToLight ? "#fde68a" : "#c7d2fe"}
          />
        </svg>
      )}
    </div>,
    document.body
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   SVG ARTWORK: Handcrafted Clouds & Celestial Icons
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   MINI COMPANION CLOUD PUFF (Pops playfully around Sun and Moon)
   ═══════════════════════════════════════════════════════════════════════════ */
function MiniCloudPuffSvg({
  fill,
  stroke,
  flip = false,
}: {
  fill: string
  stroke: string
  flip?: boolean
}) {
  return (
    <svg
      viewBox="0 0 140 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      className="h-auto w-full drop-shadow-md"
    >
      <path
        d="M 25 65
           C 12 65, 4 54, 8 42
           C 10 32, 22 26, 34 28
           C 40 14, 58 6, 74 12
           C 84 4, 102 4, 114 14
           C 126 10, 138 20, 136 34
           C 142 45, 136 60, 122 64
           Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.8"
      />
      <path
        d="M 40 40 C 52 34, 68 36, 78 44"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  )
}

function CelestialSunIcon() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Radiant ambient glow */}
      <div className="absolute size-48 rounded-full bg-amber-400/30 blur-2xl" />

      {/* Mini Companion Cloud 1: Bottom-Left Cuddle */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: -14, y: 16 }}
        animate={{ scale: 1, opacity: 1, x: 0, y: [0, -3, 0] }}
        transition={{
          scale: { type: "spring", stiffness: 220, damping: 13, delay: 0.12 },
          opacity: { duration: 0.2, delay: 0.12 },
          y: { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
        }}
        className="pointer-events-none absolute -bottom-3 -left-8 z-20 w-20"
      >
        <MiniCloudPuffSvg
          fill="rgba(255, 255, 255, 0.96)"
          stroke="rgba(245, 190, 80, 0.65)"
        />
      </motion.div>

      {/* Mini Companion Cloud 2: Top-Right Float */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: 14, y: -14 }}
        animate={{ scale: 0.88, opacity: 1, x: 0, y: [0, 3, 0] }}
        transition={{
          scale: { type: "spring", stiffness: 240, damping: 14, delay: 0.18 },
          opacity: { duration: 0.2, delay: 0.18 },
          y: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
        }}
        className="pointer-events-none absolute -right-6 -top-2 z-20 w-16"
      >
        <MiniCloudPuffSvg
          fill="rgba(255, 250, 240, 0.94)"
          stroke="rgba(245, 190, 80, 0.55)"
          flip
        />
      </motion.div>

      {/* Mini Companion Cloud 3: Bottom-Right Accent */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 12, x: 8 }}
        animate={{ scale: 0.65, opacity: 0.9, y: 0, x: 0 }}
        transition={{
          scale: { type: "spring", stiffness: 260, damping: 15, delay: 0.24 },
          opacity: { duration: 0.2, delay: 0.24 },
        }}
        className="pointer-events-none absolute -bottom-5 right-1 z-10 w-14"
      >
        <MiniCloudPuffSvg
          fill="rgba(255, 255, 255, 0.92)"
          stroke="rgba(245, 190, 80, 0.45)"
        />
      </motion.div>

      {/* Sun Core SVG with spinning rays */}
      <svg
        viewBox="0 0 120 120"
        className="size-28 animate-[spin_18s_linear_infinite] drop-shadow-[0_4px_24px_rgba(245,158,11,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Core disk */}
        <circle cx="60" cy="60" r="26" fill="#f59e0b" />
        <circle cx="60" cy="60" r="21" fill="#fbbf24" />

        {/* 12 Radiant Rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12
          return (
            <line
              key={i}
              x1="60"
              y1="22"
              x2="60"
              y2="10"
              stroke="#fbbf24"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${angle} 60 60)`}
            />
          )
        })}
      </svg>
    </div>
  )
}

function CelestialMoonIcon() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Soft celestial glow */}
      <div className="absolute size-48 rounded-full bg-indigo-500/25 blur-2xl" />

      {/* Mini Companion Cloud 1: Bottom Curve Cuddle (storybook night sky) */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: -12, y: 15 }}
        animate={{ scale: 1, opacity: 1, x: 0, y: [0, -3, 0] }}
        transition={{
          scale: { type: "spring", stiffness: 220, damping: 13, delay: 0.12 },
          opacity: { duration: 0.2, delay: 0.12 },
          y: { duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
        }}
        className="pointer-events-none absolute -bottom-3 -left-5 z-20 w-20"
      >
        <MiniCloudPuffSvg
          fill="rgba(42, 46, 68, 0.95)"
          stroke="rgba(165, 180, 252, 0.55)"
        />
      </motion.div>

      {/* Mini Companion Cloud 2: Top-Right Tip Drift */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: 12, y: -12 }}
        animate={{ scale: 0.82, opacity: 0.95, x: 0, y: [0, 3, 0] }}
        transition={{
          scale: { type: "spring", stiffness: 240, damping: 14, delay: 0.18 },
          opacity: { duration: 0.2, delay: 0.18 },
          y: { duration: 2.9, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
        }}
        className="pointer-events-none absolute -right-8 top-1 z-10 w-16"
      >
        <MiniCloudPuffSvg
          fill="rgba(36, 39, 58, 0.92)"
          stroke="rgba(140, 160, 240, 0.45)"
          flip
        />
      </motion.div>

      {/* Mini Companion Cloud 3: Upper-Left Wispy Accent */}
      <motion.div
        initial={{ scale: 0, opacity: 0, x: -10, y: -8 }}
        animate={{ scale: 0.62, opacity: 0.85, x: 0, y: 0 }}
        transition={{
          scale: { type: "spring", stiffness: 260, damping: 15, delay: 0.24 },
          opacity: { duration: 0.2, delay: 0.24 },
        }}
        className="pointer-events-none absolute -left-8 -top-2 z-10 w-14"
      >
        <MiniCloudPuffSvg
          fill="rgba(48, 52, 76, 0.88)"
          stroke="rgba(150, 165, 230, 0.35)"
        />
      </motion.div>

      {/* Moon Crescent SVG */}
      <svg
        viewBox="0 0 120 120"
        className="size-28 drop-shadow-[0_4px_24px_rgba(99,102,241,0.5)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Crescent path */}
        <path
          d="M 72 26
             C 45 26, 26 46, 26 72
             C 26 98, 47 114, 76 114
             C 88 114, 98 108, 102 104
             C 84 100, 68 84, 68 64
             C 68 45, 80 32, 94 28
             C 88 26, 80 26, 72 26 Z"
          fill="#c7d2fe"
          stroke="#818cf8"
          strokeWidth="2.5"
        />
        {/* Micro craters */}
        <circle cx="48" cy="68" r="4" fill="#a5b4fc" opacity="0.6" />
        <circle cx="56" cy="88" r="3" fill="#a5b4fc" opacity="0.5" />
        <circle cx="42" cy="80" r="2" fill="#a5b4fc" opacity="0.4" />
      </svg>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT: CelestialToggle
   ═══════════════════════════════════════════════════════════════════════════ */

export interface CelestialToggleProps {
  /** Visual presentation format. */
  variant?: "pill" | "icon" | "minimal"
  /** Size scale. */
  size?: "sm" | "md" | "lg"
  /** Additional CSS class name. */
  className?: string
  /** Accessible label override. */
  ariaLabel?: string
}

export function CelestialToggle({
  variant = "pill",
  size = "md",
  className,
  ariaLabel,
}: CelestialToggleProps) {
  const { theme, isDark, isTransitioning, toggleTheme } = useCelestialTheme()
  const reduceMotion = useReducedMotion()

  const defaultLabel = isDark ? "Switch to light theme" : "Switch to dark theme"

  const sizeStyles = {
    sm: "h-8 px-2.5 text-xs gap-1.5",
    md: "h-9 px-3 text-[13px] gap-2",
    lg: "h-10 px-4 text-sm gap-2.5",
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  }

  return (
    <>
      <motion.button
        type="button"
        disabled={isTransitioning}
        aria-label={ariaLabel || defaultLabel}
        aria-pressed={isDark}
        onClick={() => void toggleTheme()}
        whileTap={{ scale: reduceMotion ? 1 : 0.96 }}
        className={cn(
          "oreo-clickable inline-flex items-center justify-center font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--oreo-border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--oreo-bg-base)]",
          variant === "pill" && [
            "rounded-full border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] text-[var(--oreo-text-primary)] shadow-sm hover:bg-[var(--oreo-bg-elevated)]",
            sizeStyles[size],
          ],
          variant === "icon" && [
            "rounded-full border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] text-[var(--oreo-text-primary)] shadow-sm hover:bg-[var(--oreo-bg-elevated)]",
            size === "sm" && "size-8",
            size === "md" && "size-9",
            size === "lg" && "size-10",
          ],
          variant === "minimal" && [
            "rounded-[var(--oreo-radius-sm)] text-[var(--oreo-text-secondary)] hover:bg-[var(--oreo-bg-subtle)] hover:text-[var(--oreo-text-primary)]",
            sizeStyles[size],
          ],
          className
        )}
      >
        {isDark ? (
          <Moon size={iconSizes[size]} className="text-amber-400 dark:text-indigo-300" />
        ) : (
          <Sun size={iconSizes[size]} className="text-amber-600 dark:text-amber-400" />
        )}

        {variant !== "icon" && (
          <span className="capitalize tracking-tight">
            {theme}
          </span>
        )}
      </motion.button>

      {/* Global Transition Overlay Host */}
      <CelestialOverlayPortal />
    </>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   COMPONENT: AtmosphericCanvas
   ═══════════════════════════════════════════════════════════════════════════ */

export interface AtmosphericCanvasProps {
  /** Background pattern style. Default: "none" for a clean editorial surface. */
  pattern?: "none" | "grid" | "isometric" | "cross"
  patternOpacity?: number
  /** Pattern cell step in pixels. */
  patternSize?: number
  /** Optional hero image URL or texture path. */
  heroImage?: string
  /** Whether to show the editorial cloud horizon at bottom. */
  showCloudHorizon?: boolean
  /** Class name passthrough. */
  className?: string
  /** Content children. */
  children?: React.ReactNode
}

/**
 * Atmospheric background surface that provides warm editorial textures,
 * subtle matrix patterns, and ambient depth inspired by ciptadusa.com.
 */
export function AtmosphericCanvas({
  pattern = "none",
  patternOpacity = 0.35,
  patternSize = 24,
  heroImage,
  showCloudHorizon = true,
  className,
  children,
}: AtmosphericCanvasProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen w-full overflow-hidden bg-[var(--oreo-bg-base)] text-[var(--oreo-text-primary)] transition-colors duration-300",
        className
      )}
    >
      {/* PATTERN LAYER: Subtle texture filling blank areas */}
      {pattern !== "none" && (
        <div
          aria-hidden="true"
          style={{
            opacity: patternOpacity,
            backgroundSize: `${patternSize}px ${patternSize}px`,
            backgroundImage: getPatternStyle(pattern),
          }}
          className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply dark:mix-blend-screen"
        />
      )}

      {/* OPTIONAL HERO BACKGROUND IMAGE */}
      {heroImage && (
        <div
          aria-hidden="true"
          style={{ backgroundImage: `url(${heroImage})` }}
          className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-cover bg-center opacity-25 mix-blend-luminosity"
        />
      )}

      {/* CLOUD HORIZON LAYER: Handcrafted cloud silhouettes grounding the bottom */}
      {showCloudHorizon && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-44 overflow-hidden opacity-60 dark:opacity-30"
        >
          <svg
            viewBox="0 0 1440 220"
            fill="none"
            preserveAspectRatio="none"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Back cloud layer */}
            <path
              d="M 0 160
                 C 140 120, 260 140, 380 150
                 C 490 125, 620 110, 740 135
                 C 860 110, 990 130, 1120 145
                 C 1260 120, 1370 140, 1440 155
                 L 1440 220 L 0 220 Z"
              fill="var(--oreo-bg-subtle)"
            />
            {/* Front cloud layer */}
            <path
              d="M 0 180
                 C 120 150, 240 170, 360 165
                 C 500 145, 640 150, 780 170
                 C 920 140, 1060 160, 1200 175
                 C 1320 155, 1400 170, 1440 180
                 L 1440 220 L 0 220 Z"
              fill="var(--oreo-bg-elevated)"
            />
          </svg>
        </div>
      )}

      {/* CONTENT LAYER */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {children}
      </div>
    </div>
  )
}

function getPatternStyle(pattern: "none" | "grid" | "isometric" | "cross"): string {
  switch (pattern) {
    case "grid":
      return "linear-gradient(to right, var(--oreo-border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--oreo-border-subtle) 1px, transparent 1px)"
    case "cross":
      return "radial-gradient(circle, var(--oreo-border-subtle) 10%, transparent 11%), radial-gradient(circle at 0 0, var(--oreo-border-subtle) 10%, transparent 11%)"
    case "isometric":
      return "repeating-linear-gradient(45deg, var(--oreo-border-subtle) 0, var(--oreo-border-subtle) 1px, transparent 0, transparent 50%)"
    default:
      return "none"
  }
}
