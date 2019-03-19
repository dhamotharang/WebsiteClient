import { Component, OnInit, ViewChild } from '@angular/core';
import { GoodsReceiptNote, GoodsReceiptNoteDetail } from '../goods-receipt-note.model';
import { ActivatedRoute } from '@angular/router';
import { GoodsReceiptNoteService } from '../goods-receipt-note.service';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import * as _ from 'lodash';
import { HelperService } from '../../../../../shareds/services/helper.service';
import { AppService } from '../../../../../shareds/services/app.service';
import { GoodsReceiptNotePrintComponent } from '../goods-receipt-note-print/goods-receipt-note-print.component';
import { GoodsReceiptNotePrintBarcodeComponent } from '../goods-receipt-note-print-barcode/goods-receipt-note-print-barcode.component';
import { GoodsReceiptNoteType } from '../goods-receipt-note-type.const';

@Component({
    selector: 'app-goods-receipt-note-detail',
    templateUrl: './goods-receipt-note-detail.component.html',
    styleUrls: ['../goods-receipt-note.component.scss'],
    providers: [HelperService]
})
export class GoodsReceiptNoteDetailComponent implements OnInit {
    @ViewChild('goodsReceiptNoteDetailModal') goodsReceiptNoteDetailModal: NhModalComponent;
    @ViewChild(GoodsReceiptNotePrintComponent) goodsReceiptNotePrintComponent: GoodsReceiptNotePrintComponent;
    @ViewChild(GoodsReceiptNotePrintBarcodeComponent) goodsReceiptNotePrintBarcodeComponent: GoodsReceiptNotePrintBarcodeComponent;
    id: string;
    goodsReceiptNote: GoodsReceiptNote;
    totalAmounts: number;
    currentUser;
    goodsReceiptNoteType = GoodsReceiptNoteType;

    constructor(
        private appService: AppService,
        private route: ActivatedRoute,
        private helperService: HelperService,
        private goodsReceiptNoteService: GoodsReceiptNoteService) {
        this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
    }

    getDetail(id: string) {
        this.id = id;
        setTimeout(() => {
            this.goodsReceiptNoteDetailModal.open();
        });
        this.goodsReceiptNoteService.getDetail(id)
            .subscribe((result: GoodsReceiptNote) => {
                if (result) {
                    this.goodsReceiptNote = result;
                    this.totalAmounts = _.sumBy(result.goodsReceiptNoteDetails, (item: GoodsReceiptNoteDetail) => {
                        return (item.quantity * item.price) + item.taxes;
                    });
                }
            });
    }

    printBarcode() {
        this.goodsReceiptNotePrintBarcodeComponent.print(this.id);
    }

    printReceipt() {
        this.goodsReceiptNotePrintComponent.print(this.id);
    }
}
