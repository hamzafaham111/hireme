import path from 'path'
import { fileURLToPath } from 'url'
import type { NextConfig } from 'next'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
/** Repo root (parent of `apps/`). Hoisted `node_modules` + `next` live here with npm workspaces. */
const monorepoRoot = path.join(__dirname, '../..')

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@hire-me/site-icons'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  /** Single install at monorepo root — tracing must include hoisted deps. */
  outputFileTracingRoot: monorepoRoot,
  /**
   * Fixes Turbopack `Next.js package not found` when `next` is hoisted above `apps/web`.
   * @see https://github.com/vercel/next.js/issues/74731
   */
  turbopack: {
    root: monorepoRoot,
  },
}

export default nextConfig
