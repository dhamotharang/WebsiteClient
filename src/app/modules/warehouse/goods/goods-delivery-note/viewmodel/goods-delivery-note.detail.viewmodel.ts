import { GoodsDeliveryNoteDetail } from '../model/goods-delivery-note-details.model';

export class GoodsDeliveryNoteDetailViewModel {
    warehouseId: string;
    warehouseName: string;
    reason: string;
    type: number;
    receiverId: string;
    receiverFullName: string;
    receiverPhoneNumber: string;
    note: string;
    receptionWarehouseId: string;
    receptionWarehouseName: string;
    agencyId: string;
    agencyName: string;
    officeId: string;
    officeName: string;
    totalAmounts: number;
    inventoryId: string;
    deliveryNo: string;
    deliveryDate: string;
    concurrencyStamp: string;
    supplierName: string;
    goodsDeliveryNoteDetails: GoodsDeliveryNoteDetail[];
}
