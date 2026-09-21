"use client"

import type { Meta, StoryObj } from "@storybook/react"

import { ImageGrid, ImageStrip, ImageTile } from "./image-grid"

const meta: Meta<typeof ImageGrid> = {
  title: "Primitives/ImageGrid",
  component: ImageGrid,
}

export default meta
type Story = StoryObj<typeof ImageGrid>

const covers = [
  { src: "/assets/covers/img.jpg", alt: "Square cover", aspectRatio: "1:1" as const },
  { src: "/assets/covers/img-2.jpg", alt: "Portrait cover", aspectRatio: "3:4" as const },
  { src: "/assets/covers/img-3.jpg", alt: "Landscape cover", aspectRatio: "4:3" as const },
  { src: "/assets/covers/img-4.jpg", alt: "Tall cover", aspectRatio: "9:16" as const },
  { src: "/assets/covers/img-5.jpg", alt: "Widescreen cover", aspectRatio: "16:9" as const },
]

export const AspectRatios: Story = {
  name: "Aspect ratio axis",
  render: () => (
    <div className="flex flex-wrap items-start gap-3 bg-white p-6">
      {covers.map(({ src, alt, aspectRatio }) => (
        <div key={aspectRatio} className="w-[180px]">
          <ImageTile src={src} alt={alt} aspectRatio={aspectRatio} />
          <p className="mt-2 font-mono text-[12px] text-[#646464]">{aspectRatio}</p>
        </div>
      ))}
    </div>
  ),
}

export const HoverAction: Story = {
  name: "Status axis (expand on hover)",
  render: () => (
    <div className="w-[320px] bg-white p-6">
      <ImageTile src={covers[0].src} alt="Square cover" aspectRatio="1:1" onExpand={() => undefined} />
      <p className="mt-2 text-[12px] text-[#646464]">Hover or focus the tile to reveal the expand cap.</p>
    </div>
  ),
}

export const CoverBento: Story = {
  name: "Cover set (constant height)",
  render: () => (
    <div className="max-w-4xl bg-white p-6">
      <ImageStrip images={covers} height={200} />
      <div className="mt-6">
        <ImageGrid columns={3} images={covers} />
      </div>
    </div>
  ),
}