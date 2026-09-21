"use client"

import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import * as React from "react"

import { IconButton } from "@/components/ui/icon-button"
import { cn } from "@/lib/cn"

export interface MediaPlayerProps {
  src: string
  poster?: string
  aspectRatio?: "16:9" | "1:1" | "9:16" | "4:3"
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  /** Accessible name for the video, e.g. "Generated product tour". */
  label?: string
  /** WebVTT caption tracks. Pass these whenever the media has speech. */
  captions?: Array<{ src: string; srcLang: string; label: string; default?: boolean }>
  className?: string
}

const ratioClasses = {
  "16:9": "aspect-video",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16]",
  "4:3": "aspect-[4/3]",
}

export function MediaPlayer({
  src,
  poster,
  aspectRatio = "16:9",
  autoPlay = false,
  loop = true,
  muted = true,
  label = "Video",
  captions,
  className,
}: MediaPlayerProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = React.useState(autoPlay)
  const [isMuted, setIsMuted] = React.useState(muted)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const reduceMotion = useReducedMotion()

  const togglePlay = React.useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => undefined)
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }, [])

  const toggleMute = React.useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  const toggleFullscreen = React.useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined)
    } else {
      video.requestFullscreen().catch(() => undefined)
    }
  }, [])

  function handleTimeUpdate() {
    const video = videoRef.current
    if (!video || !video.duration) return
    setProgress((video.currentTime / video.duration) * 100)
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative w-full overflow-hidden rounded-[12px] border border-[var(--oreo-border-subtle)] bg-black shadow-[var(--oreo-shadow-default)]",
        ratioClasses[aspectRatio],
        className
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        aria-label={label}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        className="oreo-clickable size-full object-cover"
      >
        {captions?.map((track) => (
          <track
            key={track.src}
            kind="captions"
            src={track.src}
            srcLang={track.srcLang}
            label={track.label}
            default={track.default}
          />
        ))}
      </video>

      {/* Floating Center Play Button (visible when paused) */}
      {!isPlaying && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center bg-black/20">
          <motion.button
            type="button"
            aria-label="Play video"
            whileHover={reduceMotion ? undefined : { scale: 1.08 }}
            whileTap={reduceMotion ? undefined : { scale: 0.95 }}
            onClick={togglePlay}
            className="oreo-clickable pointer-events-auto grid size-12 place-items-center rounded-full bg-white/90 text-black shadow-[var(--oreo-shadow-floating)] transition-colors hover:bg-white"
          >
            <Play size={20} className="ml-0.5 fill-current" />
          </motion.button>
        </div>
      )}

      {/* Bottom Control Bar. Stays visible while playing only if hovered or focused, so
          keyboard users never chase an invisible control. */}
      <motion.div
        animate={{ opacity: isHovered || isFocused || !isPlaying ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 text-white"
      >
        {/* Progress Track */}
        <div
          role="progressbar"
          aria-label="Playback progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          className="relative h-1 w-full overflow-hidden rounded-full bg-white/30"
        >
          <div className="h-full bg-white transition-[width] duration-100" style={{ width: `${progress}%` }} />
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <IconButton
              variant="ghost"
              aria-label={isPlaying ? "Pause video" : "Play video"}
              icon={isPlaying ? <Pause size={16} /> : <Play size={16} />}
              onClick={togglePlay}
              className="text-white hover:bg-white/20 active:bg-white/30"
            />
            <IconButton
              variant="ghost"
              aria-label={isMuted ? "Unmute video" : "Mute video"}
              icon={isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              onClick={toggleMute}
              className="text-white hover:bg-white/20 active:bg-white/30"
            />
          </div>

          <IconButton
            variant="ghost"
            aria-label="Toggle fullscreen"
            icon={<Maximize2 size={16} />}
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20 active:bg-white/30"
          />
        </div>
      </motion.div>
    </div>
  )
}
