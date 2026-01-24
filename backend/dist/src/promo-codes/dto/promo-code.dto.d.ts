export declare class CreatePromoCodeDto {
    code: string;
    description?: string;
    discountType: string;
    discountValue: number;
    minOrderAmount?: number;
    maxUses?: number;
    validFrom: string;
    validUntil: string;
}
export declare class UpdatePromoCodeDto {
    description?: string;
    discountValue?: number;
    minOrderAmount?: number;
    maxUses?: number;
    validFrom?: string;
    validUntil?: string;
    isActive?: boolean;
}
