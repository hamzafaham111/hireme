import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Manrope, Sora } from 'next/font/google'
import './globals.css'
import { HomeHashScroll } from '@/components/home-hash'
import { SiteFooter, SiteHeader, MobileTabBar } from '@/components/layout'
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
        className={`${manrope.variable} ${sora.variable} min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom,0px))] font-sans md:pb-0`}
      >
        <AppSplashScreen />
        <SiteHeader />
        <HomeHashScroll />
        <main>{children}</main>
        <MobileTabBar />
        <SiteFooter />
      </body>
    </html>
  )
}
