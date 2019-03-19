export interface WarehouseCardDetailItemViewModel {
    id: string;
    invoiceDate: string;
    date: string;
    quantity: number;
    isReceiving: boolean;
    receiptNo: string;
    note: string;
    inventory: number;
    inventoryValue: number;
    price: number;
    value: number;
    lotId: string;
}

export interface WarehouseCardDetailViewModel {
    id: string;
    productId: string;
    productName: string;
    warehouseId: string;
    warehouseName: string;
    unitId: string;
    unitName: string;
    warehouseAddress: string;
    totalItems: number;
    openingStockQuantity: number;
    openingStockValue: number;

    warehouseCardItems: WarehouseCardDetailItemViewModel[];
}
