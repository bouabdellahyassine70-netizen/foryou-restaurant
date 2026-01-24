import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreatePromoCodeDto, UpdatePromoCodeDto } from './dto/promo-code.dto';

@Injectable()
export class PromoCodesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePromoCodeDto, createdById: string) {
    return this.prisma.promoCode.create({
      data: { ...data, createdById },
    });
  }

  async findAll() {
    return this.prisma.promoCode.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const code = await this.prisma.promoCode.findUnique({ where: { id } });
    if (!code) {
      throw new NotFoundException('Promo code not found');
    }
    return code;
  }

  async findByCode(code: string) {
    return this.prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
  }

  async validateAndApply(code: string, orderAmount: number) {
    const promoCode = await this.findByCode(code);
    if (!promoCode) {
      throw new NotFoundException('Promo code not found');
    }

    if (!promoCode.isActive) {
      throw new BadRequestException('Promo code is not active');
    }

    const now = new Date();
    if (now < promoCode.validFrom || now > promoCode.validUntil) {
      throw new BadRequestException('Promo code is not valid at this time');
    }

    if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
      throw new BadRequestException('Promo code has reached maximum uses');
    }

    if (promoCode.minOrderAmount && orderAmount < Number(promoCode.minOrderAmount)) {
      throw new BadRequestException(
        `Minimum order amount of ${promoCode.minOrderAmount} required`,
      );
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'PERCENTAGE') {
      discount = (orderAmount * Number(promoCode.discountValue)) / 100;
    } else {
      discount = Number(promoCode.discountValue);
    }

    // Increment usage
    await this.prisma.promoCode.update({
      where: { id: promoCode.id },
      data: { currentUses: { increment: 1 } },
    });

    return { ...promoCode, discountValue: discount };
  }

  async update(id: string, data: UpdatePromoCodeDto) {
    return this.prisma.promoCode.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.promoCode.update({ where: { id }, data: { isActive: false } });
  }
}

