import { ExecutionContext, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ExtractJwt } from 'passport-jwt'

/**
 * Attaches `req.user` when a valid Bearer JWT is present; otherwise continues
 * without authentication (used for public blog routes that may widen visibility).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  override async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    if (!token) {
      return true
    }
    try {
      return (await super.canActivate(context)) as boolean
    } catch {
      req.user = undefined
      return true
    }
  }

  override handleRequest<TUser>(err: Error | undefined, user: TUser): TUser {
    return user
  }
}
