import path from 'node:path'

import { config as loadEnv } from 'dotenv'
import { defineConfig } from 'prisma/config'

// When `prisma.config.ts` is present, Prisma skips automatic `.env` loading — restore it for DATABASE_URL.
loadEnv({ path: path.join(process.cwd(), '.env') })

/**
 * Prisma CLI config (replaces deprecated `package.json#prisma`).
 * See https://pris.ly/prisma-config
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
