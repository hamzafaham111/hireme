import { HeroSection } from '@/components/sections/HeroSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { WhatsAppInfoSection } from '@/components/sections/WhatsAppInfoSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { PartnersSection } from '@/components/sections/PartnersSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { WhyUsSection } from '@/components/sections/WhyUsSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { CtaBandSection } from '@/components/sections/CtaBandSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <WhatsAppInfoSection />
      <HowItWorksSection />
      <PartnersSection />
      <TestimonialsSection />
      <WhyUsSection />
      <FaqSection />
      <CtaBandSection />
    </>
  )
}
