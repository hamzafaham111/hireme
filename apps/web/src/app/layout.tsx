import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AppSplashScreen } from '@/components/AppSplashScreen'
import { HomeHashScroll } from '@/components/HomeHashScroll'
import { MobileTabBar } from '@/components/MobileTabBar'
import { SiteHeader } from '@/components/SiteHeader'
import { SiteFooter } from '@/components/SiteFooter'
import { siteName, siteTagline } from '@/lib/site'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const display = Plus_Jakarta_Sans({
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
        className={`${inter.variable} ${display.variable} min-h-screen pb-[calc(4rem+env(safe-area-inset-bottom,0px))] font-sans md:pb-0`}
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
