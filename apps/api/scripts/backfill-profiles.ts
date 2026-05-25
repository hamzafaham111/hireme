import { PrismaClient } from '@prisma/client'

async function backfillProfiles() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Starting profile backfill...')
    
    // 1. Create Customer profiles for existing customer users
    console.log('\n1. Creating Customer profiles...')
    const customers = await prisma.user.findMany({
      where: { role: 'customer' },
    })
    
    console.log(`Found ${customers.length} customer users`)
    
    for (const user of customers) {
      await prisma.customer.upsert({
        where: { userId: user.id },
        create: { 
          userId: user.id,
          customerType: 'individual',
        },
        update: {},
      })
      console.log(`  ✓ Created customer profile for user ${user.email}`)
    }
    
    // 2. Backfill Worker approval data from User table
    console.log('\n2. Backfilling Worker approval data...')
    const workers = await prisma.worker.findMany({
      include: { user: true },
    })
    
    console.log(`Found ${workers.length} workers`)
    
    for (const worker of workers) {
      if (worker.user) {
        const approvalStatus = worker.user.workerApproved ? 'approved' : 'pending'
        
        await prisma.worker.update({
          where: { id: worker.id },
          data: {
            approvalStatus: approvalStatus as any,
            approvedAt: worker.user.approvedAt,
            approvedBy: worker.user.approvedBy,
          },
        })
        
        console.log(`  ✓ Updated worker ${worker.name} - status: ${approvalStatus}`)
      } else {
        console.log(`  ⚠ Worker ${worker.name} has no linked user`)
      }
    }
    
    console.log('\n✅ Profile backfill completed successfully!')
  } catch (error) {
    console.error('❌ Error during backfill:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the backfill
backfillProfiles()
  .then(() => {
    console.log('\nBackfill script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Backfill script failed:', error)
    process.exit(1)
  })
