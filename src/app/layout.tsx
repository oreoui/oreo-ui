import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  IBM_Plex_Mono,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Outfit,
  Plus_Jakarta_Sans,
  Source_Sans_3,
  Space_Grotesk,
} from "next/font/google";
import { AppearanceProvider } from "@/components/theme/appearance-provider";
import { appearanceBootstrap } from "@/lib/appearance";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const sourceSans = Source_Sans_3({ variable: "--font-source-sans", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", display: "swap" });
const space = Space_Grotesk({ variable: "--font-space", subsets: ["latin"], display: "swap" });
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });
const plex = IBM_Plex_Mono({ variable: "--font-plex-mono", subsets: ["latin"], weight: ["400", "500"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

const fontVariables = [
  inter.variable,
  sourceSans.variable,
  fraunces.variable,
  jakarta.variable,
  instrument.variable,
  space.variable,
  outfit.variable,
  plex.variable,
  jetbrains.variable,
].join(" ");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://oreoui.dev";
const DESCRIPTION =
  "OreoUI Starter Kits: agentic UI components for AI interfaces. Figma-parity primitives, reasoning and streaming surfaces, full state coverage and dark mode.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OreoUI Starter Kits",
    template: "%s · OreoUI",
  },
  description: DESCRIPTION,
  applicationName: "OreoUI Starter Kits",
  authors: [{ name: "OreoUI", url: "https://github.com/oreoui" }],
  openGraph: {
    type: "website",
    siteName: "OreoUI Starter Kits",
    title: "OreoUI Starter Kits",
    description: DESCRIPTION,
    url: SITE_URL,
    images: [{ url: "/brand/oreoui-social.png", width: 1200, height: 1200, alt: "OreoUI" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

/**
 * Resolves the theme before first paint so dark mode never flashes. Stored choice wins,
 * otherwise the OS preference decides. Kept tiny and inline; nothing here depends on React.
 */
const themeBootstrap = `(function(){try{var s=localStorage.getItem("oreo-theme");var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var t=s||(d?"dark":"light");document.documentElement.dataset.theme=t;document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${fontVariables} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: appearanceBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col">
        <AppearanceProvider>{children}</AppearanceProvider>
      </body>
    </html>
  );
}