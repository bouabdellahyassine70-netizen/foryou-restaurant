import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { CreateModifierDto, UpdateModifierDto } from './dto/modifier.dto';
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(data: CreateCategoryDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
    }>;
    findAllCategories(): Promise<({
        items: ({
            modifiers: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
                menuItemId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
            price: import("@prisma/client/runtime/library").Decimal;
            categoryId: string;
            isAvailable: boolean;
        })[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
    })[]>;
    findCategory(id: string): Promise<{
        items: ({
            modifiers: {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                price: import("@prisma/client/runtime/library").Decimal;
                menuItemId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
            price: import("@prisma/client/runtime/library").Decimal;
            categoryId: string;
            isAvailable: boolean;
        })[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
    }>;
    updateCategory(id: string, data: UpdateCategoryDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
    }>;
    deleteCategory(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
    }>;
    createMenuItem(data: CreateMenuItemDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        isAvailable: boolean;
    }>;
    findAllMenuItems(): Promise<({
        category: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
        };
        modifiers: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            menuItemId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        isAvailable: boolean;
    })[]>;
    findMenuItem(id: string): Promise<{
        category: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            image: string | null;
            displayOrder: number;
        };
        modifiers: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            price: import("@prisma/client/runtime/library").Decimal;
            menuItemId: string;
        }[];
        availability: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            menuItemId: string;
            dayOfWeek: number;
            startTime: string | null;
            endTime: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        isAvailable: boolean;
    }>;
    updateMenuItem(id: string, data: UpdateMenuItemDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        isAvailable: boolean;
    }>;
    deleteMenuItem(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
        price: import("@prisma/client/runtime/library").Decimal;
        categoryId: string;
        isAvailable: boolean;
    }>;
    createModifier(data: CreateModifierDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        menuItemId: string;
    }>;
    updateModifier(id: string, data: UpdateModifierDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        menuItemId: string;
    }>;
    deleteModifier(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        menuItemId: string;
    }>;
    setAvailability(menuItemId: string, schedules: any[]): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
