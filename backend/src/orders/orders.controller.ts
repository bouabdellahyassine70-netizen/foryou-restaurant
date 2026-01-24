import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { VoiceOrderDto } from './dto/voice-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole, OrderStatus } from '@prisma/client';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new order' })
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user?: any) {
    return this.ordersService.create(user?.id || null, createOrderDto);
  }

  @Get('analytics')
  @Public()
  @ApiOperation({ summary: 'Get order analytics (daily sales, popular items, rush hours)' })
  async getAnalytics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.ordersService.getAnalytics(startDate, endDate);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all orders (filtered by user role)' })
  findAll(
    @Query('status') status?: OrderStatus,
    @CurrentUser() user?: any,
  ) {
    // Customers see only their orders, staff see all
    const userId = user?.role === UserRole.CUSTOMER ? user.id : undefined;
    return this.ordersService.findAll(userId, status);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get order by ID' })
  findOne(@Param('id') id: string, @CurrentUser() user?: any) {
    return this.ordersService.findOne(id, user?.id);
  }

  @Patch(':id/status')
  @Public()
  @ApiOperation({ summary: 'Update order status (Staff only)' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
    @CurrentUser() user?: any,
  ) {
    return this.ordersService.updateStatus(id, updateDto, user?.id || null);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an order' })
  cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return this.ordersService.cancel(id, user.id);
  }

  @Post('voice')
  @Public()
  @ApiOperation({ summary: 'Create order from voice AI (SAWT IA)' })
  async createVoiceOrder(@Body() voiceOrderDto: VoiceOrderDto) {
    // Convert voice order to regular order format
    const orderData: CreateOrderDto = {
      items: voiceOrderDto.items,
      type: voiceOrderDto.type as any,
      notes: voiceOrderDto.notes,
      isVoiceOrder: true,
      voiceOrderId: voiceOrderDto.voiceOrderId,
      deliveryInstructions: voiceOrderDto.deliveryAddress,
    };
    
    // Create order with voice order flag
    const order = await this.ordersService.create(null, orderData);
    
    // Set status to PENDING for cashier confirmation
    await this.ordersService.updateStatus(order.id, { status: 'PENDING' as OrderStatus }, null);
    
    return order;
  }
}

