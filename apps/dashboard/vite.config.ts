import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Keeps chunks under Vite's default 500 kB warning (heavy deps: MD editor, React).
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@uiw/react-md-editor') || id.includes('@codemirror')) {
            return 'md-editor'
          }
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) {
            return 'react-vendor'
          }
          if (id.includes('react-router')) {
            return 'router'
          }
          return 'vendor'
        },
      },
    },
  },
  resolve: {
    // CJS `dist/index.js` from @hire-me/types loses named exports for Rollup; bundle TS source instead.
    alias: {
      '@hire-me/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
    },
  },
})
