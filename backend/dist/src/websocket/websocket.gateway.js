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
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
let WebsocketGateway = class WebsocketGateway {
    constructor() {
        this.logger = new common_1.Logger('WebsocketGateway');
        this.kitchenClients = new Set();
        this.customerClients = new Map();
    }
    handleConnection(client) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.kitchenClients.delete(client.id);
        for (const [orderId, socketId] of this.customerClients.entries()) {
            if (socketId === client.id) {
                this.customerClients.delete(orderId);
            }
        }
    }
    handleJoinKitchen(client) {
        this.kitchenClients.add(client.id);
        this.logger.log(`Kitchen client joined: ${client.id}`);
        client.emit('joined-kitchen', { success: true });
    }
    handleJoinOrder(client, orderId) {
        this.customerClients.set(orderId, client.id);
        this.logger.log(`Customer joined order: ${orderId}`);
        client.emit('joined-order', { orderId, success: true });
    }
    emitOrderCreated(order) {
        this.server.to(Array.from(this.kitchenClients)).emit('order_created', order);
        this.logger.log(`Order created event emitted: ${order.id}`);
    }
    emitOrderStatusChanged(order) {
        this.server.to(Array.from(this.kitchenClients)).emit('order_status_changed', order);
        const customerSocketId = this.customerClients.get(order.id);
        if (customerSocketId) {
            this.server.to(customerSocketId).emit('order_status_changed', order);
        }
        this.logger.log(`Order status changed event emitted: ${order.id} -> ${order.status}`);
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-kitchen'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleJoinKitchen", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join-order'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleJoinOrder", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            credentials: true,
        },
    })
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map