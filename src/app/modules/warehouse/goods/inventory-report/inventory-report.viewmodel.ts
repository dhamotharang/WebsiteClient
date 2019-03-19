export interface InventoryReportViewModel {
    id: string;
    productId: string;
    productName: string;
    unitName: string;
    openingStockValue: number;
    openingStockQuantity: number;
    receivingValue: number;
    receivingQuantity: number;
    deliveringValue: number;
    deliveringQuantity: number;
    closingStockValue: number;
    closingStockQuantity: number;
}
