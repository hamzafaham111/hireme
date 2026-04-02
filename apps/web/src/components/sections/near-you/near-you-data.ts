/**
 * Highlights from our main Services catalogue — framed as what’s most booked
 * in the customer’s area. `tagline` shows from `md` up; mobile cards are title-only.
 */
export type PopularNearYouItem = {
  id: string
  /** Aligns with a card on the main Services list. */
  title: string
  /** Shown under the title from md breakpoint upward only. */
  tagline: string
  imageSrc: string
  imageAlt: string
}

export const POPULAR_NEAR_YOU_ITEMS: PopularNearYouItem[] = [
  {
    id: 'express-delivery',
    title: 'Express delivery',
    tagline: 'Same-day parcels and documents—one of the top requests where you are.',
    imageSrc:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Courier handling cardboard shipping boxes',
  },
  {
    id: 'groceries-takeout',
    title: 'Groceries & takeout',
    tagline: 'Market and café runs neighbours book again and again locally.',
    imageSrc:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Fresh produce at a market stall',
  },
  {
    id: 'personal-shopping',
    title: 'Personal shopping',
    tagline: 'Store pickups and personal buys we route through your postcode.',
    imageSrc:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Clothing display inside a retail shop',
  },
  {
    id: 'pharmacy-runs',
    title: 'Pharmacy runs',
    tagline: 'Prescription and essentials errands in high demand in your region.',
    imageSrc:
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Assorted medicine capsules and pills in a pharmacy tray',
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    tagline: 'Home tidy-ups and deep cleans that keep filling slots nearby.',
    imageSrc:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Person cleaning a bright living space',
  },
  {
    id: 'home-key-handovers',
    title: 'Home & key handovers',
    tagline: 'Check-ins and key swaps our runners handle daily around you.',
    imageSrc:
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Front door of a home with house keys',
  },
  {
    id: 'real-estate-agents',
    title: 'Real estate agents',
    tagline: 'Showings and lockbox help that agencies nearby lean on us for.',
    imageSrc:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Small house model and keys on a desk',
  },
  {
    id: 'office-business',
    title: 'Office & business',
    tagline: 'Team errands and supply runs popular with offices in your catchment.',
    imageSrc:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Open-plan office with desks and natural light',
  },
]
