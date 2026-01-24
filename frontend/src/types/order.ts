// Order types for frontend (matching Prisma OrderStatus enum)
export type OrderStatus =
  | 'CREATED'
  | 'PENDING'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'ACCEPTED'
  | 'PREPARING'
  | 'READY'
  | 'DISPATCHED'
  | 'SERVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'PAID'
  | 'REFUNDED';

// Also export as const for runtime checks if needed
export const OrderStatusEnum = {
  CREATED: 'CREATED',
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  ACCEPTED: 'ACCEPTED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  DISPATCHED: 'DISPATCHED',
  SERVED: 'SERVED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;
