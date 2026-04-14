import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // After splitting React / router / MD editor, one large `vendor` chunk can remain (misc deps).
    chunkSizeWarningLimit: 1100,
    rollupOptions: {
      output: {
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
