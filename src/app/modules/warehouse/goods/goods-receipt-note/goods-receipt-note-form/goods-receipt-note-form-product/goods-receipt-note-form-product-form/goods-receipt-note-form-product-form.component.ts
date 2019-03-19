import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NhSuggestion } from '../../../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { BaseFormComponent } from '../../../../../../../base-form.component';
import { GoodsReceiptNoteDetail } from '../../../goods-receipt-note.model';
import { Validators } from '@angular/forms';
import { NumberValidator } from '../../../../../../../validators/number.validator';
import { ProductService } from '../../../../../product/product/service/product.service';
import { finalize } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../../../../../shareds/view-models/search-result.viewmodel';
import { GoodsReceiptNoteService } from '../../../goods-receipt-note.service';
import { ActionResultViewModel } from '../../../../../../../shareds/view-models/action-result.viewmodel';
import { UtilService } from '../../../../../../../shareds/services/util.service';
import { ProductSuggestionComponent } from '../../../../../product/product/product-suggestion/product-suggestion.component';
import { LotSuggestionComponent } from '../../../../lot-suggestion/lot-suggestion.component';
import { ToastrService } from 'ngx-toastr';
import { conditionalRequiredValidator } from '../../../../../../../validators/conditional-required.validator';
import * as _ from 'lodash';
import { NhModalComponent } from '../../../../../../../shareds/components/nh-modal/nh-modal.component';

