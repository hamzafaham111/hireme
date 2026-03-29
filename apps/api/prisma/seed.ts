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

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)

  await prisma.blogPost.deleteMany()
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

  for (const w of WORKERS) {
    await prisma.worker.create({ data: w })
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
