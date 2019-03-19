import { Component, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { GoodsDeliveryNoteService } from '../goods-delivery-note.service';
import { GoodsDeliveryNoteDetailViewModel } from '../viewmodel/goods-delivery-note.detail.viewmodel';
import { GoodsDeliveryNoteDetail } from '../model/goods-delivery-note-details.model';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';
import { DeliveryType } from '../../../../../shareds/constants/deliveryType.const';
import * as _ from 'lodash';
import { GoodsDeliveryNoteType } from '../goods-delivery-note-type.const';

@Component({
    selector: 'app-goods-delivery-note-detail',
    styleUrls: ['../goods-delivery-note.scss'],
    templateUrl: '././goods-delivery-note-detail.component.html'
})

export class GoodsDeliveryNoteDetailComponent extends BaseFormComponent {
    @ViewChild('formGoodsDeliveryNote') formGoodsDeliveryNote: NhModalComponent;
    goodsDeliveryNoteDetail: GoodsDeliveryNoteDetailViewModel;
    listGoodsDeliveryNoteDetail: GoodsDeliveryNoteDetail[];
    deliveryType = DeliveryType;
    totalQuantity;
    totalAmount;
    goodsDeliveryNoteType = GoodsDeliveryNoteType;

    constructor(private goodsDeliveryNoteService: GoodsDeliveryNoteService) {
        super();
    }

    show(id: string) {
        this.isUpdate = false;
        this.listGoodsDeliveryNoteDetail = [];
        this.getDetail(id);
    }

    getDetail(id: string) {
        setTimeout(() => {
            this.formGoodsDeliveryNote.open();
        });
        this.goodsDeliveryNoteService.getDetail(id).subscribe((result: ActionResultViewModel<GoodsDeliveryNoteDetailViewModel>) => {
            const data = result.data;
            if (data) {
                this.goodsDeliveryNoteDetail = data;
                this.listGoodsDeliveryNoteDetail = this.goodsDeliveryNoteDetail.goodsDeliveryNoteDetails
                    .map((goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail) => {
                        return new GoodsDeliveryNoteDetail(goodsDeliveryNoteDetail.id, goodsDeliveryNoteDetail.code,
                            goodsDeliveryNoteDetail.productId, goodsDeliveryNoteDetail.productName, goodsDeliveryNoteDetail.warehouseId,
                            goodsDeliveryNoteDetail.warehouseName, goodsDeliveryNoteDetail.unitId, goodsDeliveryNoteDetail.unitName,
                            goodsDeliveryNoteDetail.price, goodsDeliveryNoteDetail.quantity, goodsDeliveryNoteDetail.recommendedQuantity,
                            goodsDeliveryNoteDetail.lotId, goodsDeliveryNoteDetail.inventoryQuantity,
                            goodsDeliveryNoteDetail.goodsReceiptNoteDetailCode, goodsDeliveryNoteDetail.concurrencyStamp,
                            goodsDeliveryNoteDetail.units);
                    });
                this.totalQuantity = _.sumBy(this.listGoodsDeliveryNoteDetail, (item: GoodsDeliveryNoteDetail) => {
                    return item.quantity;
                });
                this.totalAmount = _.sumBy(this.listGoodsDeliveryNoteDetail, (item: GoodsDeliveryNoteDetail) => {
                    return item.totalAmounts;
                });
            }
        });
    }
}
