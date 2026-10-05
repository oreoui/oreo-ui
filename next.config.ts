import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The cloud browser opens the dev server on 127.0.0.1. Without this, Next blocks
  // dev assets and the page never hydrates.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
