import { defineConfig } from 'prisma/config'

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
