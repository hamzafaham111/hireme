import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { BlogModule } from './blog/blog.module'
import { PrismaModule } from './common/prisma/prisma.module'
import { HealthController } from './health.controller'
import { JobsModule } from './jobs/jobs.module'
import { RolesModule } from './roles/roles.module'
import { UsersModule } from './users/users.module'
import { WorkersModule } from './workers/workers.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Resolve `.env` next to `apps/api/` even if the shell cwd is the monorepo root.
      envFilePath: join(__dirname, '..', '.env'),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    WorkersModule,
    JobsModule,
    RolesModule,
    BlogModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
