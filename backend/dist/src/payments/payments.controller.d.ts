import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPaymentIntent(body: {
        orderId: string;
        amount: number;
        idempotencyKey: string;
    }): Promise<{
        clientSecret: string;
        paymentIntentId: string;
    }>;
    handleWebhook(body: any, signature: string): Promise<{
        received: boolean;
    }>;
}
