import * as _ from 'lodash';
import { ProductConversionUnit } from '../../../product/product/product-form/product-unit/model/product-conversion-unit.model';

export class GoodsDeliveryNoteDetail {
    id: string;
    code: string;
    goodsDeliveryNoteId?: string;
    productId: string;
    productName: string;
    warehouseId: string;
    warehouseName: string;
    unitId: string;
    unitName: string;
    price: number;
    deliveryDate?: Date;
    expiredDate?: Date;
    quantity: number;
    discountPrice?: number;
    discountByPercent: boolean;
    recommendedQuantity: number;
    lotId;
    totalAmounts: number;
    concurrencyStamp: string;
    goodsReceiptNoteDetailCode: string;
    inventoryQuantity: number;
    units: any;
    conversionInventory: number;
    conversionPrice: number;
    realInventoryQuantity: number;

    constructor(id?: string, code?: string, productId?: string, productName?: string, warehouseId?: string, warehouseName?: string, unitId?: string,
                unitName?: string, price?: number, quantity?: number, recommendedQuantity?: number, lotId?: string,
                inventoryQuantity?: number, goodsReceiptNoteDetailCode?: string, concurrencyStamp?: string, units?: any) {
        this.price = 0;
        this.discountPrice = 0;
        this.discountByPercent = false;
        this.recommendedQuantity = 0;

        this.id = id;
        this.code = code;
        this.productId = productId;
        this.productName = productName;
        this.warehouseId = warehouseId;
        this.warehouseName = warehouseName;
        this.unitId = unitId;
        this.unitName = unitName;
        this.price = price;
        this.quantity = quantity;
        this.recommendedQuantity = recommendedQuantity;
        this.lotId = lotId;
        this.inventoryQuantity = inventoryQuantity;
        this.goodsReceiptNoteDetailCode = goodsReceiptNoteDetailCode;
        this.conversionPrice = price;
        this.concurrencyStamp = concurrencyStamp;
        this.units = units;

        // Get current unit.
        const conversionUnit = _.find(units, (unit: ProductConversionUnit) => {
            return unit.unitId === this.unitId;
        });
        if (conversionUnit) {
            this.conversionInventory = inventoryQuantity / conversionUnit.conversionValue;
            this.conversionPrice = price * conversionUnit.conversionValue;
        }
        this.totalAmounts = this.quantity * this.conversionPrice;
    }
}
