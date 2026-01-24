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
exports.PromoCodesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let PromoCodesService = class PromoCodesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, createdById) {
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
    async findOne(id) {
        const code = await this.prisma.promoCode.findUnique({ where: { id } });
        if (!code) {
            throw new common_1.NotFoundException('Promo code not found');
        }
        return code;
    }
    async findByCode(code) {
        return this.prisma.promoCode.findUnique({ where: { code: code.toUpperCase() } });
    }
    async validateAndApply(code, orderAmount) {
        const promoCode = await this.findByCode(code);
        if (!promoCode) {
            throw new common_1.NotFoundException('Promo code not found');
        }
        if (!promoCode.isActive) {
            throw new common_1.BadRequestException('Promo code is not active');
        }
        const now = new Date();
        if (now < promoCode.validFrom || now > promoCode.validUntil) {
            throw new common_1.BadRequestException('Promo code is not valid at this time');
        }
        if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
            throw new common_1.BadRequestException('Promo code has reached maximum uses');
        }
        if (promoCode.minOrderAmount && orderAmount < Number(promoCode.minOrderAmount)) {
            throw new common_1.BadRequestException(`Minimum order amount of ${promoCode.minOrderAmount} required`);
        }
        let discount = 0;
        if (promoCode.discountType === 'PERCENTAGE') {
            discount = (orderAmount * Number(promoCode.discountValue)) / 100;
        }
        else {
            discount = Number(promoCode.discountValue);
        }
        await this.prisma.promoCode.update({
            where: { id: promoCode.id },
            data: { currentUses: { increment: 1 } },
        });
        return { ...promoCode, discountValue: discount };
    }
    async update(id, data) {
        return this.prisma.promoCode.update({ where: { id }, data });
    }
    async delete(id) {
        return this.prisma.promoCode.update({ where: { id }, data: { isActive: false } });
    }
};
exports.PromoCodesService = PromoCodesService;
exports.PromoCodesService = PromoCodesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromoCodesService);
//# sourceMappingURL=promo-codes.service.js.map