@Component({
    selector: 'app-goods-receipt-note-item-form',
    templateUrl: './goods-receipt-note-form-product-form.component.html',
    providers: [NumberValidator]
})
export class GoodsReceiptNoteFormProductFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('productSuggestion') productSuggestion: ProductSuggestionComponent;
    @ViewChild('lotSuggestion') lotSuggestion: LotSuggestionComponent;
    @ViewChild('goodsReipcetNoteProductModal') goodsReipcetNoteProductModal: NhModalComponent;
    @Input() receiptId: string;

    totalAmounts = 0;
    goodsReceiptNoteItem = new GoodsReceiptNoteDetail();
    units = [];
    isGettingUnit = false;

    private _isManageByLot = false;
    set isManageByLot(value: boolean) {
        this._isManageByLot = value;
        this.buildForm();
    }

    get isManageByLot() {
        return this._isManageByLot;
    }

    constructor(private numberValidator: NumberValidator,
                private toastr: ToastrService,
                private utilService: UtilService,
                private productService: ProductService,
                private goodsReceiptNoteService: GoodsReceiptNoteService
    ) {
        super();
    }

    ngOnInit() {
        this.buildForm();
    }

    onLotKeyPressed(keyword: string) {
        this.model.patchValue({lotId: keyword});
    }

    onLotSelected(lot: NhSuggestion) {
        if (lot) {
            this.model.patchValue({lotId: lot.id ? lot.id : lot.name});
        } else {
            this.model.patchValue({lotId: null});
        }
    }

    onProductSelected(product: NhSuggestion) {
        console.log(product);
        this.isManageByLot = product.data.isManageByLot;
        this.model.patchValue({
            productId: product ? product.id : null,
            productName: product ? product.name : null
        });
        if (product) {
            // Get product units
            this.getUnitByProductId(product.id.toString(), true);
        }
    }

    onProductRemoved(event) {
        this.model.patchValue({productId: null});
    }

    onUnitSelected(unit: NhSuggestion) {
        this.model.patchValue({
            unitName: unit ? unit.name : null
        });
    }

    onModalHidden() {
        this.resetModel();
    }

    edit(goodsReceiptNoteItem: GoodsReceiptNoteDetail) {
        this.id = goodsReceiptNoteItem.id;
        this.isUpdate = true;
        this.productSuggestion.selectedItem = new NhSuggestion(goodsReceiptNoteItem.productId, goodsReceiptNoteItem.productName);
        this.lotSuggestion.selectedItem = goodsReceiptNoteItem.lotId
            ? new NhSuggestion(goodsReceiptNoteItem.lotId, goodsReceiptNoteItem.lotId)
            : null;
        this.getUnitByProductId(goodsReceiptNoteItem.productId);
        this.model.patchValue(goodsReceiptNoteItem);
        this.goodsReipcetNoteProductModal.open();
    }

    save() {
        const isValid = this.validateModel();
        if (isValid) {
            this.goodsReceiptNoteItem = this.model.value;
            this.goodsReceiptNoteItem.invoiceQuantity = this.goodsReceiptNoteItem.invoiceQuantity
                ? this.goodsReceiptNoteItem.invoiceQuantity
                : this.goodsReceiptNoteItem.quantity;
            this.goodsReceiptNoteItem.id = this.id ? this.id : this.utilService.generateRandomNumber().toString();
            if (this.receiptId) {
                if (this.isUpdate) {
                    this.goodsReceiptNoteService.updateItem(this.receiptId, this.id, this.goodsReceiptNoteItem)
                        .subscribe((result: ActionResultViewModel<{ id: string, concurrencyStamp: string } | string>) => {
                            this.toastr.success(result.message);
                            const data = result.data;
                            if (data) {
                                this.goodsReceiptNoteItem.concurrencyStamp = data as string;
                                this.emitValue();
                                this.goodsReipcetNoteProductModal.dismiss();
                            }
                        });
                } else {
                    this.goodsReceiptNoteService.insertItem(this.receiptId, this.goodsReceiptNoteItem)
                        .subscribe((result: ActionResultViewModel<{ id: string, concurrencyStamp: string }>) => {
                            this.toastr.success(result.message);
                            const data = result.data;
                            if (data) {
                                this.goodsReceiptNoteItem.id = data.id;
                                this.goodsReceiptNoteItem.concurrencyStamp = data.concurrencyStamp;
                                this.emitValue();
                                this.resetModel();
                                if (!this.isCreateAnother) {
                                    this.goodsReipcetNoteProductModal.dismiss();
                                }
                            }
                        });
                }
            } else {
                this.emitValue();
                if (!this.isCreateAnother) {
                    this.goodsReipcetNoteProductModal.dismiss();
                }
            }
        }
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['productId', 'lotId', 'unitId', 'price', 'invoiceQuantity', 'quantity', 'tax', 'note']);
        this.validationMessages = this.renderFormErrorMessage([
            {'productId': ['required']},
            {'lotId': ['required', 'maxLength']},
            {'unitId': ['required']},
            {'price': ['required', 'isValid']},
            {'invoiceQuantity': ['isValid']},
            {'quantity': ['required', 'isValid']},
            {'tax': ['isValid']},
            {'note': ['maxlength']},
        ]);
        this.model = this.formBuilder.group({
            productId: [this.goodsReceiptNoteItem.productId, [
                Validators.required
            ]],
            productName: [this.goodsReceiptNoteItem.productName],
            lotId: [this.goodsReceiptNoteItem.lotId, [
                conditionalRequiredValidator(this.isManageByLot)
            ]],
            unitId: [this.goodsReceiptNoteItem.unitId, [
                Validators.required
            ]],
            unitName: [this.goodsReceiptNoteItem.unitName],
            price: [this.goodsReceiptNoteItem.price, [
                Validators.required,
                this.numberValidator.isValid
            ]],
            invoiceQuantity: [this.goodsReceiptNoteItem.invoiceQuantity, [
                this.numberValidator.isValid
            ]],
            quantity: [this.goodsReceiptNoteItem.quantity, [
                Validators.required,
                this.numberValidator.isValid
            ]],
            tax: [this.goodsReceiptNoteItem.tax, [
                this.numberValidator.isValid
            ]],
            totalBeforeTaxes: [this.goodsReceiptNoteItem.totalBeforeTaxes],
            taxes: [this.goodsReceiptNoteItem.taxes],
            totalAmounts: [this.goodsReceiptNoteItem.totalAmounts],
            manufactureDate: [this.goodsReceiptNoteItem.manufactureDate],
            expiryDate: [this.goodsReceiptNoteItem.expiryDate],
            note: [this.goodsReceiptNoteItem.note, [
                Validators.maxLength(500)
            ]],
            concurrencyStamp: [this.goodsReceiptNoteItem.concurrencyStamp]
        });
        this.model.valueChanges.subscribe(() => this.validateModel(false));
        this.model.get('price').valueChanges.subscribe((value) => {
            const {quantity, tax} = this.model.value;
            this.calculateValues(value, quantity, tax);
        });
        this.model.get('quantity').valueChanges.subscribe((value) => {
            const {price, tax} = this.model.value;
            this.calculateValues(price, value, tax);
        });
        this.model.get('tax').valueChanges.subscribe((value) => {
            const {price, quantity} = this.model.value;
            this.calculateValues(price, quantity, value);
        });
    }

    resetModel() {
        this.id = null;
        this.goodsReceiptNoteItem = new GoodsReceiptNoteDetail();
        this.model.reset();
        this.productSuggestion.clear();
        this.lotSuggestion.clear();
        this.totalAmounts = null;
    }

    private emitValue() {
        this.utilService.focusElement('productId');
        this.saveSuccessful.emit(_.cloneDeep(this.goodsReceiptNoteItem));
        this.resetModel();
    }

    private calculateValues(price: number, quantity: number, tax?: number) {
        const totalBeforeTaxes = price * quantity;
        const taxes = tax ? totalBeforeTaxes * tax / 100 : 0;
        const totalAmounts = totalBeforeTaxes + taxes;
        this.model.patchValue({
            totalBeforeTaxes: totalBeforeTaxes,
            taxes: taxes,
            totalAmounts: totalAmounts
        });
    }

    private getUnitByProductId(id: string, isSelectDefault = false) {
        this.isGettingUnit = true;
        this.subscribers.getUnits = this.productService.getUnit(id, 1, 10)
            .pipe(finalize(() => this.isGettingUnit = false))
            .subscribe((result: SearchResultViewModel<any>) => {
                this.units = result.items;
                if (isSelectDefault) {
                    const defaultUnit = _.find(this.units, (unit: any) => {
                        return unit.isDefault;
                    });
                    if (defaultUnit) {
                        this.model.patchValue({
                            unitId: defaultUnit.id,
                            unitName: defaultUnit.name
                        });
                    }
                }
            });
    }

    add() {
        this.isUpdate = false;
        this.goodsReipcetNoteProductModal.open();
    }
}
