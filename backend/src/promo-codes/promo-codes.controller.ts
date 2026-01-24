import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDto, UpdatePromoCodeDto } from './dto/promo-code.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('promo-codes')
@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all active promo codes (Public)' })
  findAll() {
    return this.promoCodesService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create promo code (Admin/Manager)' })
  create(@Body() createDto: CreatePromoCodeDto, @CurrentUser() user: any) {
    return this.promoCodesService.create(createDto, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update promo code (Admin/Manager)' })
  update(@Param('id') id: string, @Body() updateDto: UpdatePromoCodeDto) {
    return this.promoCodesService.update(id, updateDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete promo code (Admin/Manager)' })
  delete(@Param('id') id: string) {
    return this.promoCodesService.delete(id);
  }
}

