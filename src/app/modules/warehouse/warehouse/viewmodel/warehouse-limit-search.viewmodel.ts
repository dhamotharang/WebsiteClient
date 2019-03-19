export class WarehouseLimitSearchViewModel {
    warehouseId: string;
    productId: string;
    productName: string;
    unitId: string;
    unitName: string;
    quantity: number;
    isEdit: boolean;
    isNew: boolean;
    createTime: Date;

    constructor() {
        this.isNew = true;
        this.productId = '-1';
    }
}
