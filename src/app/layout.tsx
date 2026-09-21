import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
      className={`${inter.variable} h-full font-sans antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}