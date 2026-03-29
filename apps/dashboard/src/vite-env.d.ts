/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  /** Public Next.js site origin (no path), e.g. http://localhost:3000 */
  readonly VITE_PUBLIC_WEB_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
