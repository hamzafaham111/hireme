import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Manrope, Sora } from 'next/font/google'
import './globals.css'
import { WebProviders } from '@/components/providers/WebProviders'
import { AppSplashScreen } from '@/components/splash'
import { siteName, siteTagline } from '@/lib/site'

/** Body / UI — geometric, readable at small sizes */
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

/** Headings — slightly tech-forward display */
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: `${siteName} — On-demand errands and delivery`,
    template: `%s · ${siteName}`,
  },
  description: siteTagline,
  openGraph: {
    title: siteName,
    description: siteTagline,
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${manrope.variable} ${sora.variable} min-h-screen font-sans`}
      >
        <WebProviders>
          <AppSplashScreen />
          {children}
        </WebProviders>
      </body>
    </html>
  )
}
