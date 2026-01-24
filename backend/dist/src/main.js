"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const Sentry = require("@sentry/nestjs");
const path_1 = require("path");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'prisma', 'uploads'), {
        prefix: '/api/uploads/',
    });
    app.enableCors({
        origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    const sentryDsn = configService.get('SENTRY_DSN');
    if (sentryDsn) {
        Sentry.init({
            dsn: sentryDsn,
            environment: configService.get('NODE_ENV') || 'development',
            tracesSampleRate: 1.0,
        });
    }
    const config = new swagger_1.DocumentBuilder()
        .setTitle('For You Restaurant API')
        .setDescription('Production-grade restaurant ordering system API')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('PORT') || 4000;
    await app.listen(port);
    console.log(`🚀 API running on http://localhost:${port}`);
    console.log(`📚 API docs: http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map