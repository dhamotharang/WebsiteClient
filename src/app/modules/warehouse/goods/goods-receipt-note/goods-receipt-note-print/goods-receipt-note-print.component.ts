import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { HelperService } from '../../../../../shareds/services/helper.service';
import { GoodsReceiptNote, GoodsReceiptNoteDetail } from '../goods-receipt-note.model';
import { AppService } from '../../../../../shareds/services/app.service';
import { GoodsReceiptNoteService } from '../goods-receipt-note.service';
import * as _ from 'lodash';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';

@Component({
    selector: 'app-goods-receipt-note-print',
    templateUrl: './goods-receipt-note-print.component.html',
    providers: [HelperService]
})
export class GoodsReceiptNotePrintComponent implements OnInit {
    @ViewChild('printArea') printArea: ElementRef;
    goodsReceiptNote: GoodsReceiptNote;
    totalAmounts: number;
    currentUser;
    imageUrl: string;
    totalBeforeTaxes: number;
    taxes: number;

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private helperService: HelperService,
                private appService: AppService,
                private goodsReceiptNoteService: GoodsReceiptNoteService) {
        this.currentUser = appService.currentUser;
        this.imageUrl = this.appConfig.CORE_API_URL;
    }

    ngOnInit() {
    }

    print(id: string) {
        this.goodsReceiptNoteService.getDetail(id)
            .subscribe((result: GoodsReceiptNote) => {
                if (result) {
                    this.goodsReceiptNote = result;
                    this.totalAmounts = _.sumBy(result.goodsReceiptNoteDetails, (item: GoodsReceiptNoteDetail) => {
                        return (item.quantity * item.price) + item.taxes;
                    });
                    setTimeout(() => {
                        this.executePrint();
                    });
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
        this.helperService.openPrintWindow('Phiếu nhập kho', content, style);
    }
}
