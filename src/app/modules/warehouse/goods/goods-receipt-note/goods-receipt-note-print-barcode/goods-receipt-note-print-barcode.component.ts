import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HelperService } from '../../../../../shareds/services/helper.service';
import { GoodsReceiptNoteService } from '../goods-receipt-note.service';
import { GoodsReceiptNoteBarcodeViewModel } from './goods-receipt-note-barcode.viewmodel';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { ProductService } from '../../../product/product/service/product.service';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-goods-receipt-note-print-barcode',
    templateUrl: './goods-receipt-note-print-barcode.component.html',
    providers: [HelperService]
})
export class GoodsReceiptNotePrintBarcodeComponent implements OnInit {
    @ViewChild('printPreviewModal') printPreviewModal: NhModalComponent;
    @ViewChild('barcodeArea') barcodeArea: ElementRef;
    barcodes: GoodsReceiptNoteBarcodeViewModel[] = [];
    subscribers: any = {};
    rows = [];

    constructor(private helperService: HelperService,
                private toastr: ToastrService,
                private goodsReceiptNoteService: GoodsReceiptNoteService,
                private productService: ProductService) {
    }

    ngOnInit() {
    }

    onUnitDropdownShown(barcode: GoodsReceiptNoteBarcodeViewModel) {
        if (!barcode.units || barcode.units.length === 0) {
            this.getProductUnit(barcode);
        }
    }

    onUnitSelected(unit: any, barcode: GoodsReceiptNoteBarcodeViewModel) {
        console.log(unit);
        if (!unit || unit.id == null) {
            this.toastr.warning('Vui lòng chọn đơn vị.');
            return;
        }
        barcode.price = unit.price;
    }

    print(id: string) {
        this.printPreviewModal.open();
        this.goodsReceiptNoteService.getBarcode(id)
            .subscribe((barcodes: GoodsReceiptNoteBarcodeViewModel[]) => {
                this.barcodes = barcodes;
            });
    }

    printBarcode() {
        this.printPreviewModal.dismiss();
        let items = this.barcodes;
        this.barcodes.forEach((item: GoodsReceiptNoteBarcodeViewModel) => {
            for (let i = 0; i < item.quantity - 1; i++) {
                items = [...items, item];
            }
        });
        this.rows = _.chunk(items, 2);
        setTimeout(() => {
            const content = this.barcodeArea.nativeElement.innerHTML;
            this.helperService.openPrintWindow('Mã phiếu nhập chi tiết', content);
        });
    }

    private getProductUnit(barcode: GoodsReceiptNoteBarcodeViewModel) {
        this.subscribers.getUnits = this.productService.getUnit(barcode.productId, 1, 1000000)
            .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                console.log(result.items);
                barcode.units = result.items;
            });
    }
}
