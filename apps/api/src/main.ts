import { join } from 'node:path'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)

  const uploadDir =
    config.get<string>('UPLOAD_DIR')?.trim() || join(process.cwd(), 'uploads')
  app.useStaticAssets(uploadDir, { prefix: '/uploads/' })

  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  const originsRaw = config.get<string>('CORS_ORIGINS') ?? ''
  const origins = originsRaw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
  app.enableCors({
    origin: origins.length ? origins : true,
    credentials: true,
  })

  const port = Number(config.get('PORT') ?? 4000)
  await app.listen(port)
}

bootstrap().catch((err) => {
  console.error(err)
  process.exit(1)
})
