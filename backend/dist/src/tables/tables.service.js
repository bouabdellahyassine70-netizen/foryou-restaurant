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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const uuid_1 = require("uuid");
let TablesService = class TablesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const qrCode = `FY-TABLE-${data.number}-${(0, uuid_1.v4)()}`;
        return this.prisma.table.create({
            data: { ...data, qrCode },
        });
    }
    async findAll() {
        return this.prisma.table.findMany({
            where: { isActive: true },
            orderBy: { number: 'asc' },
        });
    }
    async findOne(id) {
        const table = await this.prisma.table.findUnique({ where: { id } });
        if (!table) {
            throw new common_1.NotFoundException('Table not found');
        }
        return table;
    }
    async findByQrCode(qrCode) {
        const table = await this.prisma.table.findUnique({ where: { qrCode } });
        if (!table) {
            throw new common_1.NotFoundException('Table not found');
        }
        return table;
    }
    async update(id, data) {
        return this.prisma.table.update({ where: { id }, data });
    }
    async delete(id) {
        return this.prisma.table.update({ where: { id }, data: { isActive: false } });
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TablesService);
//# sourceMappingURL=tables.service.js.map