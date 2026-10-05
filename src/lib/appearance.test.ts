import { describe, expect, it } from "vitest"

import { applyAppearance, parseAppearance, readAppearance } from "./appearance"

describe("parseAppearance", () => {
  it("falls back when storage is empty or corrupt", () => {
    expect(parseAppearance(null)).toEqual({ color: "neutral", radius: "default", font: "inter" })
    expect(parseAppearance({ color: "nope", radius: "soft", font: "studio" })).toEqual({
      color: "neutral",
      radius: "soft",
      font: "studio",
    })
  })

  it("reads JSON from storage", () => {
    const storage = {
      getItem: () => JSON.stringify({ color: "vibe", radius: "sharp", font: "vibe" }),
    }
    expect(readAppearance(storage)).toEqual({ color: "vibe", radius: "sharp", font: "vibe" })
  })
})

describe("applyAppearance", () => {
  it("writes data attributes and clears the default radius", () => {
    const root = { attributes: new Map<string, string>(), setAttribute(name: string, value: string) { this.attributes.set(name, value) }, removeAttribute(name: string) { this.attributes.delete(name) } }
    applyAppearance(root as unknown as HTMLElement, { color: "harbor", radius: "default", font: "editorial" })
    expect(root.attributes.get("data-color")).toBe("harbor")
    expect(root.attributes.get("data-font")).toBe("editorial")
    expect(root.attributes.has("data-radius")).toBe(false)

    applyAppearance(root as unknown as HTMLElement, { color: "harbor", radius: "soft", font: "editorial" })
    expect(root.attributes.get("data-radius")).toBe("soft")
  })
})