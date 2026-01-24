import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { CreateModifierDto, UpdateModifierDto } from './dto/modifier.dto';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  // Categories
  async createCategory(data: CreateCategoryDto) {
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

  async findCategory(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { items: { include: { modifiers: true } } },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async deleteCategory(id: string) {
    return this.prisma.category.update({ where: { id }, data: { isActive: false } });
  }

  // Menu Items
  async createMenuItem(data: CreateMenuItemDto) {
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

  async findMenuItem(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: { id },
      include: {
        category: true,
        modifiers: { where: { isActive: true } },
        availability: true,
      },
    });
    if (!item) {
      throw new NotFoundException('Menu item not found');
    }
    return item;
  }

  async updateMenuItem(id: string, data: UpdateMenuItemDto) {
    return this.prisma.menuItem.update({ where: { id }, data });
  }

  async deleteMenuItem(id: string) {
    return this.prisma.menuItem.update({ where: { id }, data: { isAvailable: false } });
  }

  // Modifiers
  async createModifier(data: CreateModifierDto) {
    return this.prisma.modifier.create({ data });
  }

  async updateModifier(id: string, data: UpdateModifierDto) {
    return this.prisma.modifier.update({ where: { id }, data });
  }

  async deleteModifier(id: string) {
    return this.prisma.modifier.update({ where: { id }, data: { isActive: false } });
  }

  // Availability
  async setAvailability(menuItemId: string, schedules: any[]) {
    // Delete existing schedules
    await this.prisma.availabilitySchedule.deleteMany({ where: { menuItemId } });
    // Create new schedules
    return this.prisma.availabilitySchedule.createMany({ data: schedules });
  }
}

