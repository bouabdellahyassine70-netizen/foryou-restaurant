import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    private configService;
    private stripe;
    constructor(prisma: PrismaService, configService: ConfigService);
    createPaymentIntent(orderId: string, amount: number, idempotencyKey: string): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    confirmPayment(orderId: string, paymentIntentId: string): Promise<{
        success: boolean;
    }>;
    refund(orderId: string): Promise<{
        success: boolean;
    }>;
    handleWebhook(payload: any, signature: string): Promise<{
        received: boolean;
    }>;
}
