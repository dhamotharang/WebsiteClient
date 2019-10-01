export class ProductUnit {
    id: string;
    unitId: string;
    isDefault: boolean;
    salePrice: number;

    constructor(isDefault?: boolean, unitId?: string, salePrice?: number) {
        this.isDefault = isDefault;
        this.unitId = unitId;
        this.salePrice = salePrice;
    }
}
