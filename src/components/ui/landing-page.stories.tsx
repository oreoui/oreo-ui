import type { Meta, StoryObj } from '@storybook/react'
import Home from '@/app/page'

const meta: Meta<typeof Home> = {
  title: 'Pages/WelcomeLandingPage',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof Home>

export const Default: Story = {}
