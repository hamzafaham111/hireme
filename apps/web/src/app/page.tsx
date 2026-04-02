import { CtaBandSection } from '@/components/sections/cta-band'
import { FaqSection } from '@/components/sections/faq'
import { HeroSection } from '@/components/sections/hero'
import { HowItWorksSection } from '@/components/sections/how-it-works'
import { PartnersSection } from '@/components/sections/partners'
import { ServicesSection } from '@/components/sections/services'
import { StatsSection } from '@/components/sections/stats'
import { TestimonialsSection } from '@/components/sections/testimonials'
import { WhatsAppInfoSection } from '@/components/sections/whatsapp-info'
import { WhyUsSection } from '@/components/sections/why-us'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorksSection />
      <StatsSection />
      <WhatsAppInfoSection />
      <PartnersSection />
      <TestimonialsSection />
      <WhyUsSection />
      <FaqSection />
      <CtaBandSection />
    </>
  )
}
