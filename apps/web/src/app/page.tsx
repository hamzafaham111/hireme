import { HeroSection } from '@/components/sections/HeroSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { WhatsAppInfoSection } from '@/components/sections/WhatsAppInfoSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
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
      <StatsSection />
      <WhatsAppInfoSection />
      <ServicesSection />
      <HowItWorksSection />
      <PartnersSection />
      <TestimonialsSection />
      <WhyUsSection />
      <FaqSection />
      <CtaBandSection />
    </>
  )
}
