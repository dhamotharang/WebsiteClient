import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import {GoodsDeliveryNoteService} from '../goods-delivery-note.service';
import {GoodsDeliveryNoteDetail} from '../model/goods-delivery-note-details.model';
import {GoodsDeliveryNoteDetailViewModel} from '../viewmodel/goods-delivery-note.detail.viewmodel';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import * as _ from 'lodash';
import {HelperService} from '../../../../../shareds/services/helper.service';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';
import {AppService} from '../../../../../shareds/services/app.service';

@Component({
    selector: 'app-goods-note-delivery-print',
    templateUrl: './goods-delivery-note-print.component.html',
    providers: [HelperService]
})

export class GoodsDeliveryNotePrintComponent {
    @ViewChild('printArea') printArea: ElementRef;
    goodsDeliveryNoteDetail: GoodsDeliveryNoteDetailViewModel;
    totalQuantity;
    listGoodsDeliveryNoteDetail: GoodsDeliveryNoteDetail[];
    currentUser;
    imageUrl: string;
    day;
    month;
    year;

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private helperService: HelperService,
                private appService: AppService,
                private goodsDeliveryNoteService: GoodsDeliveryNoteService) {
        this.currentUser = appService.currentUser;
        this.imageUrl = this.appConfig.CORE_API_URL;
    }

    print(id: string) {
        this.goodsDeliveryNoteService.getDetail(id).subscribe((result: ActionResultViewModel<GoodsDeliveryNoteDetailViewModel>) => {
            const data = result.data;
            if (data) {
                this.goodsDeliveryNoteDetail = data;
                this.listGoodsDeliveryNoteDetail = this.goodsDeliveryNoteDetail.goodsDeliveryNoteDetails;
                this.totalQuantity = _.sumBy(this.listGoodsDeliveryNoteDetail, (item: GoodsDeliveryNoteDetail) => {
                    return item.quantity;
                });

                this.day = new Date(this.goodsDeliveryNoteDetail.deliveryDate).getDay();
                this.month = new Date(this.goodsDeliveryNoteDetail.deliveryDate).getMonth();
                this.year = new Date(this.goodsDeliveryNoteDetail.deliveryDate).getFullYear();
                setTimeout(() => {
                    this.executePrint();
                }, 100);
            }
        });
    }

    private executePrint() {
        const style = `
                     h4.receipt-title {
                            font-size: 25px;
                            text-align: center;
                            font-weight: bold;
                            text-transform: uppercase;
                            margin-top: 10px;
                      }
                     .amountsInWord {
                        width: 200px;
                     }
                     `;
        const content = this.printArea.nativeElement.innerHTML;
        this.helperService.openPrintWindow('Phiếu xuất kho', content, style);
    }
}
