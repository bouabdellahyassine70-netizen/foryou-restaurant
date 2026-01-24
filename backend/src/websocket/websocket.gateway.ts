import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WebsocketGateway');
  private kitchenClients: Set<string> = new Set();
  private customerClients: Map<string, string> = new Map(); // orderId -> socketId

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.kitchenClients.delete(client.id);
    // Remove from customer clients
    for (const [orderId, socketId] of this.customerClients.entries()) {
      if (socketId === client.id) {
        this.customerClients.delete(orderId);
      }
    }
  }

  @SubscribeMessage('join-kitchen')
  handleJoinKitchen(client: Socket) {
    this.kitchenClients.add(client.id);
    this.logger.log(`Kitchen client joined: ${client.id}`);
    client.emit('joined-kitchen', { success: true });
  }

  @SubscribeMessage('join-order')
  handleJoinOrder(client: Socket, orderId: string) {
    this.customerClients.set(orderId, client.id);
    this.logger.log(`Customer joined order: ${orderId}`);
    client.emit('joined-order', { orderId, success: true });
  }

  emitOrderCreated(order: any) {
    // Notify kitchen
    this.server.to(Array.from(this.kitchenClients)).emit('order_created', order);
    this.logger.log(`Order created event emitted: ${order.id}`);
  }

  emitOrderStatusChanged(order: any) {
    // Notify kitchen
    this.server.to(Array.from(this.kitchenClients)).emit('order_status_changed', order);

    // Notify customer if connected
    const customerSocketId = this.customerClients.get(order.id);
    if (customerSocketId) {
      this.server.to(customerSocketId).emit('order_status_changed', order);
    }

    this.logger.log(`Order status changed event emitted: ${order.id} -> ${order.status}`);
  }
}

