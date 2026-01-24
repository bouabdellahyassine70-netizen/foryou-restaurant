import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe | null = null;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get('STRIPE_SECRET_KEY');
    const stripeEnabled = this.configService.get('STRIPE_ENABLED') === 'true';
    if (stripeKey && stripeEnabled) {
      this.stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
    }
  }

  async createPaymentIntent(orderId: string, amount: number, idempotencyKey: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not enabled');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.create(
      {
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: { orderId },
      },
      { idempotencyKey },
    );

    await this.prisma.order.update({
      where: { id: orderId },
      data: { stripePaymentId: paymentIntent.id },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(orderId: string, paymentIntentId: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not enabled');
    }

    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Payment not succeeded');
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
      },
    });

    return { success: true };
  }

  async refund(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order || !order.stripePaymentId) {
      throw new BadRequestException('Order or payment not found');
    }

    if (this.stripe) {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(order.stripePaymentId);
      if (paymentIntent.status === 'succeeded') {
        await this.stripe.refunds.create({
          payment_intent: order.stripePaymentId,
        });
      }
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'REFUNDED',
        status: 'REFUNDED',
      },
    });

    return { success: true };
  }

  async handleWebhook(payload: any, signature: string) {
    if (!this.stripe) {
      throw new BadRequestException('Stripe is not enabled');
    }

    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    const event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        await this.prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            status: 'CONFIRMED',
          },
        });
      }
    }

    return { received: true };
  }
}

