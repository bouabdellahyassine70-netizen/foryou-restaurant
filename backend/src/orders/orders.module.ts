import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../common/prisma/prisma.module';
import { PaymentsModule } from '../payments/payments.module';
import { PromoCodesModule } from '../promo-codes/promo-codes.module';
import { WebsocketModule } from '../websocket/websocket.module';

@Module({
  imports: [PrismaModule, PaymentsModule, PromoCodesModule, WebsocketModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

