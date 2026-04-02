/**
 * Highlights from our main Services catalogue — framed as what’s most booked
 * in the customer’s area. Swap images to match your real demand data later.
 */
export type PopularNearYouItem = {
  id: string
  /** Aligns with a card on the main Services list. */
  title: string
  imageSrc: string
  imageAlt: string
}

export const POPULAR_NEAR_YOU_ITEMS: PopularNearYouItem[] = [
  {
    id: 'express-delivery',
    title: 'Express delivery',
    imageSrc:
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Courier handling cardboard shipping boxes',
  },
  {
    id: 'groceries-takeout',
    title: 'Groceries & takeout',
    imageSrc:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Fresh produce at a market stall',
  },
  {
    id: 'personal-shopping',
    title: 'Personal shopping',
    imageSrc:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Clothing display inside a retail shop',
  },
  {
    id: 'pharmacy-runs',
    title: 'Pharmacy runs',
    imageSrc:
      'https://images.unsplash.com/photo-1587854692152-cbc660ba4010?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Pharmacy shelves with medicine bottles',
  },
  {
    id: 'cleaning',
    title: 'Cleaning',
    imageSrc:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Person cleaning a bright living space',
  },
  {
    id: 'home-key-handovers',
    title: 'Home & key handovers',
    imageSrc:
      'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Front door of a home with house keys',
  },
  {
    id: 'real-estate-agents',
    title: 'Real estate agents',
    imageSrc:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Small house model and keys on a desk',
  },
  {
    id: 'office-business',
    title: 'Office & business',
    imageSrc:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    imageAlt: 'Open-plan office with desks and natural light',
  },
]
