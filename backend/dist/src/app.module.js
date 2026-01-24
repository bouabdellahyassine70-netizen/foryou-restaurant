"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const prisma_module_1 = require("./common/prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const menu_module_1 = require("./menu/menu.module");
const orders_module_1 = require("./orders/orders.module");
const payments_module_1 = require("./payments/payments.module");
const promo_codes_module_1 = require("./promo-codes/promo-codes.module");
const tables_module_1 = require("./tables/tables.module");
const websocket_module_1 = require("./websocket/websocket.module");
const upload_module_1 = require("./upload/upload.module");
const app_controller_1 = require("./app.controller");
const bullmq_1 = require("@nestjs/bullmq");
const ioredis_1 = require("ioredis");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    return {
                        throttlers: [{
                                ttl: (Number(config.get('RATE_LIMIT_TTL')) || 60) * 1000,
                                limit: Number(config.get('RATE_LIMIT_MAX')) || 100,
                            }],
                    };
                },
            }),
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => {
                    const redisUrl = config.get('REDIS_URL') || 'redis://localhost:6379';
                    const redis = new ioredis_1.Redis(redisUrl, {
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
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            menu_module_1.MenuModule,
            orders_module_1.OrdersModule,
            payments_module_1.PaymentsModule,
            promo_codes_module_1.PromoCodesModule,
            tables_module_1.TablesModule,
            websocket_module_1.WebsocketModule,
            upload_module_1.UploadModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map