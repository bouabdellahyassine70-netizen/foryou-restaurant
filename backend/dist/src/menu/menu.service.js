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
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let MenuService = class MenuService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createCategory(data) {
        return this.prisma.category.create({ data });
    }
    async findAllCategories() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            include: {
                items: {
                    where: { isAvailable: true },
                    include: {
                        modifiers: {
                            where: { isActive: true },
                        },
                    },
                    orderBy: { displayOrder: 'asc' },
                },
            },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async findCategory(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: { items: { include: { modifiers: true } } },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async updateCategory(id, data) {
        return this.prisma.category.update({ where: { id }, data });
    }
    async deleteCategory(id) {
        return this.prisma.category.update({ where: { id }, data: { isActive: false } });
    }
    async createMenuItem(data) {
        return this.prisma.menuItem.create({ data });
    }
    async findAllMenuItems() {
        return this.prisma.menuItem.findMany({
            where: { isAvailable: true },
            include: {
                category: true,
                modifiers: { where: { isActive: true } },
            },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async findMenuItem(id) {
        const item = await this.prisma.menuItem.findUnique({
            where: { id },
            include: {
                category: true,
                modifiers: { where: { isActive: true } },
                availability: true,
            },
        });
        if (!item) {
            throw new common_1.NotFoundException('Menu item not found');
        }
        return item;
    }
    async updateMenuItem(id, data) {
        return this.prisma.menuItem.update({ where: { id }, data });
    }
    async deleteMenuItem(id) {
        return this.prisma.menuItem.update({ where: { id }, data: { isAvailable: false } });
    }
    async createModifier(data) {
        return this.prisma.modifier.create({ data });
    }
    async updateModifier(id, data) {
        return this.prisma.modifier.update({ where: { id }, data });
    }
    async deleteModifier(id) {
        return this.prisma.modifier.update({ where: { id }, data: { isActive: false } });
    }
    async setAvailability(menuItemId, schedules) {
        await this.prisma.availabilitySchedule.deleteMany({ where: { menuItemId } });
        return this.prisma.availabilitySchedule.createMany({ data: schedules });
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MenuService);
//# sourceMappingURL=menu.service.js.map