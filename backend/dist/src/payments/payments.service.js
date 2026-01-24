"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../common/prisma/prisma.service");
const stripe_1 = require("stripe");
let PaymentsService = class PaymentsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.stripe = null;
        const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
        const stripeEnabled = this.configService.get('STRIPE_ENABLED') === 'true';
        if (stripeKey && stripeEnabled) {
            this.stripe = new stripe_1.default(stripeKey, { apiVersion: '2023-10-16' });
        }
    }
    async createPaymentIntent(orderId, amount, idempotencyKey) {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Stripe is not enabled');
        }
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'usd',
            metadata: { orderId },
        }, { idempotencyKey });
        await this.prisma.order.update({
            where: { id: orderId },
            data: { stripePaymentId: paymentIntent.id },
        });
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    }
    async confirmPayment(orderId, paymentIntentId) {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Stripe is not enabled');
        }
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            throw new common_1.BadRequestException('Payment not succeeded');
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'PAID',
                status: 'CONFIRMED',
            },
        });
        return { success: true };
    }
    async refund(orderId) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order || !order.stripePaymentId) {
            throw new common_1.BadRequestException('Order or payment not found');
        }
        if (this.stripe) {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(order.stripePaymentId);
            if (paymentIntent.status === 'succeeded') {
                await this.stripe.refunds.create({
                    payment_intent: order.stripePaymentId,
                });
            }
        }
        await this.prisma.order.update({
            where: { id: orderId },
            data: {
                paymentStatus: 'REFUNDED',
                status: 'REFUNDED',
            },
        });
        return { success: true };
    }
    async handleWebhook(payload, signature) {
        if (!this.stripe) {
            throw new common_1.BadRequestException('Stripe is not enabled');
        }
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const orderId = paymentIntent.metadata.orderId;
            if (orderId) {
                await this.prisma.order.update({
                    where: { id: orderId },
                    data: {
                        paymentStatus: 'PAID',
                        status: 'CONFIRMED',
                    },
                });
            }
        }
        return { received: true };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map