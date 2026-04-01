import type { FC } from 'react'
import type { ServiceIconProps } from '@/components/icons/site-icons'
import {
  IconBankPaper,
  IconBriefcase,
  IconBulky,
  IconCar,
  IconExpress,
  IconGift,
  IconGrocery,
  IconHomeKey,
  IconMessageSpark,
  IconPaw,
  IconPharmacy,
  IconQueue,
  IconShoppingBag,
} from '@/components/icons/site-icons'

export type ServiceDefinition = {
  title: string
  tagline: string
  Icon: FC<ServiceIconProps>
}

/** Taglines kept short so two cards fit comfortably in the mobile carousel. */
export const SERVICES: ServiceDefinition[] = [
  {
    title: 'Express delivery',
    tagline: 'Same-day parcels and documents, door to door.',
    Icon: IconExpress,
  },
  {
    title: 'Personal shopping',
    tagline: 'We shop the stores you pick; we deliver.',
    Icon: IconShoppingBag,
  },
  {
    title: 'Groceries & takeout',
    tagline: 'Markets, cafés, and meal pickup runs.',
    Icon: IconGrocery,
  },
  {
    title: 'Pharmacy runs',
    tagline: 'Prescriptions and essentials, discreet.',
    Icon: IconPharmacy,
  },
  {
    title: 'Banking & paperwork',
    tagline: 'Cheques, deposits, and document handovers.',
    Icon: IconBankPaper,
  },
  {
    title: 'Gifts & luxe shopping',
    tagline: 'Flowers, gifts, and boutique buys.',
    Icon: IconGift,
  },
  {
    title: 'Furniture & bulky pickup',
    tagline: 'Big-box and heavy items to your home.',
    Icon: IconBulky,
  },
  {
    title: 'Car & motor errands',
    tagline: 'Testing, renewals, and agency visits.',
    Icon: IconCar,
  },
  {
    title: 'Queue & wait service',
    tagline: 'We wait at banks, counters, and busy lines.',
    Icon: IconQueue,
  },
  {
    title: 'Pet taxi & vet trips',
    tagline: 'Safe rides and help for vet visits.',
    Icon: IconPaw,
  },
  {
    title: 'Home & key handovers',
    tagline: 'Check-ins, keys, and errands at your place.',
    Icon: IconHomeKey,
  },
  {
    title: 'Office & business',
    tagline: 'Team errands and supplies—one WhatsApp thread.',
    Icon: IconBriefcase,
  },
  {
    title: 'Anything legal',
    tagline: 'Describe it; we quote clearly and run it.',
    Icon: IconMessageSpark,
  },
]
