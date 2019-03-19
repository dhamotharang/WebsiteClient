import { GoodsReceiptNoteDetail } from '../goods-receipt-note.model';

export interface GoodsReceiptNoteDetailViewModel {
    receiptNo: string;
    invoiceNo: string;
    supplierId: string;
    supplierName: string;
    deliverId: string;
    deliverFullName: string;
    deliverPhoneNumber: string;
    entryDate: string;
    day: number;
    month: number;
    year: number;
    invoiceDate: string;
    warehouseId: string;
    warehouseName: string;
    follow: string;
    followId: string;

    goodsReceptNoteItems: GoodsReceiptNoteDetail[];
}
