let cachedApp = null;

async function createApp() {
  if (cachedApp) {
    return cachedApp;
  }

  const express = require('express');
  const { NestFactory } = require('@nestjs/core');
  const { ExpressAdapter } = require('@nestjs/platform-express');
  const { ValidationPipe } = require('@nestjs/common');
  const { join } = require('path');
  const { AppModule } = require('../dist/app.module');

  const expressApp = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

  const configService = app.get(require('@nestjs/config').ConfigService);

  expressApp.use(
    '/api/uploads',
    express.static(join(process.cwd(), 'prisma', 'uploads')),
  );

  const frontendUrl = configService.get('FRONTEND_URL') || 'http://localhost:3000';
  const allowedOrigins = [
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

module.exports = async function handler(req, res) {
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
        error: error instanceof Error ? error.message : String(error),
        hint: 'Check DATABASE_URL and JWT_SECRET are set in Vercel Environment Variables',
      }),
    );
  }
};
