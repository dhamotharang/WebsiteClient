export class InventoryDetail {
    inventoryId: string;
    productId: string;
    productName: string;
    lotId: string;
    unitId: string;
    unitName: string;
    inventoryQuantity: number;
    realQuantity: number;
    reason: string;
    difference: number;
    isEdit: boolean;
    price: number;
    amount: number;
    accountingAmount: number;
    differenceAmount: number;
    concurrencyStamp: string;

    constructor(productId?: string,
                lotId?: string,
                productName?: string,
                unitId?: string,
                unitName?: string,
                inventoryQuantity?: number,
                realQuantity?: number,
                reason?: string,
                difference?: number) {
        this.productId = productId;
        this.lotId = lotId;
        this.productName = productName;
        this.unitId = unitId;
        this.unitName = unitName;
        this.inventoryQuantity = inventoryQuantity ? inventoryQuantity : 0;
        this.realQuantity = realQuantity ? realQuantity : 0;
        this.reason = reason ? reason : '';
        this.difference = difference;
    }
}
