import type { Metadata } from "next"

import { LoginScreen } from "@/components/auth/login-screen"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sample OreoUI sign-in using the shared form, type, and theme tokens.",
}

export default function LoginPage() {
  return <LoginScreen />
}
