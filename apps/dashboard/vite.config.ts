import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // CJS `dist/index.js` from @hire-me/types loses named exports for Rollup; bundle TS source instead.
    alias: {
      '@hire-me/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
    },
  },
})
