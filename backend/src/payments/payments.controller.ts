import { Controller, Post, Body, Param, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create Stripe payment intent' })
  async createPaymentIntent(
    @Body() body: { orderId: string; amount: number; idempotencyKey: string },
  ) {
    return this.paymentsService.createPaymentIntent(
      body.orderId,
      body.amount,
      body.idempotencyKey,
    );
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Stripe webhook handler' })
  async handleWebhook(@Body() body: any, @Headers('stripe-signature') signature: string) {
    return this.paymentsService.handleWebhook(body, signature);
  }
}

