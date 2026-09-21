"use client"

import { Check, Copy } from "lucide-react"
import * as React from "react"

import { IconButton } from "@/components/ui/icon-button"
import { ImageTile } from "@/components/ui/image-grid"
import { MediaPlayer } from "@/components/ui/media-player"
import { cn } from "@/lib/cn"

/* ------------------------------------------------------------------ *
 * Interactive Code Block with Copy Button
 * ------------------------------------------------------------------ */

function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => undefined)
  }

  return (
    <div className="relative my-3 overflow-hidden rounded-[12px] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] shadow-sm">
      <div className="flex h-9 items-center justify-between border-b border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] px-3.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--oreo-text-tertiary)]">
          {language || "code"}
        </span>
        <IconButton
          variant="ghost"
          aria-label={copied ? "Copied code" : "Copy code"}
          icon={copied ? <Check size={14} className="text-[var(--oreo-status-success)]" /> : <Copy size={14} />}
          onClick={handleCopy}
          className="-mr-1 size-[28px] text-[var(--oreo-text-tertiary)] hover:text-[var(--oreo-text-primary)]"
        />
      </div>
      <pre className="overflow-x-auto p-3.5 font-mono text-[13px] leading-[1.6] text-[var(--oreo-text-primary)]">
        <code>{code}</code>
      </pre>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Inline Parser for Bold, Italic, Links, and Inline Code
 * ------------------------------------------------------------------ */

function renderInline(text: string): React.ReactNode {
  // Split on code `...`, bold **...**, italic *...*, links [...](...)
  const tokens: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Check for inline code `...`
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      tokens.push(
        <code
          key={key++}
          className="rounded-[4px] border border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-subtle)] px-1.5 py-0.5 font-mono text-[12px] text-[var(--oreo-text-primary)]"
        >
          {codeMatch[1]}
        </code>
      )
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // Check for bold **...**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/)
    if (boldMatch) {
      tokens.push(<strong key={key++} className="font-semibold text-[var(--oreo-text-primary)]">{boldMatch[1]}</strong>)
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // Check for italic *...*
    const italicMatch = remaining.match(/^\*([^*]+)\*/)
    if (italicMatch) {
      tokens.push(<em key={key++} className="italic">{italicMatch[1]}</em>)
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // Check for links [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      tokens.push(
        <a
          key={key++}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[var(--oreo-status-progress)] underline underline-offset-4 hover:opacity-80"
        >
          {linkMatch[1]}
        </a>
      )
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    // Text up to the next potential token
    const nextSpecial = remaining.search(/[`*\[]/)
    if (nextSpecial === -1) {
      tokens.push(remaining)
      break
    } else if (nextSpecial === 0) {
      tokens.push(remaining[0])
      remaining = remaining.slice(1)
    } else {
      tokens.push(remaining.slice(0, nextSpecial))
      remaining = remaining.slice(nextSpecial)
    }
  }

  return tokens
}

/* ------------------------------------------------------------------ *
 * Block-Level Markdown Parser
 * ------------------------------------------------------------------ */

export interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  // Streaming re-renders every frame; parsing on each one is O(n) per token, i.e. O(n^2)
  // across a response. Parse once per content value.
  const elements = React.useMemo(() => parseMarkdown(content), [content])

  return <div className={cn("flex flex-col text-[14px]", className)}>{elements}</div>
}

function parseMarkdown(content: string): React.ReactNode[] {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code Block: ```lang
    if (line.startsWith("```")) {
      const language = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      i++ // Skip closing ```
      elements.push(<CodeBlock key={key++} code={codeLines.join("\n")} language={language} />)
      continue
    }

    // Media element: ![alt](url)
    const mediaMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (mediaMatch) {
      const alt = mediaMatch[1]
      const url = mediaMatch[2]
      const isVideo = url.endsWith(".mp4") || url.endsWith(".webm") || alt.toLowerCase().includes("video")

      if (isVideo) {
        elements.push(<div key={key++} className="my-3"><MediaPlayer src={url} /></div>)
      } else {
        elements.push(
          <div key={key++} className="my-3 max-w-md overflow-hidden rounded-[12px]">
            <ImageTile src={url} alt={alt} aspectRatio="16:9" />
          </div>
        )
      }
      i++
      continue
    }

    // Headings
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="mb-2 mt-4 text-[17px] font-semibold text-[var(--oreo-text-primary)]">{renderInline(line.slice(4))}</h3>)
      i++
      continue
    }
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="mb-2 mt-5 text-[20px] font-semibold tracking-[-0.01em] text-[var(--oreo-text-primary)]">{renderInline(line.slice(3))}</h2>)
      i++
      continue
    }
    if (line.startsWith("# ")) {
      elements.push(<h1 key={key++} className="mb-3 mt-6 text-[24px] font-semibold tracking-[-0.02em] text-[var(--oreo-text-primary)]">{renderInline(line.slice(2))}</h1>)
      i++
      continue
    }

    // Blockquote: > text
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={key++} className="my-3 rounded-[8px] bg-[var(--oreo-bg-elevated)] px-3.5 py-3 text-[14px] leading-[1.6] text-[var(--oreo-text-secondary)]">
          {renderInline(line.slice(2))}
        </blockquote>
      )
      i++
      continue
    }

    // Table: | a | b |
    if (line.startsWith("|") && line.endsWith("|")) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith("|")) {
        tableLines.push(lines[i])
        i++
      }
      const headers = tableLines[0].split("|").slice(1, -1).map(s => s.trim())
      const rows = tableLines.slice(2).map(r => r.split("|").slice(1, -1).map(s => s.trim()))

      elements.push(
        <div key={key++} className="my-3 overflow-x-auto rounded-[8px] border border-[var(--oreo-border-subtle)]">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-elevated)] font-medium text-[var(--oreo-text-secondary)]">
              <tr>
                {headers.map((h, idx) => (
                  <th key={idx} scope="col" className="px-3.5 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--oreo-border-subtle)] bg-[var(--oreo-bg-surface)] text-[var(--oreo-text-primary)]">
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // List: - or *
    if (line.match(/^[-*]\s+/)) {
      const listItems: string[] = []
      while (i < lines.length && lines[i].match(/^[-*]\s+/)) {
        listItems.push(lines[i].replace(/^[-*]\s+/, ""))
        i++
      }
      elements.push(
        <ul key={key++} className="my-2.5 ml-4 list-disc space-y-1 text-[14px] leading-[1.5] text-[var(--oreo-text-secondary)] marker:text-[var(--oreo-text-tertiary)]">
          {listItems.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Blank line
    if (!line.trim()) {
      i++
      continue
    }

    // Regular paragraph
    elements.push(
      <p key={key++} className="my-2 text-[14px] leading-[1.6] text-[var(--oreo-text-primary)]">
        {renderInline(line)}
      </p>
    )
    i++
  }

  return elements
}
