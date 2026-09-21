"use client"

import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"

import {
  ChatContainer,
  ChatMessage,
} from "./chat-container"
import { GenerationSkeleton } from "./generation-skeleton"
import { MediaPlayer } from "./media-player"

const meta: Meta<typeof ChatContainer> = {
  title: "Primitives/ChatContainer",
  component: ChatContainer,
  parameters: { layout: "fullscreen" },
}

export default meta

const sampleMarkdown = `### Component Specification: MediaPlayer

The \`MediaPlayer\` component delivers an agent-ready, responsive video wrapper with floating playback controls.

* **Aspect Ratios**: \`16:9\`, \`1:1\`, \`9:16\`, \`4:3\`
* **Framer Motion**: Smooth tap interactions and fading control overlays
* **Accessibility**: Proper \`aria-label\` attributes on every control

\`\`\`typescript
export function renderPlayer() {
  return (
    <MediaPlayer
      src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      aspectRatio="16:9"
      autoPlay={false}
    />
  )
}
\`\`\`

All tokens reference \`globals.css\` variables for light and dark theme parity.`

function FullAgentConversationDemo() {
  const [generating, setGenerating] = React.useState(true)

  return (
    <div className="min-h-dvh bg-[var(--oreo-bg-base)] py-6">
      <ChatContainer autoScroll={false}>
          {/* User message */}
          <ChatMessage
            role="user"
            content="Can you synthesize our new MediaPlayer specification and render a preview clip?"
            timestamp="10:24 AM"
          />

          {/* System status pill */}
          <ChatMessage
            role="system"
            content="Model upgraded to Oreo Reasoning 4.6 · Session active"
          />

          {/* Assistant message with thought chain, markdown, code, and live video */}
          <ChatMessage
            role="assistant"
            authorName="Oreo Design Agent"
            agentArt="nova"
            tag="Verified"
            timestamp="10:25 AM"
            thoughtChain={{
              thinking: false,
              durationSeconds: 3.4,
              thoughts: `1. Scanned OreoUI primitives for overlay control conventions.
2. Verified Video element requirements (HTML5 playsInline, autoplay with mute).
3. Synthesized TypeScript props interface and class-variance-authority styling.
4. Bound keyboard navigation and fullscreen toggles.`,
            }}
            content={sampleMarkdown}
          >
            {/* Generation Skeleton or Video Player */}
            <div className="mt-4 max-w-lg">
              {generating ? (
                <GenerationSkeleton
                  type="video"
                  aspectRatio="16:9"
                  statusText="Rendering sample video clip..."
                  progress={68}
                  elapsedSeconds={12}
                  onCancel={() => setGenerating(false)}
                />
              ) : (
                <MediaPlayer
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  aspectRatio="16:9"
                  autoPlay={false}
                />
              )}
            </div>
          </ChatMessage>
      </ChatContainer>
    </div>
  )
}

export const FullAgentConversation: StoryObj = {
  name: "Conversational thread with Markdown & Media",
  render: () => <FullAgentConversationDemo />,
}

export const GenerationSkeletons: StoryObj = {
  name: "Media generation skeletons",
  render: () => (
    <div className="grid grid-cols-1 gap-6 p-8 max-w-3xl sm:grid-cols-2">
      <div>
        <h4 className="mb-2 text-[13px] font-semibold text-[var(--oreo-text-primary)]">Square Image (1:1)</h4>
        <GenerationSkeleton
          type="image"
          aspectRatio="1:1"
          statusText="Synthesizing app icon 3D render..."
          progress={45}
          elapsedSeconds={8}
        />
      </div>

      <div>
        <h4 className="mb-2 text-[13px] font-semibold text-[var(--oreo-text-primary)]">Widescreen Video (16:9)</h4>
        <GenerationSkeleton
          type="video"
          aspectRatio="16:9"
          statusText="Interpolating 60fps frames..."
          progress={82}
          elapsedSeconds={19}
        />
      </div>
    </div>
  ),
}

export const StandaloneVideoPlayer: StoryObj = {
  name: "Standalone video player",
  render: () => (
    <div className="max-w-xl p-8">
      <MediaPlayer
        src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        aspectRatio="16:9"
        autoPlay={false}
      />
    </div>
  ),
}
