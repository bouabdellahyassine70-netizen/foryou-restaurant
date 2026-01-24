import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    private kitchenClients;
    private customerClients;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinKitchen(client: Socket): void;
    handleJoinOrder(client: Socket, orderId: string): void;
    emitOrderCreated(order: any): void;
    emitOrderStatusChanged(order: any): void;
}
