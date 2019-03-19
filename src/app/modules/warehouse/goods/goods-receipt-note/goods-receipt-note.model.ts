import * as moment from 'moment';

export class GoodsReceiptNote {
    receiptNo: string;
    supplierId: string;
    supplierName: string;
    deliverId: string;
    deliverFullName: string;
    deliverPhoneNumber: string;
    warehouseId: string;
    invoiceNo: string;
    invoiceDate: string;
    entryDate: any;
    follow: string;
    followId: string;
    day: number;
    month: number;
    year: number;
    warehouseName: string;
    totalBeforeTaxes: number;
    taxes: number;
    totalAmounts: number;
    note: string;
    warehouseManager: string;
    type: number;

    goodsReceiptNoteDetails: GoodsReceiptNoteDetail[];

    constructor() {
        const now = moment();
        this.day = now.date();
        this.month = now.month() + 1;
        this.year = now.year();
        this.entryDate = now.format('YYYY/MM/DD HH:mm:ss');
        this.invoiceDate = now.format('YYYY/MM/DD HH:mm:ss');
    }
}

export class GoodsReceiptNoteDetail {
    id: string;
    productId: string;
    productName: string;
    lotId: string;
    invoiceQuantity: number;
    quantity: number;
    price: number;
    totalBeforeTaxes: number;
    unitId: string;
    unitName: string;
    concurrencyStamp: string;
    totalAmounts: number;
    tax: number;
    taxes: number;
    manufactureDate: string;
    expiryDate?: string;
    note: string;
}
