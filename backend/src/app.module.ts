import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MenuModule } from './menu/menu.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { TablesModule } from './tables/tables.module';
import { WebsocketModule } from './websocket/websocket.module';
import { UploadModule } from './upload/upload.module';
import { AppController } from './app.controller';
import { BullModule } from '@nestjs/bullmq';
import { Redis } from 'ioredis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          throttlers: [{
            ttl: (Number(config.get('RATE_LIMIT_TTL')) || 60) * 1000,
            limit: Number(config.get('RATE_LIMIT_MAX')) || 100,
          }],
        };
      },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get('REDIS_URL') || 'redis://localhost:6379';
        const redis = new Redis(redisUrl, {
          maxRetriesPerRequest: null,
          retryStrategy: (times) => {
            if (times > 10) {
              console.warn('⚠️  Redis connection failed after 10 retries.');
              return null;
            }
            return Math.min(times * 50, 2000);
          },
          enableOfflineQueue: false,
          lazyConnect: true,
        });
        
        return { connection: redis };
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MenuModule,
    OrdersModule,
    PaymentsModule,
    PromoCodesModule,
    TablesModule,
    WebsocketModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
