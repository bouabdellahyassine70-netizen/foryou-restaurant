import { OrderItemDto } from './order.dto';
export declare class VoiceOrderDto {
    voiceOrderId: string;
    customerPhone: string;
    customerName?: string;
    items: OrderItemDto[];
    type?: string;
    deliveryAddress?: string;
    notes?: string;
}
