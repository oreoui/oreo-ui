/**
 * Appearance contract shared by the pre-paint script and the client provider.
 * Color, radius, and font are data attributes. The token values live in globals.css
 * in the same shape as a shadcn theme: --background, --primary, --radius, --chart-*.
 */

export const APPEARANCE_STORAGE_KEY = "oreo-appearance"

export const COLOR_IDS = ["neutral", "editorial", "vibe", "harbor"] as const
export const RADIUS_IDS = ["default", "sharp", "rounded", "soft"] as const
export const FONT_IDS = ["inter", "editorial", "studio", "vibe"] as const

export type ColorId = (typeof COLOR_IDS)[number]
export type RadiusId = (typeof RADIUS_IDS)[number]
export type FontId = (typeof FONT_IDS)[number]

export type Appearance = {
  color: ColorId
  radius: RadiusId
  font: FontId
}

export const DEFAULT_APPEARANCE: Appearance = {
  color: "neutral",
  radius: "default",
  font: "inter",
}

export const COLOR_OPTIONS: { id: ColorId; label: string; description: string; swatch: string }[] = [
  { id: "neutral", label: "Neutral", description: "Oreo ink and paper", swatch: "#202020" },
  { id: "editorial", label: "Editorial", description: "Warm paper, forest ink", swatch: "#1e4d3a" },
  { id: "vibe", label: "Vibe", description: "Violet and lime", swatch: "#3d2ad4" },
  { id: "harbor", label: "Harbor", description: "Zinc surface, blue primary", swatch: "#1d4ed8" },
]

export const RADIUS_OPTIONS: { id: RadiusId; label: string; description: string }[] = [
  { id: "default", label: "Default", description: "8 / 16" },
  { id: "sharp", label: "Sharp", description: "Tight corners" },
  { id: "rounded", label: "Rounded", description: "Shadcn scale" },
  { id: "soft", label: "Soft", description: "Large radius" },
]

export const FONT_OPTIONS: { id: FontId; label: string; description: string }[] = [
  { id: "inter", label: "Inter", description: "Sans for UI and display" },
  { id: "editorial", label: "Editorial", description: "Fraunces + Source Sans" },
  { id: "studio", label: "Studio", description: "Instrument Serif + Jakarta" },
  { id: "vibe", label: "Vibe", description: "Space Grotesk + Outfit" },
]

function isOneOf<T extends string>(value: unknown, options: readonly T[]): value is T {
  return typeof value === "string" && options.includes(value as T)
}

export function parseAppearance(value: unknown): Appearance {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {}
  return {
    color: isOneOf(record.color, COLOR_IDS) ? record.color : DEFAULT_APPEARANCE.color,
    radius: isOneOf(record.radius, RADIUS_IDS) ? record.radius : DEFAULT_APPEARANCE.radius,
    font: isOneOf(record.font, FONT_IDS) ? record.font : DEFAULT_APPEARANCE.font,
  }
}

export function readAppearance(storage: Pick<Storage, "getItem"> | null): Appearance {
  if (!storage) return DEFAULT_APPEARANCE
  try {
    const raw = storage.getItem(APPEARANCE_STORAGE_KEY)
    if (!raw) return DEFAULT_APPEARANCE
    return parseAppearance(JSON.parse(raw) as unknown)
  } catch {
    return DEFAULT_APPEARANCE
  }
}

/** Applies appearance as data attributes. Default radius removes the attribute so :root wins. */
export function applyAppearance(root: HTMLElement, appearance: Appearance): void {
  root.setAttribute("data-color", appearance.color)
  root.setAttribute("data-font", appearance.font)
  if (appearance.radius === "default") root.removeAttribute("data-radius")
  else root.setAttribute("data-radius", appearance.radius)
}

export function persistAppearance(storage: Pick<Storage, "setItem"> | null, appearance: Appearance): void {
  if (!storage) return
  try {
    storage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(appearance))
  } catch {
    // Ignore quota and private-mode failures.
  }
}

/**
 * Runs before paint. Kept as a string so the layout can inline it next to the theme script.
 * The allow-lists must stay aligned with COLOR_IDS, RADIUS_IDS, and FONT_IDS.
 */
export const appearanceBootstrap = `(function(){try{var raw=localStorage.getItem("${APPEARANCE_STORAGE_KEY}");if(!raw)return;var a=JSON.parse(raw);var colors={neutral:1,editorial:1,vibe:1,harbor:1};var radii={sharp:1,rounded:1,soft:1};var fonts={inter:1,editorial:1,studio:1,vibe:1};var root=document.documentElement;if(colors[a.color])root.setAttribute("data-color",a.color);if(fonts[a.font])root.setAttribute("data-font",a.font);if(radii[a.radius])root.setAttribute("data-radius",a.radius);}catch(e){}})()`
