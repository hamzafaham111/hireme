import type { ReactNode } from 'react'
import { HomeHashScroll } from '@/components/home-hash'
import { SiteFooter, SiteHeader, MobileTabBar } from '@/components/layout'

/** Shared content width for customer/worker surfaces. */
export default function MarketplaceGroupLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <HomeHashScroll />
      <main className="pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
      <MobileTabBar />
      <SiteFooter />
    </>
  )
}
