"use client"

import type { Meta, StoryObj } from "@storybook/react"

import { Avatar, AvatarGroup, type AgentArt, type AvatarColor } from "./avatar"

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof Avatar>

const colors: AvatarColor[] = ["black", "white", "mint", "pink", "blue", "purple", "orange", "brown"]
const arts: AgentArt[] = ["nova", "void", "jade", "bloom", "silk", "flare"]

export const Types: Story = {
  name: "Type axis",
  render: () => (
    <div className="flex items-center gap-6 bg-white p-8">
      <Avatar type="empty" size={64} />
      <Avatar type="image" src="/assets/avatars/nicole.png" alt="Nicole" size={64} />
      <Avatar type="logo" size={64} />
      <Avatar type="initials" color="black" initials="OR" size={64} />
      <Avatar type="agent" agentArt="nova" size={64} />
    </div>
  ),
}

export const Colors: Story = {
  name: "Color axis",
  render: () => (
    <div className="flex flex-wrap items-center gap-4 bg-white p-8">
      {colors.map((color) => (
        <Avatar key={color} type="initials" color={color} initials="OR" size={56} alt={color} />
      ))}
    </div>
  ),
}

export const AgentArtwork: Story = {
  name: "Agent artwork",
  render: () => (
    <div className="flex flex-wrap items-center gap-4 bg-white p-8">
      {arts.map((art) => (
        <Avatar key={art} type="agent" agentArt={art} size={64} alt={art} />
      ))}
    </div>
  ),
}

export const SizesAndStates: Story = {
  name: "Sizes and loading",
  render: () => (
    <div className="flex flex-col gap-6 bg-white p-8">
      <div className="flex items-end gap-4">
        {[16, 24, 32, 48, 64].map((size) => (
          <Avatar key={size} type="logo" size={size} />
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Avatar loading size={48} />
        <Avatar type="agent" agentArt="void" loading size={48} />
      </div>
      <AvatarGroup max={3} size={40}>
        <Avatar type="image" src="/assets/avatars/nicole.png" alt="Nicole" size={40} />
        <Avatar type="agent" agentArt="bloom" size={40} alt="Bloom" />
        <Avatar type="initials" color="mint" initials="MO" size={40} alt="Mona" />
        <Avatar type="initials" color="purple" initials="YI" size={40} alt="Yiqi" />
        <Avatar type="initials" color="orange" initials="KA" size={40} alt="Kai" />
      </AvatarGroup>
    </div>
  ),
}