import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { AuthModule } from './auth/auth.module'
import { BlogModule } from './blog/blog.module'
import { PrismaModule } from './common/prisma/prisma.module'
import { CustomersModule } from './customers/customers.module'
import { HealthController } from './health.controller'
import { JobsModule } from './jobs/jobs.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { SiteServicesModule } from './site-services/site-services.module'
import { WorkersModule } from './workers/workers.module'
import { MarketplaceModule } from './marketplace/marketplace.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Resolve `.env` next to `apps/api/` even if the shell cwd is the monorepo root.
      envFilePath: join(__dirname, '..', '.env'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 5, // 5 requests per 60 seconds
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    CustomersModule,
    WorkersModule,
    JobsModule,
    RolesModule,
    BlogModule,
    SiteServicesModule,
    MarketplaceModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
