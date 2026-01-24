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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const payments_service_1 = require("../payments/payments.service");
const promo_codes_service_1 = require("../promo-codes/promo-codes.service");
const websocket_gateway_1 = require("../websocket/websocket.gateway");
const client_1 = require("@prisma/client");
const uuid_1 = require("uuid");
let OrdersService = class OrdersService {
    constructor(prisma, paymentsService, promoCodesService, websocketGateway) {
        this.prisma = prisma;
        this.paymentsService = paymentsService;
        this.promoCodesService = promoCodesService;
        this.websocketGateway = websocketGateway;
    }
    async create(userId, createOrderDto) {
        const { items, promoCode, paymentMethod, idempotencyKey, tableId, type, customerName, customerPhone, deliveryInstructions } = createOrderDto;
        if (idempotencyKey) {
            const existing = await this.prisma.order.findUnique({
                where: { idempotencyKey },
            });
            if (existing) {
                return existing;
            }
        }
        let subtotal = 0;
        const orderItems = [];
        for (const item of items) {
            const menuItem = await this.prisma.menuItem.findUnique({
                where: { id: item.menuItemId },
                include: { modifiers: true },
            });
            if (!menuItem || !menuItem.isAvailable) {
                throw new common_1.BadRequestException(`Menu item ${item.menuItemId} not available`);
            }
            let itemPrice = Number(menuItem.price) * item.quantity;
            if (item.modifierIds && item.modifierIds.length > 0) {
                const modifiers = menuItem.modifiers.filter((m) => item.modifierIds.includes(m.id));
                itemPrice += modifiers.reduce((sum, m) => sum + Number(m.price) * item.quantity, 0);
            }
            subtotal += itemPrice;
            orderItems.push({ menuItem, item, itemPrice });
        }
        let discount = 0;
        let promoCodeId = null;
        if (promoCode) {
            const promo = await this.promoCodesService.validateAndApply(promoCode, subtotal);
            if (promo) {
                discount = Number(promo.discountValue);
                promoCodeId = promo.id;
            }
        }
        const tax = subtotal * 0.1;
        const deliveryFee = type === client_1.OrderType.DELIVERY ? 20 : 0;
        const total = subtotal + deliveryFee + tax - discount;
        const orderNumber = `FY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const order = await this.prisma.order.create({
            data: {
                orderNumber,
                userId: userId || null,
                tableId: tableId || null,
                type: type || client_1.OrderType.DINE_IN,
                status: client_1.OrderStatus.CREATED,
                paymentMethod: paymentMethod || client_1.PaymentMethod.COUNTER,
                paymentStatus: paymentMethod === client_1.PaymentMethod.STRIPE ? 'PENDING' : 'PENDING',
                subtotal,
                deliveryFee,
                tax,
                discount,
                total,
                customerName: customerName || null,
                customerPhone: customerPhone || null,
                deliveryAddress: deliveryInstructions || null,
                promoCodeId,
                idempotencyKey: idempotencyKey || (0, uuid_1.v4)(),
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
        if (paymentMethod === client_1.PaymentMethod.STRIPE && createOrderDto.stripePaymentIntentId) {
            await this.paymentsService.confirmPayment(order.id, createOrderDto.stripePaymentIntentId);
        }
        this.websocketGateway.emitOrderCreated(order);
        return order;
    }
    async findAll(userId, status) {
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
    async findOne(id, userId) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        if (userId && order.userId !== userId) {
            throw new common_1.ForbiddenException('Access denied');
        }
        return order;
    }
    async updateStatus(id, updateDto, userId) {
        const order = await this.findOne(id);
        const validTransitions = this.getValidStatusTransitions(order.status);
        if (!validTransitions.includes(updateDto.status)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${order.status} to ${updateDto.status}`);
        }
        const updateData = {
            status: updateDto.status,
        };
        if (updateDto.status === client_1.OrderStatus.ACCEPTED) {
            updateData.acceptedAt = new Date();
        }
        else if (updateDto.status === client_1.OrderStatus.READY) {
            updateData.readyAt = new Date();
        }
        else if (updateDto.status === client_1.OrderStatus.COMPLETED ||
            updateDto.status === client_1.OrderStatus.SERVED ||
            updateDto.status === client_1.OrderStatus.DISPATCHED) {
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
        this.websocketGateway.emitOrderStatusChanged(updated);
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
    async cancel(id, userId) {
        const order = await this.findOne(id, userId);
        if (order.status === client_1.OrderStatus.COMPLETED || order.status === client_1.OrderStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot cancel completed or already cancelled order');
        }
        if (order.paymentStatus === 'PAID' && order.paymentMethod === client_1.PaymentMethod.STRIPE) {
            await this.paymentsService.refund(order.id);
        }
        const cancelled = await this.prisma.order.update({
            where: { id },
            data: {
                status: client_1.OrderStatus.CANCELLED,
                paymentStatus: order.paymentStatus === 'PAID' ? 'REFUNDED' : order.paymentStatus,
            },
        });
        this.websocketGateway.emitOrderStatusChanged(cancelled);
        return cancelled;
    }
    getValidStatusTransitions(currentStatus) {
        const transitions = {
            CREATED: [client_1.OrderStatus.PAID, client_1.OrderStatus.CONFIRMED, client_1.OrderStatus.PENDING, client_1.OrderStatus.CANCELLED],
            PENDING: [client_1.OrderStatus.CONFIRMED, client_1.OrderStatus.REJECTED, client_1.OrderStatus.CANCELLED],
            CONFIRMED: [client_1.OrderStatus.ACCEPTED, client_1.OrderStatus.REJECTED, client_1.OrderStatus.CANCELLED],
            REJECTED: [],
            ACCEPTED: [client_1.OrderStatus.PREPARING, client_1.OrderStatus.CANCELLED],
            PREPARING: [client_1.OrderStatus.READY, client_1.OrderStatus.CANCELLED],
            READY: [client_1.OrderStatus.SERVED, client_1.OrderStatus.DISPATCHED, client_1.OrderStatus.CANCELLED],
            SERVED: [client_1.OrderStatus.COMPLETED],
            DISPATCHED: [client_1.OrderStatus.COMPLETED],
            COMPLETED: [],
            CANCELLED: [],
            PAID: [client_1.OrderStatus.CONFIRMED, client_1.OrderStatus.CANCELLED],
            REFUNDED: [],
        };
        return transitions[currentStatus] || [];
    }
    async getAnalytics(startDate, endDate) {
        const start = startDate ? new Date(startDate) : new Date(new Date().setHours(0, 0, 0, 0));
        const end = endDate ? new Date(endDate) : new Date();
        const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
        const todayOrders = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: todayStart },
                status: { not: 'CANCELLED' },
            },
        });
        const todaySales = todayOrders.reduce((sum, o) => sum + Number(o.total), 0);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        const weekOrders = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: weekStart },
                status: { not: 'CANCELLED' },
            },
        });
        const weekSales = weekOrders.reduce((sum, o) => sum + Number(o.total), 0);
        const allOrders = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: start, lte: end },
                status: { not: 'CANCELLED' },
            },
        });
        const avgOrder = allOrders.length > 0
            ? allOrders.reduce((sum, o) => sum + Number(o.total), 0) / allOrders.length
            : 0;
        const orderItems = await this.prisma.orderItem.findMany({
            where: {
                order: {
                    createdAt: { gte: start, lte: end },
                    status: { not: 'CANCELLED' },
                },
            },
            include: { menuItem: true },
        });
        const itemCounts = {};
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
        const ordersByHour = {};
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        payments_service_1.PaymentsService,
        promo_codes_service_1.PromoCodesService,
        websocket_gateway_1.WebsocketGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map