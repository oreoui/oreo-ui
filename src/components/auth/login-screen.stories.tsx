"use client"

import type { Meta, StoryObj } from "@storybook/react"

import { LoginScreen } from "./login-screen"

const meta: Meta = {
  title: "Pages/Login",
  parameters: { layout: "fullscreen" },
}

export default meta

export const Sample: StoryObj = {
  render: () => <LoginScreen />,
}
