import { MenuService } from './menu.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto/menu-item.dto';
import { CreateModifierDto, UpdateModifierDto } from './dto/modifier.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
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
    createCategory(createCategoryDto: CreateCategoryDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        image: string | null;
        displayOrder: number;
    }>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
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
    createMenuItem(createMenuItemDto: CreateMenuItemDto): Promise<{
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
    updateMenuItem(id: string, updateMenuItemDto: UpdateMenuItemDto): Promise<{
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
    createModifier(createModifierDto: CreateModifierDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        menuItemId: string;
    }>;
    updateModifier(id: string, updateModifierDto: UpdateModifierDto): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        price: import("@prisma/client/runtime/library").Decimal;
        menuItemId: string;
    }>;
}
