import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GoodsReceiptNoteFormProductFormComponent } from './goods-receipt-note-form-product-form/goods-receipt-note-form-product-form.component';
import { GoodsReceiptNoteService } from '../../goods-receipt-note.service';
import { ActionResultViewModel } from '../../../../../../shareds/view-models/action-result.viewmodel';
import { GoodsReceiptNoteDetail } from '../../goods-receipt-note.model';
import * as _ from 'lodash';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
    selector: 'app-goods-receipt-note-form-product',
    templateUrl: './goods-receipt-note-form-product.component.html',
})
export class GoodsReceiptNoteFormProductComponent implements OnInit, AfterViewInit {
    private _listItems = [];
    @ViewChild(GoodsReceiptNoteFormProductFormComponent) goodsReceiptNoteFormProductFormComponent: GoodsReceiptNoteFormProductFormComponent;
    @ViewChild('confirmDelete') swalConfirmDelete: SwalComponent;
    @Input() receiptId: string;

    @Input()
    set listItems(items: GoodsReceiptNoteDetail[]) {
        this._listItems = items;
        this.totalAmounts = _.sumBy(this.listItems, (x) => x.totalAmounts);
    }

    get listItems() {
        return this._listItems;
    }

    @Input() readOnly = false;
    @Output() totalAmountUpdated = new EventEmitter();
    @Output() hasChange = new EventEmitter();

    totalAmounts = 0;

    selectedGoodsReceiptNoteItem: GoodsReceiptNoteDetail;

    constructor(private toastr: ToastrService,
                private goodsReceiptNoteService: GoodsReceiptNoteService) {

    }

    get taxes() {
        return _.sumBy(this.listItems, (x) => x.taxes);
    }

    get totalBeforeTaxes() {
        return _.sumBy(this.listItems, (x) => x.totalBeforeTaxes);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete();
        });
    }

    addDetail() {
        this.goodsReceiptNoteFormProductFormComponent.add();
    }

    edit(goodsReceiptNoteItem: GoodsReceiptNoteDetail) {
        this.goodsReceiptNoteFormProductFormComponent.edit(goodsReceiptNoteItem);
    }

    confirm(goodsReceiptNoteItem: GoodsReceiptNoteDetail) {
        this.selectedGoodsReceiptNoteItem = goodsReceiptNoteItem;
        this.swalConfirmDelete.show();
    }

    onSaveItemSuccess(goodsReceiptNoteItem: GoodsReceiptNoteDetail) {
        const itemInfo = _.find(this.listItems, (item: GoodsReceiptNoteDetail) => {
            return goodsReceiptNoteItem.id === item.id;
        });
        if (itemInfo) {
            itemInfo.productId = goodsReceiptNoteItem.productId;
            itemInfo.productName = goodsReceiptNoteItem.productName;
            itemInfo.lotId = goodsReceiptNoteItem.lotId;
            itemInfo.unitId = goodsReceiptNoteItem.unitId;
            itemInfo.unitName = goodsReceiptNoteItem.unitName;
            itemInfo.invoiceQuantity = goodsReceiptNoteItem.invoiceQuantity;
            itemInfo.quantity = goodsReceiptNoteItem.quantity;
            itemInfo.price = goodsReceiptNoteItem.price;
            itemInfo.totalBeforeTaxes = goodsReceiptNoteItem.totalBeforeTaxes;
            itemInfo.tax = goodsReceiptNoteItem.tax;
            itemInfo.taxes = goodsReceiptNoteItem.taxes;
            itemInfo.totalAmounts = goodsReceiptNoteItem.totalAmounts;
            itemInfo.concurrencyStamp = goodsReceiptNoteItem.concurrencyStamp;
            itemInfo.expiryDate = moment(goodsReceiptNoteItem.expiryDate, 'YYYY/MM/DD');
        } else {
            this.listItems = [...this.listItems, goodsReceiptNoteItem];
        }
        this.getTotalAmounts();
        this.hasChange.emit();
    }

    private delete() {
        if (this.receiptId) {
            this.goodsReceiptNoteService.deleteItem(this.receiptId, this.selectedGoodsReceiptNoteItem.id)
                .subscribe((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    _.remove(this.listItems, (item: GoodsReceiptNoteDetail) => {
                        return item.id === this.selectedGoodsReceiptNoteItem.id;
                    });
                    this.getTotalAmounts();
                });
        } else {
            _.remove(this.listItems, this.selectedGoodsReceiptNoteItem);
            this.getTotalAmounts();
        }
    }

    private getTotalAmounts() {
        this.totalAmounts = _.sumBy(this.listItems, 'totalAmounts');
        this.totalAmountUpdated.emit(this.totalAmounts);
    }

    reset() {
        this.goodsReceiptNoteFormProductFormComponent.resetModel();
    }
}
