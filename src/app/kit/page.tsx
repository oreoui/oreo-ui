import type { Metadata } from "next"

import { KitGallery } from "@/components/kit/kit-gallery"

export const metadata: Metadata = {
  title: "Components",
  description: "Charts, date range, time picker, form controls, type, and theme tokens.",
}

export default function KitPage() {
  return <KitGallery />
}