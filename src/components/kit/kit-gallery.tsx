"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { AppearanceControls } from "@/components/theme/appearance-controls"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { CompareBarChart, ShareDonutChart, TrendAreaChart } from "@/components/ui/chart"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Checkbox, FormField, Input, Switch } from "@/components/ui/form-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TimePicker } from "@/components/ui/time-picker"
import { Display, Eyebrow, Headline, Mono, Text } from "@/components/ui/typography"
import { communityGrowth, trafficShare, visibilityTrend } from "@/lib/sample-metrics"
import type { DateRange, TimeValue } from "@/lib/datetime"

const sections = [
  { href: "#type", label: "Type" },
  { href: "#forms", label: "Forms" },
  { href: "#pickers", label: "Pickers" },
  { href: "#charts", label: "Charts" },
]

export function KitGallery() {
  const router = useRouter()
  const [range, setRange] = React.useState<DateRange>({ from: null, to: null })
  const [time, setTime] = React.useState<TimeValue>({ hour: 9, minute: 30 })
  const [plan, setPlan] = React.useState("weekly")
  const [notify, setNotify] = React.useState(true)
  const [digest, setDigest] = React.useState(false)
  const [share, setShare] = React.useState(true)

  return (
    <main className="min-h-dvh bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-40 border-b border-[var(--oreo-border-subtle)] bg-[var(--background)]/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="text-[13px] font-medium uppercase tracking-[0.16em] text-[var(--oreo-text-secondary)]">
            OreoUI
          </Link>
          <nav className="hidden items-center gap-4 sm:flex" aria-label="Kit sections">
            {sections.map((section) => (
              <a key={section.href} href={section.href} className="text-[13px] text-[var(--oreo-text-secondary)] hover:text-[var(--oreo-text-primary)]">
                {section.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => router.push("/login")}>
              Sign in
            </Button>
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 sm:hidden" aria-label="Kit sections">
          {sections.map((section) => (
            <a
              key={section.href}
              href={section.href}
              className="shrink-0 rounded-[var(--oreo-radius-full)] border border-[var(--oreo-border-default)] px-3 py-1.5 text-[12px] text-[var(--oreo-text-secondary)]"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-6 sm:py-14">
        <section className="oreo-rise">
          <Eyebrow>Components</Eyebrow>
          <Display size="lg" className="mt-4 max-w-3xl">
            One kit. Every surface.
          </Display>
          <Text size="lg" className="mt-4 max-w-xl">
            Charts, pickers, and form controls share color, radius, and type. Change a setting and the login page changes with them.
          </Text>
        </section>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Shadcn-style tokens. Neutral stays the Oreo default. Editorial, Vibe, and Harbor recolor the same components.</CardDescription>
          </CardHeader>
          <CardContent>
            <AppearanceControls />
          </CardContent>
        </Card>

        <section id="type" className="oreo-rise scroll-mt-28">
          <Headline>Typography</Headline>
          <Text className="mt-2">Display, interface, and mono can come from different families. The pairing applies to every component.</Text>
          <div className="mt-8 grid gap-8 border-y border-[var(--oreo-border-subtle)] py-8 lg:grid-cols-[1.4fr_0.8fr]">
            <div>
              <Eyebrow>Display</Eyebrow>
              <p className="mt-3 font-display text-[40px] leading-[0.95] tracking-[-0.045em] sm:text-[64px]">Rank the work that matters.</p>
              <Text className="mt-4">
                Body copy stays in the sans stack so forms, menus, and charts remain easy to scan. Headlines take the display face.
              </Text>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <Mono>--font-display</Mono>
              <Mono>--font-sans</Mono>
              <Mono>--font-mono</Mono>
              <p className="font-mono text-[13px] leading-relaxed text-[var(--oreo-text-primary)]">
                09:30 · Oct 5 · 4.8
              </p>
            </div>
          </div>
        </section>

        <section id="forms" className="oreo-rise scroll-mt-28">
          <Headline>Forms</Headline>
          <Text className="mt-2">Radio, switch, and checkbox sit on the same field rhythm as text inputs. Labels, descriptions, and errors stay attached.</Text>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle size="sm">Report settings</CardTitle>
                <CardDescription>Choose how a weekly check should behave.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-5">
                <FormField label="Site" description="The property you want to watch.">
                  <Input size="md" placeholder="rankmyseo.com" defaultValue="example.com" />
                </FormField>
                <RadioGroup label="Check cadence" value={plan} onValueChange={setPlan}>
                  <RadioGroupItem value="weekly" label="Weekly" description="One pass, kept for the record." />
                  <RadioGroupItem value="daily" label="Daily queue" description="A short list, not an hourly crawl." />
                </RadioGroup>
                <Switch checked={notify} onCheckedChange={setNotify} label="Notify me" description="Only when a tracked keyword moves." />
                <Checkbox checked={digest} onCheckedChange={setDigest} label="Monday digest" description="A single email instead of one per keyword." />
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardHeader>
                <CardTitle size="sm">States</CardTitle>
                <CardDescription>Disabled, indeterminate, and error stay readable in both themes.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField label="Workspace slug" error="That slug is already taken.">
                  <Input size="md" defaultValue="oreo" />
                </FormField>
                <Checkbox indeterminate label="Select visible rows" description="Some rows in the table are selected." />
                <Checkbox disabled label="Billing owner" description="Only the owner can change this." />
                <Switch disabled label="Paused" description="Unavailable on this plan." />
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="pickers" className="oreo-rise scroll-mt-28">
          <Headline>Date and time</Headline>
          <Text className="mt-2">The date range opens in a modal. On a phone it becomes a sheet. Time uses a popover, and the same sheet when the screen is narrow.</Text>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle size="sm">Publish window</CardTitle>
              <CardDescription>
                {range.from ? "Range saved in the field below." : "Nothing is applied until you confirm the range."} Sharing is {share ? "on" : "off"}.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <FormField label="Dates" description="Opens a modal with presets and a two-month calendar.">
                <DateRangePicker value={range} onValueChange={setRange} />
              </FormField>
              <FormField label="Send at" description="Steppers, typed values, and a few presets.">
                <TimePicker value={time} onValueChange={setTime} />
              </FormField>
              <div className="sm:col-span-2">
                <Checkbox checked={share} onCheckedChange={setShare} label="Share this window with the team" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="charts" className="oreo-rise scroll-mt-28">
          <Headline>Charts</Headline>
          <Text className="mt-2">Series colors come from --chart-1 through --chart-5, so a color set repaints the data with the rest of the UI.</Text>
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle size="sm">Keyword position</CardTitle>
                <CardDescription>Lower on the chart is a better rank. You moved from 18 to 4.</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendAreaChart
                  data={visibilityTrend}
                  xKey="week"
                  yReversed
                  series={[
                    { key: "you", label: "You" },
                    { key: "rival", label: "Rival" },
                  ]}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle size="sm">Community</CardTitle>
                <CardDescription>Projects shipped beside people who joined.</CardDescription>
              </CardHeader>
              <CardContent>
                <CompareBarChart
                  data={communityGrowth}
                  xKey="month"
                  series={[
                    { key: "projects", label: "Projects" },
                    { key: "members", label: "Members" },
                  ]}
                />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle size="sm">Where visits start</CardTitle>
                <CardDescription>A donut for share, with the legend beside it on a wide screen and below it on a phone.</CardDescription>
              </CardHeader>
              <CardContent>
                <ShareDonutChart data={trafficShare} />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  )
}
