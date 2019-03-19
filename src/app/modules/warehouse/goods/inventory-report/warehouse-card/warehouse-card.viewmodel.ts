export interface WarehouseCardItemViewModel {
    id: string;
    invoiceDate: string;
    date: string;
    quantity: number;
    isReceiving: boolean;
    receiptNo: string;
    note: string;
    inventory: number;
}

export interface WarehouseCardViewModel {
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

    warehouseCardItems: WarehouseCardItemViewModel[];
}
