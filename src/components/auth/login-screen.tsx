"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { TrendAreaChart } from "@/components/ui/chart"
import { Checkbox, FormField, Input, Switch } from "@/components/ui/form-input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Display, Eyebrow, Text } from "@/components/ui/typography"
import { visibilityTrend } from "@/lib/sample-metrics"
import { useMediaQuery } from "@/lib/use-media-query"

type Mode = "sign-in" | "create"

export function LoginScreen() {
  const router = useRouter()
  const showBrandChart = useMediaQuery("(min-width: 1024px)")
  const [mode, setMode] = React.useState<Mode>("sign-in")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [account, setAccount] = React.useState("personal")
  const [remember, setRemember] = React.useState(true)
  const [updates, setUpdates] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [status, setStatus] = React.useState<"idle" | "submitting" | "done">("idle")

  function validate() {
    const next: Record<string, string> = {}
    if (mode === "create" && name.trim().length < 2) next.name = "Add the name people should see."
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address."
    if (password.length < 8) next.password = "Use at least 8 characters."
    return next
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setStatus("submitting")
    window.setTimeout(() => setStatus("done"), 500)
  }

  return (
    <main className="grid min-h-dvh bg-[var(--background)] text-[var(--foreground)] lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <section className="relative hidden overflow-hidden bg-[var(--oreo-bg-inverse)] px-10 py-8 text-[var(--oreo-text-on-inverse)] lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-[13px] font-medium uppercase tracking-[0.16em]">
            OreoUI
          </Link>
          <span className="text-[13px] opacity-80">Starter kit</span>
        </div>
        <div className="oreo-rise max-w-xl">
          <div>
            <Display size="md" className="text-[var(--oreo-text-on-inverse)]">
              See the week clearly.
            </Display>
            <Text size="lg" className="mt-4 max-w-md text-[var(--oreo-text-on-inverse)] opacity-80">
              A calm place for rank, community, and the work in between. The same components follow you from a phone to a wide screen.
            </Text>
          </div>
          <div className="mt-10 rounded-[var(--oreo-radius-xl)] border border-[var(--oreo-border-inverse)] bg-black/10 p-4">
            <p className="mb-2 text-[12px] uppercase tracking-[0.14em] opacity-70">Visibility · lower is better</p>
            {showBrandChart ? (
              <TrendAreaChart
                data={visibilityTrend}
                xKey="week"
                yReversed
                tone="inverse"
                height={180}
                series={[
                  { key: "you", label: "You", color: "var(--oreo-text-on-inverse)" },
                  { key: "rival", label: "Rival", color: "color-mix(in srgb, var(--oreo-text-on-inverse) 55%, transparent)" },
                ]}
              />
            ) : (
              <div className="h-[180px]" />
            )}
          </div>
        </div>
        <p className="max-w-md text-[14px] leading-relaxed opacity-80">
          “The useful part is not another dashboard. It is knowing which page moved, and why you would open it again.”
        </p>
      </section>

      <section className="flex min-h-dvh flex-col px-4 py-5 sm:px-8 sm:py-8">
        <header className="flex items-center justify-between">
          <Link href="/" className="text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--oreo-text-secondary)] lg:invisible">
            OreoUI
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/kit" className="rounded-[var(--oreo-radius-sm)] px-2 py-2 text-[13px] text-[var(--oreo-text-secondary)] hover:text-[var(--oreo-text-primary)]">
              Components
            </Link>
            <ThemeToggle />
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          {status === "done" ? (
              <div className="oreo-rise">
                <Eyebrow>You are in</Eyebrow>
                <h1 className="mt-3 font-display text-[36px] font-medium leading-none tracking-[-0.04em] sm:text-[44px]">
                  Welcome{name.trim() ? `, ${name.trim()}` : " back"}.
                </h1>
                <Text className="mt-4">
                  This is a sample sign-in. Nothing was sent anywhere. The form, the chart, and the theme all share the same tokens.
                </Text>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                  <Button variant="primary" className="h-11 px-4" onClick={() => router.push("/kit")}>
                    Open the kit
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-11 px-4"
                    onClick={() => {
                      setStatus("idle")
                      setPassword("")
                    }}
                  >
                    Use another account
                  </Button>
                </div>
              </div>
            ) : (
              <form key={mode} onSubmit={onSubmit} noValidate className="oreo-rise flex flex-col gap-5">
                <div>
                  <Eyebrow>{mode === "sign-in" ? "Welcome back" : "Create a workspace"}</Eyebrow>
                  <h1 className="mt-3 font-display text-[36px] font-medium leading-none tracking-[-0.04em] sm:text-[44px]">
                    {mode === "sign-in" ? "Sign in" : "Start free"}
                  </h1>
                  <Text className="mt-3">
                    {mode === "sign-in"
                      ? "Use your email to open the sample workspace."
                      : "A name, an email, and a password are enough to preview the form."}
                  </Text>
                </div>

                <div className="grid grid-cols-2 rounded-[var(--oreo-radius-md)] bg-[var(--oreo-bg-elevated)] p-1">
                  {(
                    [
                      ["sign-in", "Sign in"],
                      ["create", "Create account"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      aria-pressed={mode === id}
                      onClick={() => {
                        setMode(id)
                        setErrors({})
                      }}
                      className={`h-10 rounded-[var(--oreo-radius-sm)] text-[14px] font-medium oreo-clickable focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--oreo-border-focus)] ${
                        mode === id ? "bg-[var(--oreo-bg-surface)] text-[var(--oreo-text-primary)] shadow-[var(--oreo-shadow-default)]" : "text-[var(--oreo-text-secondary)]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {mode === "create" ? (
                  <FormField label="Name" required error={errors.name}>
                    <Input size="md" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Aria Chen" />
                  </FormField>
                ) : null}

                <FormField label="Email" required error={errors.email}>
                  <Input
                    size="md"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@studio.com"
                  />
                </FormField>

                <FormField label="Password" required error={errors.password} description="At least 8 characters.">
                  <Input
                    size="md"
                    isPassword
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                  />
                </FormField>

                <RadioGroup label="Workspace" value={account} onValueChange={setAccount} orientation="horizontal">
                  <RadioGroupItem value="personal" label="Personal" description="Just you" />
                  <RadioGroupItem value="team" label="Team" description="Shared with others" />
                </RadioGroup>

                <div className="flex flex-col gap-3">
                  <Checkbox checked={remember} onCheckedChange={setRemember} label="Remember this device" description="Stay signed in on this browser." />
                  <Switch checked={updates} onCheckedChange={setUpdates} label="Product notes" description="Occasional email when the kit changes." />
                </div>

                <Button variant="primary" type="submit" loading={status === "submitting"} className="h-11 w-full">
                  {mode === "sign-in" ? "Sign in" : "Create account"}
                </Button>
              </form>
            )}
        </div>
      </section>
    </main>
  )
}
