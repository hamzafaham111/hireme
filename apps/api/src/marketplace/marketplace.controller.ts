import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Roles } from '../common/decorators/roles.decorator'
import { CurrentUser, type RequestUser } from '../common/decorators/current-user.decorator'
import { RolesGuard } from '../common/guards/roles.guard'
import { NearbyQueryDto } from './dto/nearby-query.dto'
import { MarketplaceService } from './marketplace.service'

const DEFAULT_RADIUS_KM = 50

@Controller('marketplace')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class MarketplaceController {
  constructor(private readonly marketplace: MarketplaceService) {}

  @Get('worker/jobs-nearby')
  @Roles('worker')
  jobsNearby(@CurrentUser() user: RequestUser, @Query() q: NearbyQueryDto) {
    this.marketplace.assertWorker(user.userId, user.role)
    const r = q.radiusKm ?? DEFAULT_RADIUS_KM
    return this.marketplace.jobsNearbyForWorker(user.userId, q.lat, q.lng, r)
  }

  @Get('customer/workers-nearby')
  @Roles('customer')
  workersNearby(@CurrentUser() user: RequestUser, @Query() q: NearbyQueryDto) {
    this.marketplace.assertCustomer(user.userId, user.role)
    const r = q.radiusKm ?? DEFAULT_RADIUS_KM
    return this.marketplace.workersNearbyForCustomer(q.lat, q.lng, r)
  }

  @Get('customer/jobs/:jobId/suggested-workers')
  @Roles('customer')
  suggestedWorkers(
    @CurrentUser() user: RequestUser,
    @Param('jobId') jobId: string,
    @Query('radiusKm') radiusRaw?: string,
  ) {
    this.marketplace.assertCustomer(user.userId, user.role)
    const radiusKm = radiusRaw ? Math.min(500, Math.max(1, Number(radiusRaw))) : DEFAULT_RADIUS_KM
    return this.marketplace.suggestedWorkersForJob(user.userId, jobId, radiusKm)
  }
}
