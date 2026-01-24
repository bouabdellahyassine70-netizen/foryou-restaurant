export declare class CreateMenuItemDto {
    name: string;
    description?: string;
    price: number;
    image?: string;
    categoryId: string;
    displayOrder?: number;
}
export declare class UpdateMenuItemDto {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    categoryId?: string;
    displayOrder?: number;
    isAvailable?: boolean;
}
