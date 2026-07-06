import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import type { Express, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express') as typeof import('express');

let cachedApp: Express | null = null;

async function createApp(): Promise<Express> {
  if (cachedApp) {
    return cachedApp;
  }

  const expressApp = express();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  const configService = app.get(ConfigService);

  app.useStaticAssets(join(process.cwd(), 'prisma', 'uploads'), {
    prefix: '/api/uploads/',
  });

  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
  const allowedOrigins: Array<string | RegExp> = [
    frontendUrl,
    'http://localhost:3000',
    'https://foryou-restaurant-k0jzjwrse.vercel.app',
    /^https:\/\/foryou-restaurant-.*\.vercel\.app$/,
    /^https:\/\/.*\.vercel\.app$/,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === 'string') return origin === allowed;
        if (allowed instanceof RegExp) return allowed.test(origin);
        return false;
      });

      if (isAllowed || origin.includes('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  expressApp.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      message: 'For You Restaurant API',
      health: '/api/health',
      menu: '/api/menu/categories',
    });
  });

  await app.init();
  cachedApp = expressApp;
  return expressApp;
}

export default async function handler(req: Request, res: Response) {
  try {
    const app = await createApp();
    return app(req, res);
  } catch (error) {
    console.error('Vercel handler error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        statusCode: 500,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    );
  }
}
