export class WarehouseLimit {
    warehouseId: string;
    productId: string;
    productName: string;
    unitId: string;
    quantity: number;

    constructor(warehouseId?: string, productId?: string, productName?: string, unitId?: string, quantity?: number) {
        this.warehouseId = warehouseId;
        this.productId = productId;
        this.productName = productName ? productName : '';
        this.unitId = unitId;
        this.quantity = quantity ? quantity : 1;
    }
}
