"use client"

import { ArrowUp, AtSign, Paperclip } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"

import { Avatar, AvatarGroup } from "@/components/ui/avatar"
import { IconButton } from "@/components/ui/icon-button"
import { Loading } from "@/components/ui/loading"
import { Tag } from "@/components/ui/tag"

const conversation = [
  { name: "Nicole", role: "Product Designer", art: "bloom", initials: "NI", message: "Why does every AI app look like it was built in a weekend?", align: "start" },
  { name: "Yiqi", role: "Creative Designer", art: "void", initials: "YI", message: "Because no one sweats the details.", align: "end" },
  { name: "Mona", role: "Design Engineer", art: "jade", initials: "MO", message: "We do. Down to the last pixel!", align: "start" },
] as const

/** Hero conversation preview composed entirely from the library's primitives. */
export function ChatMockup() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.2, 0, 0, 1] }}
      className="relative w-full max-w-[560px] rounded-[20px] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] p-6 text-[14px] shadow-[var(--oreo-shadow-overlay)]"
    >
      {conversation.map(({ name, role, art, initials, message, align }) => (
        <div key={name} className={`mb-6 flex gap-3 ${align === "end" ? "flex-row-reverse" : ""}`}>
          <Avatar type="agent" agentArt={art} size={32} alt={name} />
          <div className={`space-y-1 ${align === "end" ? "text-right" : ""}`}>
            <div className="text-[12px] font-medium text-[var(--oreo-text-tertiary)]">
              {name} · {role}
            </div>
            <div
              className={`inline-block rounded-[12px] px-3.5 py-2 leading-snug ${
                align === "end" ? "bg-[var(--oreo-palette-purple-bg)] text-[var(--oreo-palette-purple-text)]" : "bg-[var(--oreo-bg-subtle)] text-[var(--oreo-text-primary)]"
              }`}
            >
              {message}
            </div>
          </div>
          {align === "end" && <Avatar type="initials" color="pink" initials={initials} size={32} alt="Yiqi" />}
        </div>
      ))}

      <div className="rounded-[16px] border border-[var(--oreo-border-default)] bg-[var(--oreo-bg-surface)] p-3.5">
        <div className="mb-2 flex items-center gap-2 text-[12px] text-[var(--oreo-text-secondary)]">
          <span>Build with</span>
          <AvatarGroup max={3} size={14}>
            <Avatar type="initials" color="blue" initials="N" size={14} alt="Nicole" />
            <Avatar type="initials" color="pink" initials="Y" size={14} alt="Yiqi" />
            <Avatar type="initials" color="orange" initials="M" size={14} alt="Mona" />
          </AvatarGroup>
          <span className="font-medium text-[var(--oreo-text-primary)]">Oreo Designers</span>
          <Tag palette="mint" className="ml-auto">Streaming</Tag>
        </div>

        <div className="mb-6 flex items-center gap-2 text-[14px] text-[var(--oreo-text-primary)]">
          Create an agent that actually feels premium
          <Loading type="dot" size={14} label="Agent is thinking" />
        </div>

        <div className="flex items-center justify-between text-[var(--oreo-text-secondary)]">
          <div className="flex items-center gap-1">
            <IconButton variant="ghost" aria-label="Attach file" icon={<Paperclip size={16} />} />
            <IconButton variant="ghost" aria-label="Mention item" icon={<AtSign size={16} />} />
          </div>
          <div className="flex items-center gap-2">
            <Tag palette="default" leadingIcon={<Avatar type="logo" size={14} />}>OreoUI</Tag>
            <IconButton variant="primary" shape="rounded" aria-label="Send prompt" icon={<ArrowUp size={16} />} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
