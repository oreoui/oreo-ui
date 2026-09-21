"use client"

import { motion, useReducedMotion } from "framer-motion"

import { ChatMockup } from "@/components/chat-mockup"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function Home() {
  const reduceMotion = useReducedMotion()
  const transition = { duration: reduceMotion ? 0 : 0.35, ease: [0.2, 0, 0, 1] as const }

  return (
    <main className="flex min-h-screen flex-col justify-between bg-[var(--oreo-bg-base)] p-8 text-[var(--oreo-text-primary)] antialiased md:p-14">
      <header className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex w-full items-center justify-between">
          <span className="text-[13px] font-medium uppercase tracking-wider text-[var(--oreo-text-secondary)]">OreoUI</span>
          <Avatar type="logo" size={40} />
        </div>
        <motion.h1
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="text-[64px] font-medium leading-none tracking-tight md:text-[88px]"
        >
          Welcome
        </motion.h1>
      </header>

      <section className="mx-auto my-12 flex w-full max-w-7xl flex-col items-center justify-between gap-12 lg:flex-row">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.08 }}
          className="flex w-full flex-col gap-6 lg:max-w-md"
        >
          <div className="text-[15px] font-medium">Hi :)</div>
          <div className="space-y-4 text-[14px] font-normal leading-[1.6] text-[var(--oreo-text-secondary)]">
            <p>
              Most UI kits weren&apos;t made for AI. We built one that is. OreoUI is a Figma component library focused
              entirely on <strong className="font-medium text-[var(--oreo-text-primary)]">AI agent interfaces</strong>:
              prompt composition, reasoning states, streaming conversations, and everything in between.
            </p>
            <p>
              Every component is crafted with obsessive attention to detail. Light &amp; dark mode. Pixel-perfect
              variants. Designed to feel as intelligent as the products you&apos;re building.
            </p>
            <p>Design-first. Code is next. We&apos;re actively building. Follow along.</p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              onClick={() => window.open("https://github.com/oreoui", "_blank", "noopener,noreferrer")}
            >
              View on GitHub
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.16 }}
          className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[32px] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] p-6 sm:p-10 lg:w-[720px]"
        >
          <ChatMockup />
        </motion.div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between border-t border-[var(--oreo-border-subtle)] pt-8 text-[13px] text-[var(--oreo-text-secondary)]">
        <div>© OreoUI 2026</div>
        <Button
          variant="secondary"
          onClick={() => window.open("https://github.com/oreoui", "_blank", "noopener,noreferrer")}
        >
          View on GitHub
        </Button>
      </footer>
    </main>
  )
}