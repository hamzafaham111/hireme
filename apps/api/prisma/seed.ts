/**
 * Local dev seed — mirrors dashboard `operationsSeed` with hashed passwords.
 * Run: `npm run db:seed --workspace=@hire-me/api` (from repo root).
 */
import { PrismaClient, type BlogPostStatus, type JobStatus, type UserStatus, type WorkerStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const DEMO_PASSWORD = 'demo123'

const WORKERS: Array<{
  workerId: string
  name: string
  phone: string
  location: string
  service: string
  status: WorkerStatus
  internalRating: number
  customerRating: number
}> = [
  {
    workerId: 'HM-W-1042',
    name: 'Omar Al-Farsi',
    phone: '+971 50 111 2233',
    location: 'Dubai Marina',
    service: 'Driver',
    status: 'active',
    internalRating: 4.8,
    customerRating: 4.9,
  },
  {
    workerId: 'HM-W-0881',
    name: 'Priya Nair',
    phone: '+971 55 444 5566',
    location: 'JVC',
    service: 'Babysitter',
    status: 'not_active',
    internalRating: 4.5,
    customerRating: 4.7,
  },
  {
    workerId: 'HM-W-1203',
    name: 'Dr. James Okonkwo',
    phone: '+971 52 777 8899',
    location: 'Business Bay',
    service: 'Vet',
    status: 'active',
    internalRating: 4.9,
    customerRating: 4.8,
  },
  {
    workerId: 'HM-W-0912',
    name: 'Sara Hamed',
    phone: '+971 56 333 2211',
    location: 'Al Barsha',
    service: 'Grocery / personal shopper',
    status: 'on_hold',
    internalRating: 4.2,
    customerRating: 4.4,
  },
  {
    workerId: 'HM-W-0734',
    name: 'Vikram Singh',
    phone: '+971 50 999 0011',
    location: 'Deira',
    service: 'Lawn / garden',
    status: 'canceled',
    internalRating: 3.1,
    customerRating: 3.5,
  },
]

const JOBS: Array<{
  jobId: string
  summary: string
  service: string
  area: string
  status: JobStatus
  assignedWorker: string
}> = [
  {
    jobId: 'HM-J-5001',
    summary: 'Driver at 1:00 AM, airport pickup',
    service: 'Driver',
    area: 'Dubai',
    status: 'pending',
    assignedWorker: '—',
  },
  {
    jobId: 'HM-J-4992',
    summary: 'Home vet visit, cat check-up',
    service: 'Vet',
    area: 'Business Bay',
    status: 'in_progress',
    assignedWorker: 'Dr. James Okonkwo',
  },
  {
    jobId: 'HM-J-4988',
    summary: 'Gift delivery same evening',
    service: 'Delivery',
    area: 'JVC',
    status: 'completed',
    assignedWorker: 'Omar Al-Farsi',
  },
  {
    jobId: 'HM-J-4975',
    summary: 'Weekend babysitter, 6 hours',
    service: 'Babysitter',
    area: 'Marina',
    status: 'cancelled',
    assignedWorker: 'Priya Nair',
  },
]

/** Mirrors legacy homepage `service-data.ts` — icon keys match `@hire-me/types` allowlist. */
const SITE_SERVICES_SEED: Array<{
  slug: string
  title: string
  shortDescription: string
  iconKey: string
  sortOrder: number
}> = [
  {
    slug: 'express-delivery',
    title: 'Express delivery',
    shortDescription: 'Same-day parcels and documents, door to door.',
    iconKey: 'express',
    sortOrder: 0,
  },
  {
    slug: 'personal-shopping',
    title: 'Personal shopping',
    shortDescription: 'We shop the stores you pick; we deliver.',
    iconKey: 'shopping-bag',
    sortOrder: 1,
  },
  {
    slug: 'groceries-takeout',
    title: 'Groceries & takeout',
    shortDescription: 'Markets, cafés, and meal pickup runs.',
    iconKey: 'grocery',
    sortOrder: 2,
  },
  {
    slug: 'cooking-meal-prep',
    title: 'Cooking & meal prep',
    shortDescription: 'Help in the kitchen or ready-to-heat drop-offs.',
    iconKey: 'cooking',
    sortOrder: 3,
  },
  {
    slug: 'pharmacy-runs',
    title: 'Pharmacy runs',
    shortDescription: 'Prescriptions and essentials, discreet.',
    iconKey: 'pharmacy',
    sortOrder: 4,
  },
  {
    slug: 'banking-paperwork',
    title: 'Banking & paperwork',
    shortDescription: 'Cheques, deposits, and document handovers.',
    iconKey: 'bank-paper',
    sortOrder: 5,
  },
  {
    slug: 'gifts-luxe-shopping',
    title: 'Gifts & luxe shopping',
    shortDescription: 'Flowers, gifts, and boutique buys.',
    iconKey: 'gift',
    sortOrder: 6,
  },
  {
    slug: 'furniture-bulky-pickup',
    title: 'Furniture & bulky pickup',
    shortDescription: 'Big-box and heavy items to your home.',
    iconKey: 'bulky',
    sortOrder: 7,
  },
  {
    slug: 'car-motor-errands',
    title: 'Car & motor errands',
    shortDescription: 'Testing, renewals, and agency visits.',
    iconKey: 'car',
    sortOrder: 8,
  },
  {
    slug: 'queue-wait-service',
    title: 'Queue & wait service',
    shortDescription: 'We wait at banks, counters, and busy lines.',
    iconKey: 'queue',
    sortOrder: 9,
  },
  {
    slug: 'pet-taxi-vet',
    title: 'Pet taxi & vet trips',
    shortDescription: 'Safe rides and help for vet visits.',
    iconKey: 'paw',
    sortOrder: 10,
  },
  {
    slug: 'home-key-handovers',
    title: 'Home & key handovers',
    shortDescription: 'Check-ins, keys, and errands at your place.',
    iconKey: 'home-key',
    sortOrder: 11,
  },
  {
    slug: 'real-estate-agents',
    title: 'Real estate agents',
    shortDescription: 'Showings, lockboxes, staging drops, and buyer errands.',
    iconKey: 'real-estate',
    sortOrder: 12,
  },
  {
    slug: 'cleaning',
    title: 'Cleaning',
    shortDescription: 'Home tidy-ups, deep cleans, and move-out help.',
    iconKey: 'cleaning',
    sortOrder: 13,
  },
  {
    slug: 'tour-guides',
    title: 'Tour guides',
    shortDescription: 'City walks, sites, museums, and private day trips.',
    iconKey: 'tour-guide',
    sortOrder: 14,
  },
  {
    slug: 'translators',
    title: 'Translators',
    shortDescription: 'On-site interpretation and document language help.',
    iconKey: 'translate',
    sortOrder: 15,
  },
  {
    slug: 'tutors',
    title: 'Tutors',
    shortDescription: 'Homework help, skills coaching, and exam prep sessions.',
    iconKey: 'tutor',
    sortOrder: 16,
  },
  {
    slug: 'office-business',
    title: 'Office & business',
    shortDescription: 'Team errands and supplies—one WhatsApp thread.',
    iconKey: 'briefcase',
    sortOrder: 17,
  },
  {
    slug: 'anything-else',
    title: 'Anything legal',
    shortDescription: 'Describe it; we quote clearly and run it.',
    iconKey: 'message-spark',
    sortOrder: 18,
  },
]

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  await prisma.blogPost.deleteMany()
  await prisma.siteService.deleteMany()
  await prisma.job.deleteMany()
  await prisma.worker.deleteMany()
  await prisma.user.deleteMany()

  const alex = await prisma.user.create({
    data: {
      email: 'alex@hireme.internal',
      passwordHash,
      name: 'Alex Morgan',
      role: 'superadmin',
      status: 'active' as UserStatus,
    },
  })
  await prisma.user.create({
    data: {
      email: 'priya@hireme.internal',
      passwordHash,
      name: 'Priya Patel',
      role: 'admin',
      status: 'active',
    },
  })
  await prisma.user.create({
    data: {
      email: 'chris@hireme.internal',
      passwordHash,
      name: 'Chris Lee',
      role: 'agent',
      status: 'invited',
    },
  })
  const jamie = await prisma.user.create({
    data: {
      email: 'jamie@hireme.internal',
      passwordHash,
      name: 'Jamie Rivera',
      role: 'content_editor',
      status: 'active',
    },
  })

  for (let i = 0; i < SITE_SERVICES_SEED.length; i++) {
    const s = SITE_SERVICES_SEED[i]
    const n = i + 1
    const serviceKey = `SS-${String(n).padStart(2, '0')}`
    await prisma.siteService.create({
      data: {
        serviceKey,
        slug: s.slug,
        title: s.title,
        shortDescription: s.shortDescription,
        iconKey: s.iconKey,
        sortOrder: s.sortOrder,
        isActive: true,
      },
    })
  }

  const servicesByTitle = new Map(
    (await prisma.siteService.findMany({ select: { id: true, title: true } })).map(
      (row) => [row.title, row.id] as const,
    ),
  )

  for (const w of WORKERS) {
    const siteServiceId = servicesByTitle.get(w.service) ?? null
    await prisma.worker.create({
      data: {
        ...w,
        siteServiceIds: siteServiceId ? [siteServiceId] : [],
        siteServiceId,
      },
    })
  }
  for (const j of JOBS) {
    await prisma.job.create({ data: j })
  }

  const now = new Date()
  await prisma.blogPost.create({
    data: {
      slug: 'welcome-to-hire-me',
      title: 'Welcome to Hire Me',
      excerpt: 'How we help you book trusted help at home.',
      bodyMarkdown:
        '# Welcome\n\nHire Me connects you with vetted workers for everyday tasks.\n',
      status: 'published' as BlogPostStatus,
      authorId: jamie.id,
      authorName: jamie.name,
      publishedAt: now,
    },
  })
  await prisma.blogPost.create({
    data: {
      slug: 'draft-internal-notes',
      title: 'Internal draft',
      excerpt: 'Not visible on the public site.',
      bodyMarkdown: 'Draft only.',
      status: 'draft',
      authorId: alex.id,
      authorName: alex.name,
      publishedAt: null,
    },
  })

  console.info('Seed complete. Demo login: alex@hireme.internal / demo123 (and other seed users).')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
