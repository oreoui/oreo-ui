"use client"

import type { Meta, StoryObj } from "@storybook/react"
import { motion, useReducedMotion } from "framer-motion"

const meta: Meta = {
  title: "Foundations/Overview",
  parameters: { layout: "fullscreen" },
}

export default meta

const colorTokens = [
  ["Bg/Base", "#ffffff", "var(--oreo-bg-base)"],
  ["Bg/Elevated", "#f9f9f9", "var(--oreo-bg-elevated)"],
  ["Bg/Inverse", "#202020", "var(--oreo-bg-inverse)"],
  ["Text/Primary", "#000000", "var(--oreo-text-primary)"],
  ["Text/Secondary", "#646464", "var(--oreo-text-secondary)"],
  ["Text/Placeholder", "#8d8d8d", "var(--oreo-text-placeholder)"],
] as const

const typeTokens = [
  ["Display", "42px", "Semibold"],
  ["Headline Large", "24px", "Semibold"],
  ["Headline Medium", "20px", "Semibold"],
  ["Headline Small", "17px", "Semibold"],
  ["Label Medium", "14px", "Medium"],
  ["Body Medium", "14px / 1.43", "Regular"],
  ["Code Medium", "14px", "Regular"],
] as const

const spacing = [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 36, 48, 64, 96, 128]

function FoundationPreview() {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.25, ease: [0.2, 0, 0, 1] as const }

  return (
    <main className="min-h-dvh bg-white px-4 py-10 text-black sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[998px]">
        <div className="flex items-center justify-between">
          <div className="flex gap-6 text-[14px]"><strong>OreoUI</strong><span className="text-[#8d8d8d]">Foundations</span></div>
          <span aria-hidden="true" className="grid size-12 place-items-center rounded-full bg-black text-lg font-semibold text-white">O</span>
        </div>
        <h1 className="mt-8 text-5xl font-medium tracking-[-0.06em] sm:text-7xl">Foundations</h1>

        <div className="mt-16 grid gap-16">
          <section>
            <h2 className="text-2xl font-semibold">Color</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {colorTokens.map(([name, value, token], index) => (
                <motion.div key={name} initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...transition, delay: reduceMotion ? 0 : index * 0.03 }} className="rounded-[var(--oreo-radius-lg)] border border-black/[0.09] p-3">
                  <div className="h-20 rounded-[var(--oreo-radius-md)] border border-black/[0.09]" style={{ background: token }} />
                  <p className="mt-3 text-[14px] font-medium">{name}</p>
                  <p className="mt-1 font-mono text-[12px] text-[#646464]">{value}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Typography</h2>
            <div className="mt-6 divide-y divide-black/[0.09] border-y border-black/[0.09]">
              {typeTokens.map(([name, size, weight]) => (
                <div key={name} className="grid gap-2 py-4 sm:grid-cols-[180px_1fr_150px] sm:items-center">
                  <code className="text-[12px] text-[#646464]">Inter / {weight} / {size}</code>
                  <span className={name === "Display" ? "text-[32px] font-semibold tracking-[-0.04em] sm:text-[42px]" : name.includes("Headline") ? "text-xl font-semibold" : "text-sm"}>{name}</span>
                  <span className="text-[13px] text-[#646464]">{weight}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold">Elevation</h2>
              <div className="mt-6 grid grid-cols-2 gap-8 p-6">
                {[["Default", "var(--oreo-shadow-default)"], ["Active", "var(--oreo-shadow-active)"], ["Floating", "var(--oreo-shadow-floating)"], ["Overlay", "var(--oreo-shadow-overlay)"]].map(([name, shadow]) => <div key={name} className="grid aspect-[2/1] place-items-center rounded-[var(--oreo-radius-lg)] border border-black/[0.09] bg-white text-sm" style={{ boxShadow: shadow }}><span>{name}</span></div>)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Radius</h2>
              <div className="mt-6 grid grid-cols-3 gap-4">
                {[["4", "var(--oreo-radius-xs)"], ["8", "var(--oreo-radius-sm)"], ["12", "var(--oreo-radius-md)"], ["16", "var(--oreo-radius-lg)"], ["20", "var(--oreo-radius-xl)"], ["24", "var(--oreo-radius-2xl)"]].map(([name, radius]) => <div key={name} className="grid aspect-square place-items-center border border-black/[0.12] bg-black/[0.05] text-xs" style={{ borderRadius: radius }}><span>{name}px</span></div>)}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">Space</h2>
            <div className="mt-6 grid grid-cols-3 gap-x-8 gap-y-4 sm:grid-cols-5">
              {spacing.map((value) => <div key={value} className="flex items-center gap-3"><span className="h-3 bg-black/[0.08]" style={{ width: value }} /><code className="text-[12px] text-[#646464]">{value}</code></div>)}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

export const Overview: StoryObj = {
  render: () => <FoundationPreview />,
}
