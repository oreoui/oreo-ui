import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import {
  AtmosphericCanvas,
  CelestialToggle,
} from "./atmospheric-canvas"
import { Button } from "./button"

const meta = {
  title: "Primitives/AtmosphericCanvas",
  component: AtmosphericCanvas,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AtmosphericCanvas>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Clean editorial landing surface with atmospheric cloud horizon.
 * Click the CelestialToggle in the top navigation to trigger the centered
 * Sun/Moon reveal with popping companion clouds and radial wave transition.
 */
export const Default: Story = {
  args: {
    pattern: "none",
    showCloudHorizon: true,
  },
  render: (args) => (
    <AtmosphericCanvas {...args}>
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-[var(--oreo-radius-sm)] bg-[var(--oreo-text-primary)] text-xs font-bold text-[var(--oreo-bg-base)]">
            O
          </div>
          <span className="text-[14px] font-semibold tracking-tight">OreoUI Studio</span>
        </div>

        <nav className="hidden items-center gap-6 text-[13px] font-medium text-[var(--oreo-text-secondary)] sm:flex">
          <span className="font-semibold text-[var(--oreo-text-primary)]">Overview</span>
          <span>Primitives</span>
          <span>Atmosphere</span>
          <span>Documentation</span>
        </nav>

        <div className="flex items-center gap-3">
          <CelestialToggle variant="pill" size="sm" />
          <Button variant="primary">
            Get Started
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] px-3.5 py-1 text-xs font-medium text-[var(--oreo-text-secondary)] shadow-sm">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>No AI Slop: Craft-led Engineering</span>
        </div>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-6xl text-[var(--oreo-text-primary)]">
          Software crafted with editorial discipline
        </h1>

        <p className="mt-5 max-w-2xl text-base sm:text-lg text-[var(--oreo-text-secondary)] leading-relaxed">
          Inspired by quiet, intentional design. A bespoke atmospheric background canvas with subtle matrix patterns, paired with a full-screen celestial View Transition.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary">
            Explore Primitives
          </Button>
          <Button variant="secondary">
            View Source Code
          </Button>
        </div>

        {/* Trajectory milestone line inspired by ciptadusa.com */}
        <div className="mt-16 w-full max-w-2xl rounded-[var(--oreo-radius-lg)] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)]/70 p-6 backdrop-blur-sm shadow-sm">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="text-left">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--oreo-text-tertiary)]">Reliability</span>
              <p className="mt-1 text-2xl font-semibold text-[var(--oreo-text-primary)]">99.9%</p>
              <span className="text-xs text-[var(--oreo-text-secondary)]">Zero-jank View Transitions</span>
            </div>
            <div className="text-left">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--oreo-text-tertiary)]">Architecture</span>
              <p className="mt-1 text-2xl font-semibold text-[var(--oreo-text-primary)]">WCAG AA</p>
              <span className="text-xs text-[var(--oreo-text-secondary)]">Accessible contrast throughout</span>
            </div>
            <div className="text-left">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--oreo-text-tertiary)]">Performance</span>
              <p className="mt-1 text-2xl font-semibold text-[var(--oreo-text-primary)]">60 FPS</p>
              <span className="text-xs text-[var(--oreo-text-secondary)]">Hardware-accelerated clip path</span>
            </div>
          </div>
        </div>
      </main>
    </AtmosphericCanvas>
  ),
}

/**
 * Architectural grid pattern variant.
 */
export const ArchitecturalGrid: Story = {
  args: {
    pattern: "grid",
    patternOpacity: 0.3,
    patternSize: 32,
    showCloudHorizon: true,
  },
  render: (args) => (
    <AtmosphericCanvas {...args}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center p-12 text-center">
        <h2 className="text-3xl font-semibold text-[var(--oreo-text-primary)]">
          Architectural Fine Grid Canvas
        </h2>
        <p className="mt-3 max-w-md text-sm text-[var(--oreo-text-secondary)]">
          Subtle geometric structure that fills blank areas without distracting from typography.
        </p>
        <div className="mt-6 flex items-center gap-3">
          <CelestialToggle variant="pill" />
          <CelestialToggle variant="icon" />
          <CelestialToggle variant="minimal" />
        </div>
      </div>
    </AtmosphericCanvas>
  ),
}

/**
 * Showcase of the three button variants for CelestialToggle:
 * pill (with label), icon (compact circle), and minimal.
 */
export const ToggleVariants: Story = {
  render: () => (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center gap-6 p-8 bg-[var(--oreo-bg-base)]">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <CelestialToggle variant="pill" size="sm" />
        <CelestialToggle variant="pill" size="md" />
        <CelestialToggle variant="pill" size="lg" />
      </div>

      <div className="flex items-center gap-4">
        <CelestialToggle variant="icon" size="sm" />
        <CelestialToggle variant="icon" size="md" />
        <CelestialToggle variant="icon" size="lg" />
      </div>

      <div className="flex items-center gap-4">
        <CelestialToggle variant="minimal" size="md" />
      </div>

      <p className="text-xs text-[var(--oreo-text-secondary)]">
        Click any variant to experience the full-screen celestial transition.
      </p>
    </div>
  ),
}
