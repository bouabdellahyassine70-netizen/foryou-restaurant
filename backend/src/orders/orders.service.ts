import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { PromoCodesService } from '../promo-codes/promo-codes.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus, OrderType, PaymentMethod } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private paymentsService: PaymentsService,
    private promoCodesService: PromoCodesService,
    private websocketGateway: WebsocketGateway,
  ) {}

  async create(userId: string | null, createOrderDto: CreateOrderDto) {
    const { items, promoCode, paymentMethod, idempotencyKey, tableId, type, customerName, customerPhone, deliveryInstructions } = createOrderDto;

    // Check idempotency
    if (idempotencyKey) {
      const existing = await this.prisma.order.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        return existing;
      }
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
        include: { modifiers: true },
      });

      if (!menuItem || !menuItem.isAvailable) {
        throw new BadRequestException(`Menu item ${item.menuItemId} not available`);
      }

      let itemPrice = Number(menuItem.price) * item.quantity;

      // Add modifier prices
      if (item.modifierIds && item.modifierIds.length > 0) {
        const modifiers = menuItem.modifiers.filter((m) =>
          item.modifierIds.includes(m.id),
        );
        itemPrice += modifiers.reduce((sum, m) => sum + Number(m.price) * item.quantity, 0);
      }

      subtotal += itemPrice;
      orderItems.push({ menuItem, item, itemPrice });
    }

    // Apply promo code
    let discount = 0;
    let promoCodeId = null;
    if (promoCode) {
      const promo = await this.promoCodesService.validateAndApply(promoCode, subtotal);
      if (promo) {
        discount = Number(promo.discountValue);
        promoCodeId = promo.id;
      }
    }

    const tax = subtotal * 0.1; // 10% tax
    const deliveryFee = type === OrderType.DELIVERY ? 20 : 0; // 20 DH for delivery
    const total = subtotal + deliveryFee + tax - discount;

    // Generate order number
    const orderNumber = `FY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId: userId || null,
        tableId: tableId || null,
        type: type || OrderType.DINE_IN,
        status: OrderStatus.CREATED,
        paymentMethod: paymentMethod || PaymentMethod.COUNTER,
        paymentStatus: paymentMethod === PaymentMethod.STRIPE ? 'PENDING' : 'PENDING',
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        customerName: customerName || null,
        customerPhone: customerPhone || null,
        deliveryAddress: deliveryInstructions || null,
        promoCodeId,
        idempotencyKey: idempotencyKey || uuidv4(),
        notes: createOrderDto.notes,
        deliveryInstructions: deliveryInstructions || null,
        items: {
          create: orderItems.map(({ menuItem, item, itemPrice }) => ({
            menuItemId: menuItem.id,
            quantity: item.quantity,
            price: itemPrice / item.quantity,
            notes: item.notes,
            modifiers: item.modifierIds
              ? {
                  create: item.modifierIds.map((modifierId) => {
                    const modifier = menuItem.modifiers.find((m) => m.id === modifierId);
                    return {
                      modifierId,
                      price: modifier ? Number(modifier.price) : 0,
                    };
                  }),
                }
              : undefined,
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
            modifiers: { include: { modifier: true } },
          },
        },
        user: true,
        table: true,
        promoCode: true,
      },
    });

    // Process payment if Stripe
    if (paymentMethod === PaymentMethod.STRIPE && createOrderDto.stripePaymentIntentId) {
      await this.paymentsService.confirmPayment(order.id, createOrderDto.stripePaymentIntentId);
    }

    // Emit WebSocket event
    this.websocketGateway.emitOrderCreated(order);

    return order;
  }

  async findAll(userId?: string, status?: OrderStatus) {
    return this.prisma.order.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(status ? { status } : {}),
      },
      include: {
        items: {
          include: {
            menuItem: true,
            modifiers: { include: { modifier: true } },
          },
        },
        user: true,
        table: true,
        promoCode: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            menuItem: true,
            modifiers: { include: { modifier: true } },
          },
        },
        user: true,
        table: true,
        promoCode: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Users can only see their own orders unless admin/manager
    if (userId && order.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async updateStatus(id: string, updateDto: UpdateOrderStatusDto, userId: string) {
    const order = await this.findOne(id);

    // Validate status transition
    const validTransitions = this.getValidStatusTransitions(order.status);
    if (!validTransitions.includes(updateDto.status)) {
      throw new BadRequestException(
        `Invalid status transition from ${order.status} to ${updateDto.status}`,
      );
    }

    const updateData: any = {
      status: updateDto.status,
    };

    if (updateDto.status === OrderStatus.ACCEPTED) {
      updateData.acceptedAt = new Date();
    } else if (updateDto.status === OrderStatus.READY) {
      updateData.readyAt = new Date();
    } else if (
      updateDto.status === OrderStatus.COMPLETED ||
      updateDto.status === OrderStatus.SERVED ||
      updateDto.status === OrderStatus.DISPATCHED
    ) {
      updateData.completedAt = new Date();
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            menuItem: true,
            modifiers: { include: { modifier: true } },
          },
        },
        user: true,
        table: true,
      },
    });

    // Emit WebSocket event
    this.websocketGateway.emitOrderStatusChanged(updated);

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        userId,
        orderId: id,
        action: 'ORDER_STATUS_UPDATED',
        entity: 'Order',
        entityId: id,
        changes: { from: order.status, to: updateDto.status },
      },
    });

    return updated;
  }

  async cancel(id: string, userId: string) {
    const order = await this.findOne(id, userId);

    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cannot cancel completed or already cancelled order');
    }

    // Refund if paid
    if (order.paymentStatus === 'PAID' && order.paymentMethod === PaymentMethod.STRIPE) {
      await this.paymentsService.refund(order.id);
    }

    const cancelled = await this.prisma.order.update({
      where: { id },
      data: {
        status: OrderStatus.CANCELLED,
        paymentStatus: order.paymentStatus === 'PAID' ? 'REFUNDED' : order.paymentStatus,
      },
    });

    this.websocketGateway.emitOrderStatusChanged(cancelled);

    return cancelled;
  }

  private getValidStatusTransitions(currentStatus: OrderStatus): OrderStatus[] {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
      CREATED: [OrderStatus.PAID, OrderStatus.CONFIRMED, OrderStatus.PENDING, OrderStatus.CANCELLED],
      PENDING: [OrderStatus.CONFIRMED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
      CONFIRMED: [OrderStatus.ACCEPTED, OrderStatus.REJECTED, OrderStatus.CANCELLED],
      REJECTED: [],
      ACCEPTED: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      PREPARING: [OrderStatus.READY, OrderStatus.CANCELLED],
      READY: [OrderStatus.SERVED, OrderStatus.DISPATCHED, OrderStatus.CANCELLED],
      SERVED: [OrderStatus.COMPLETED],
      DISPATCHED: [OrderStatus.COMPLETED],
      COMPLETED: [],
      CANCELLED: [],
      PAID: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      REFUNDED: [],
    };
    return transitions[currentStatus] || [];
  }

  async getAnalytics(startDate?: string, endDate?: string) {
    const start = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0));
    const end = endDate ? new Date(endDate) : new Date();

    // Today's sales
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: todayStart },
        status: { not: 'CANCELLED' },
      },
    });
    const todaySales = todayOrders.reduce((sum, o) => sum + Number(o.total), 0);

    // This week's sales
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: weekStart },
        status: { not: 'CANCELLED' },
      },
    });
    const weekSales = weekOrders.reduce((sum, o) => sum + Number(o.total), 0);

    // Average order value
    const allOrders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: { not: 'CANCELLED' },
      },
    });
    const avgOrder = allOrders.length > 0
      ? allOrders.reduce((sum, o) => sum + Number(o.total), 0) / allOrders.length
      : 0;

    // Popular items
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: { gte: start, lte: end },
          status: { not: 'CANCELLED' },
        },
      },
      include: { menuItem: true },
    });

    const itemCounts: Record<string, { id: string; name: string; count: number }> = {};
    orderItems.forEach((item) => {
      const menuItemId = item.menuItemId;
      if (!itemCounts[menuItemId]) {
        itemCounts[menuItemId] = {
          id: menuItemId,
          name: item.menuItem.name,
          count: 0,
        };
      }
      itemCounts[menuItemId].count += item.quantity;
    });

    const popularItems = Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Rush hours
    const ordersByHour: Record<number, number> = {};
    allOrders.forEach((order) => {
      const hour = new Date(order.createdAt).getHours();
      ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;
    });

    const rushHours = Object.entries(ordersByHour)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      todaySales,
      todayOrders: todayOrders.length,
      weekSales,
      weekOrders: weekOrders.length,
      avgOrder,
      popularItems,
      rushHours,
    };
  }
}

