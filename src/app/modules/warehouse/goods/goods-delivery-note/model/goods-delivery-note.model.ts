import { DeliveryType } from '../../../../../shareds/constants/deliveryType.const';
import { GoodsDeliveryNoteDetail } from './goods-delivery-note-details.model';
import * as moment from 'moment';

export class GoodsDeliveryNote {
    warehouseId: string;
    warehouseName: string;
    reason: string;
    type: number;
    receiverId: string;
    receiverFullName: string;
    receiverPhoneNumber: string;
    receiverAvatar: string;
    note: string;
    receptionWarehouseId: string;
    agencyId: string;
    totalAmounts: number;
    totalQuantity: number;
    inventoryId: string;
    deliveryNo: string;
    deliveryDate: any;
    day: number;
    month: number;
    year: number;
    concurrencyStamp: string;
    officeId: string;
    officeName: string;
    supplierName: string;
    goodsDeliveryNoteDetails: GoodsDeliveryNoteDetail[];

    constructor(warehouseId?: string, reason?: string, type?: number, receiverId?: string, agencyId?: string, totalAmount?: number) {
        const now = moment();
        this.day = now.date();
        this.month = now.month() + 1;
        this.year = now.year();
        this.deliveryDate = now.format('YYYY/MM/DD HH:mm:ss');
        this.type = DeliveryType.retail;
        this.goodsDeliveryNoteDetails = [];
        this.totalAmounts = 0;
        this.totalQuantity = 0;
        this.reason = '';
        this.warehouseId = null;
        this.receptionWarehouseId = null;
        this.receiverId = null;
        this.receiverFullName = null;
        this.receiverPhoneNumber = null;
        this.officeId = null;
        // this.deliveryNo = moment().format('YYMMDDHHmmssSS');
    }
}
