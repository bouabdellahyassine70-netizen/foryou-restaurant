import { OrderType, PaymentMethod, OrderStatus } from '@prisma/client';
export declare class OrderItemDto {
    menuItemId: string;
    quantity: number;
    modifierIds?: string[];
    notes?: string;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    type?: OrderType;
    tableId?: string;
    promoCode?: string;
    paymentMethod?: PaymentMethod;
    stripePaymentIntentId?: string;
    idempotencyKey?: string;
    notes?: string;
    customerName?: string;
    customerPhone?: string;
    digitalReceipt?: boolean;
    packagingPreference?: string;
    includeCutlery?: boolean;
    deliveryInstructions?: string;
    isVoiceOrder?: boolean;
    voiceOrderId?: string;
}
export declare class UpdateOrderStatusDto {
    status: OrderStatus;
}
