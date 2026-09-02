import type { NextConfig } from "next";

/** Standalone output is for Docker only — Vercel breaks on missing NFT trace files. */
const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
