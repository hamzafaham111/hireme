import type { ReactNode } from 'react'
import { HomeHashScroll } from '@/components/home-hash'
import { SiteFooter, SiteHeader, MobileTabBar } from '@/components/layout'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <HomeHashScroll />
      <main className="pb-[calc(4rem+env(safe-area-inset-bottom,0px))] md:pb-0">{children}</main>
      <MobileTabBar />
      <SiteFooter />
    </>
  )
}
