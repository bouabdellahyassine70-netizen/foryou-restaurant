export declare class CreateCategoryDto {
    name: string;
    description?: string;
    image?: string;
    displayOrder?: number;
}
export declare class UpdateCategoryDto {
    name?: string;
    description?: string;
    image?: string;
    displayOrder?: number;
    isActive?: boolean;
}
