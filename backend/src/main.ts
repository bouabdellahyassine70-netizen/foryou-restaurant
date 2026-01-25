import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/nestjs';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Serve static files from uploads directory
  app.useStaticAssets(join(process.cwd(), 'prisma', 'uploads'), {
    prefix: '/api/uploads/',
  });

  // CORS - Allow multiple origins for production and development
  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:3000',
    'https://foryou-restaurant-k0jzjwrse.vercel.app',
    /^https:\/\/foryou-restaurant-.*\.vercel\.app$/,
    /^https:\/\/.*\.vercel\.app$/, // Allow all Vercel preview URLs
  ];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      // Check if origin is allowed
      const isAllowed = allowedOrigins.some(allowed => {
        if (typeof allowed === 'string') {
          return origin === allowed;
        }
        if (allowed instanceof RegExp) {
          return allowed.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        // Temporarily allow all Vercel URLs for debugging
        if (origin.includes('.vercel.app')) {
          console.log(`⚠️  Allowing Vercel origin (not in allowed list): ${origin}`);
          callback(null, true);
        } else {
          // Log for debugging
          console.log(`🚫 CORS blocked origin: ${origin}`);
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false, // Allow extra properties for now to fix customerName/customerPhone issue
      transform: true,
    }),
  );

  // Sentry
  const sentryDsn = configService.get('SENTRY_DSN');
  if (sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      environment: configService.get('NODE_ENV') || 'development',
      tracesSampleRate: 1.0,
    });
  }

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('For You Restaurant API')
    .setDescription('Production-grade restaurant ordering system API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT') || 4000;
  await app.listen(port);
  console.log(`🚀 API running on http://localhost:${port}`);
  console.log(`📚 API docs: http://localhost:${port}/api/docs`);
}

bootstrap();

