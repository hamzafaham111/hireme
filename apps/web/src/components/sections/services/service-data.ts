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

export const SERVICES: ServiceDefinition[] = [
  {
    title: 'Express delivery',
    tagline: 'Parcels and documents—picked up and dropped off the same day.',
    Icon: IconExpress,
  },
  {
    title: 'Personal shopping',
    tagline: 'We buy from stores you choose and deliver to your door.',
    Icon: IconShoppingBag,
  },
  {
    title: 'Groceries & takeout',
    tagline: 'Supermarkets, cafés, and ready-to-eat pickup runs.',
    Icon: IconGrocery,
  },
  {
    title: 'Pharmacy runs',
    tagline: 'Prescriptions and health essentials, handled discreetly.',
    Icon: IconPharmacy,
  },
  {
    title: 'Banking & paperwork',
    tagline: 'Cheques, deposits, signatures, and document handovers.',
    Icon: IconBankPaper,
  },
  {
    title: 'Gifts & luxe shopping',
    tagline: 'Flowers, surprises, and boutique purchases with care.',
    Icon: IconGift,
  },
  {
    title: 'Furniture & bulky pickup',
    tagline: 'Large-store, IKEA-style, and heavy items to your home.',
    Icon: IconBulky,
  },
  {
    title: 'Car & motor errands',
    tagline: 'Testing centres, renewals, and agency visits.',
    Icon: IconCar,
  },
  {
    title: 'Queue & wait service',
    tagline: 'We wait in line at banks, counters, and busy venues.',
    Icon: IconQueue,
  },
  {
    title: 'Pet taxi & vet trips',
    tagline: 'Safe rides to the vet and trusted on-the-ground help.',
    Icon: IconPaw,
  },
  {
    title: 'Home & key handovers',
    tagline: 'Check-ins, access handovers, and errands at your place.',
    Icon: IconHomeKey,
  },
  {
    title: 'Office & business',
    tagline: 'Last-mile jobs, supplies, and admin for teams—one thread.',
    Icon: IconBriefcase,
  },
  {
    title: 'Anything legal',
    tagline: 'Describe it on WhatsApp; we quote clearly and get it done.',
    Icon: IconMessageSpark,
  },
]
