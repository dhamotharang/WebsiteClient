import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { GoodsReceiptNoteService } from '../goods-receipt-note.service';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { GoodsReceiptNote, GoodsReceiptNoteDetail } from '../goods-receipt-note.model';
import { UtilService } from '../../../../../shareds/services/util.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import * as moment from 'moment';
import { GoodsReceiptNoteFormProductComponent } from './goods-receipt-note-form-product/goods-receipt-note-form-product.component';
import { SupplierSuggestionComponent } from '../../../product/supplier/supplier-suggestion/supplier-suggestion.component';
import { DeliverSuggestionComponent } from '../../deliver-suggestion/deliver-suggestion.component';
import { FollowSuggestionComponent } from '../follow-suggestion/follow-suggestion.component';
import { WarehouseSuggestionComponent } from '../../../warehouse/warehouse-suggestion/warehouse-suggestion.component';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { conditionalRequiredValidator } from '../../../../../validators/conditional-required.validator';
import { NumberValidator } from '../../../../../validators/number.validator';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../../../product/product/service/product.service';

@Component({
    selector: 'app-goods-receipt-note-form',
    templateUrl: './goods-receipt-note-form.component.html',
    styleUrls: ['../goods-receipt-note.component.scss'],
    providers: [NumberValidator]
})
export class GoodsReceiptNoteFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('goodsReceiptNoteFormModal') goodsReceiptNoteFormModal: NhModalComponent;
    // @ViewChild(GoodsReceiptNoteFormProductComponent) goodsReceiptNoteFormProductComponent: GoodsReceiptNoteFormProductComponent;
    @ViewChild(SupplierSuggestionComponent) supplierSuggestionComponent: SupplierSuggestionComponent;
    @ViewChild(DeliverSuggestionComponent) deliverSuggestionComponent: DeliverSuggestionComponent;
    @ViewChild(FollowSuggestionComponent) followSuggestionComponent: FollowSuggestionComponent;
    @ViewChild(WarehouseSuggestionComponent) warehouseSuggestionComponent: WarehouseSuggestionComponent;
    @ViewChild(GoodsReceiptNoteFormProductComponent) goodsReceiptNoteFormProductComponent: GoodsReceiptNoteFormProductComponent;
    goodsReceiptNote = new GoodsReceiptNote();
    follows = [];
    totalAmounts: number;
    isPrint = false;
    detailFormErrors: any = {};
    detailValidationMessages: any = {};
    totalBeforeTaxes: number;
    taxes: number;
    goodsReceiptNoteDetails: GoodsReceiptNoteDetail[] = [];

    constructor(
        private productService: ProductService,
        private numberValidator: NumberValidator,
        private toastr: ToastrService,
        private utilService: UtilService,
        private goodsReceiptNoteService: GoodsReceiptNoteService) {
        super();
    }

    // get goodsReceiptNoteDetails(): FormArray {
    //     return this.model.get('goodsReceiptNoteDetails') as FormArray;
    // }

    private _isManageByLot = false;
    set isManageByLot(value: boolean) {
        this._isManageByLot = value;
    }

    get isManageByLot() {
        return this._isManageByLot;
    }

    ngOnInit() {
        this.buildForm();
        // this.addDetail();
    }

    onModalHidden() {
        if (this.isModified) {
            this.saveSuccessful.emit({
                isPrint: this.isPrint,
                id: this.id
            });
        }
        this.resetModel();
    }

    onSupplierKeyPressed(keyword: string) {
        this.model.patchValue({supplierName: keyword});
    }

    onSupplierSelected(supplier: any) {
        this.model.patchValue({supplierId: supplier ? supplier.id : null});
    }

    onDeliverKeyPressed(keyword: string) {
        this.model.patchValue({deliverFullName: keyword});
    }

    onDeliverSelected(deliver: any) {
        this.model.patchValue({
            deliverId: deliver ? deliver.id : null,
            deliverFullName: deliver ? deliver.name : null,
            deliverPhoneNumber: deliver ? deliver.data.phoneNumber : null
        });
    }

    onFollowSelected(follow: NhSuggestion) {
        this.model.patchValue({follow: follow ? follow.name : null, followId: follow ? follow.id : null});
    }

    onFollowKeyPress(keyword: string) {
        this.model.patchValue({follow: keyword});
    }

    onWarehouseSelected(warehouse: any) {
        this.model.patchValue({warehouseId: warehouse ? warehouse.id : null});
    }

    onProductSelected(product: any, goodsReceiptNoteDetailFormControl: FormControl) {
        this.isManageByLot = product.isManageByLot;
        goodsReceiptNoteDetailFormControl.patchValue({
            productId: product ? product.id : null,
            productName: product ? product.name : null
        });
        if (!goodsReceiptNoteDetailFormControl.value.units || goodsReceiptNoteDetailFormControl.value.units.length === 0) {
            // Get product units
            this.getUnitByProductId(product.id.toString(), goodsReceiptNoteDetailFormControl);
        }
    }

    onProductRemoved(event, goodsReceiptNoteDetailFormControl: FormControl) {
        // goodsReceiptNoteDetailFormControl.patchValue({productId: null});
    }

    onLotKeyPressed(keyword: string, goodsReceiptNoteDetailFormControl: FormControl) {
        goodsReceiptNoteDetailFormControl.patchValue({lotId: keyword});
    }

    onLotSelected(lot: NhSuggestion, goodsReceiptNoteDetailFormControl: FormControl) {
        if (lot) {
            goodsReceiptNoteDetailFormControl.patchValue({lotId: lot.id ? lot.id : lot.name});
        } else {
            goodsReceiptNoteDetailFormControl.patchValue({lotId: null});
        }
    }

    onLotRemoved() {

    }

    onUnitShown(goodsReceiptNoteDetailModel: FormControl) {
        const units = goodsReceiptNoteDetailModel.value.units;
        if (!units || units.length === 0) {
            this.getUnitByProductId(goodsReceiptNoteDetailModel.value.productId, goodsReceiptNoteDetailModel);
        }
    }

    onUnitSelected(unit: NhSuggestion) {
        this.model.patchValue({
            unitName: unit ? unit.name : null
        });
    }

    add() {
        this.isUpdate = false;
        this.goodsReceiptNoteFormModal.open();
    }

    // addDetail(goodsReceiptNoteDetail?: GoodsReceiptNoteDetail) {
    //     this.goodsReceiptNoteDetails.push(this.buildDetailForm(this.goodsReceiptNoteDetails.length, goodsReceiptNoteDetail));
    // }

    edit(id: string) {
        this.isUpdate = true;
        this.id = id;
        this.goodsReceiptNoteFormModal.open();
        this.goodsReceiptNoteService.getDetail(this.id)
            .subscribe((result: GoodsReceiptNote) => {
                if (result) {
                    result.entryDate = moment(result.entryDate).format('YYYY/MM/DD HH:mm:ss');
                    result.invoiceDate = moment(result.invoiceDate).format('YYYY/MM/DD HH:mm:ss');
                    this.model.patchValue(result);
                    this.supplierSuggestionComponent.selectedItem = new NhSuggestion(result.supplierId, result.supplierName);
                    this.warehouseSuggestionComponent.selectedItem = new NhSuggestion(result.warehouseId, result.warehouseName);
                    this.followSuggestionComponent.selectedItem = new NhSuggestion(result.followId, result.follow);
                    this.deliverSuggestionComponent.selectedItem = new NhSuggestion(result.deliverId, result.deliverFullName);
                    // this.clearFormArray(this.goodsReceiptNoteDetails);
                    this.goodsReceiptNoteDetails = result.goodsReceiptNoteDetails;
                    // result.goodsReceiptNoteDetails.forEach((goodsReceiptNoteDetail: GoodsReceiptNoteDetail) => {
                    //     this.addDetail(goodsReceiptNoteDetail);
                    // });
                    this.getStats();
                }
            });
    }

    save(isPrint: boolean = false) {
        this.isPrint = isPrint;
        const isValid = this.validateModel();
        this.goodsReceiptNote = this.model.value;
        if (isValid) {
            this.goodsReceiptNote.goodsReceiptNoteDetails = this.goodsReceiptNoteFormProductComponent.listItems;
            if (this.id) {
                this.goodsReceiptNoteService.update(this.id, this.goodsReceiptNote)
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        this.goodsReceiptNoteFormModal.dismiss();
                    });
            } else {
                this.goodsReceiptNoteService.insert(this.goodsReceiptNote)
                    .subscribe((result: ActionResultViewModel) => {
                        this.toastr.success(result.message);
                        this.isModified = true;
                        if (this.isPrint) {
                            this.id = result.data;
                            this.goodsReceiptNoteFormModal.dismiss();
                        } else {
                            if (this.isCreateAnother) {
                                this.resetModel();
                            } else {
                                this.goodsReceiptNoteFormModal.dismiss();
                            }
                        }

                    });
            }
        }

    }

    private buildForm() {
        this.formErrors = this.renderFormError(['receiptNo', 'supplierId', 'deliverFullName', 'deliverPhoneNumber', 'warehouseId',
            'invoiceNo', 'invoiceDate', 'day', 'month', 'year', 'follow']);
        this.validationMessages = this.renderFormErrorMessage([
            {'receiptNo': ['required', 'maxlength']},
            {'supplierId': ['required']},
            {'deliverFullName': ['required', 'maxlength']},
            {'deliverPhoneNumber': ['required', 'maxlength']},
            {'warehouseId': ['required']},
            {'invoiceNo': ['required', 'maxlength']},
            {'invoiceDate': ['required']},
            {'day': ['required']},
            {'month': ['required']},
            {'year': ['required']},
            {'follow': ['required', 'maxlength']},
        ]);
        this.model = this.formBuilder.group({
            receiptNo: [this.goodsReceiptNote.receiptNo],
            supplierId: [this.goodsReceiptNote.supplierId, [
                Validators.required
            ]],
            supplierName: [this.goodsReceiptNote.supplierName],
            deliverId: [this.goodsReceiptNote.deliverId],
            deliverFullName: [this.goodsReceiptNote.deliverFullName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            deliverPhoneNumber: [this.goodsReceiptNote.deliverPhoneNumber, [
                Validators.required,
                Validators.maxLength(20)
            ]],
            warehouseId: [this.goodsReceiptNote.warehouseId, [
                Validators.required
            ]],
            invoiceNo: [this.goodsReceiptNote.invoiceNo, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            invoiceDate: [this.goodsReceiptNote.invoiceDate, [
                Validators.required
            ]],
            entryDate: [this.goodsReceiptNote.entryDate],
            followId: [this.goodsReceiptNote.followId],
            follow: [this.goodsReceiptNote.follow, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            day: [this.goodsReceiptNote.day, [
                Validators.required
            ]],
            month: [this.goodsReceiptNote.month, [
                Validators.required
            ]],
            year: [this.goodsReceiptNote.year, [
                Validators.required
            ]],
            note: [this.goodsReceiptNote.note, [
                Validators.maxLength(500)
            ]],
            goodsReceiptNoteDetails: this.formBuilder.array([])
        });
        this.model.valueChanges.subscribe(() => this.validateModel(false));
    }

    buildDetailForm(index: number, goodsReceiptNoteDetail?: GoodsReceiptNoteDetail) {
        this.detailFormErrors[index] = this.renderFormError(['productId', 'lotId', 'unitId', 'invoiceQuantity', 'quantity',
            'price']);
        this.detailValidationMessages[index] = this.renderFormErrorMessage([
            {'productId': ['required', 'maxlength']},
            {'lotId': ['required']},
            {'unitId': ['required', 'maxlength']},
            {'invoiceQuantity': ['required', 'isValid']},
            {'quantity': ['required', 'isValid']},
            {'price': ['required', 'isValid']}
        ]);
        const goodsReceiptNoteDetailModel = this.formBuilder.group({
            id: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.id : ''],
            productId: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.productId : '', [
                Validators.required,
                Validators.maxLength(50)
            ]],
            productName: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.productName : '', [
                Validators.maxLength(256)
            ]],
            lotId: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.lotId : '', [
                Validators.maxLength(50),
                conditionalRequiredValidator(this.isManageByLot)
            ]],
            expiryDate: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.expiryDate : ''],
            unitId: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.unitId : '', [
                Validators.required,
                Validators.maxLength(50)
            ]],
            unitName: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.unitName : ''],
            invoiceQuantity: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.invoiceQuantity : '', [
                Validators.required,
                this.numberValidator.isValid
            ]],
            quantity: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.quantity : '', [
                Validators.required,
                this.numberValidator.isValid
            ]],
            price: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.price : '', [
                Validators.required,
                this.numberValidator.isValid
            ]],
            totalBeforeTaxes: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.totalBeforeTaxes : ''],
            taxes: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.taxes : ''],
            tax: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.tax : ''],
            totalAmounts: [goodsReceiptNoteDetail ? goodsReceiptNoteDetail.totalAmounts : ''],
            units: [[]]
        });
        goodsReceiptNoteDetailModel.valueChanges.subscribe(() => this.validateFormGroup(goodsReceiptNoteDetailModel,
            this.detailFormErrors[index], this.detailValidationMessages[index]));
        goodsReceiptNoteDetailModel.get('price').valueChanges.subscribe((value) => {
            const {quantity, tax} = goodsReceiptNoteDetailModel.value;
            this.calculateValues(goodsReceiptNoteDetailModel, value, quantity, tax);
        });
        goodsReceiptNoteDetailModel.get('quantity').valueChanges.subscribe((value) => {
            const {price, tax} = goodsReceiptNoteDetailModel.value;
            this.calculateValues(goodsReceiptNoteDetailModel, price, value, tax);
        });
        goodsReceiptNoteDetailModel.get('tax').valueChanges.subscribe((value) => {
            const {price, quantity} = goodsReceiptNoteDetailModel.value;
            this.calculateValues(goodsReceiptNoteDetailModel, price, quantity, value);
        });
        return goodsReceiptNoteDetailModel;
    }

    private resetModel() {
        this.isUpdate = false;
        this.id = null;
        this.model.reset(new GoodsReceiptNote());
        this.supplierSuggestionComponent.clear();
        this.deliverSuggestionComponent.clear();
        this.followSuggestionComponent.clear();
        this.warehouseSuggestionComponent.clear();
        this.totalAmounts = null;
        // this.goodsReceiptNoteFormProductComponent.reset();
        this.isPrint = false;
        // this.clearFormArray(this.goodsReceiptNoteDetails);
        this.goodsReceiptNoteDetails = [];
    }

    private getStats() {
        this.totalAmounts = 0;
        this.totalBeforeTaxes = 0;
        this.taxes = 0;
        this.goodsReceiptNoteDetails.forEach((goodsReceiptNoteDetail: GoodsReceiptNoteDetail) => {
            this.totalAmounts += goodsReceiptNoteDetail.totalAmounts;
            this.totalBeforeTaxes += goodsReceiptNoteDetail.totalBeforeTaxes;
            this.taxes += goodsReceiptNoteDetail.taxes;
        });
    }

    private getUnitByProductId(id: string, goodsReceiptNoteDetailFormControl: FormControl) {
        this.subscribers.getUnits = this.productService.getUnit(id, 1, 10)
            .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                goodsReceiptNoteDetailFormControl.patchValue({
                    units: result.items
                });
            });
    }

    private calculateValues(goodsReceiptNoteDetailModel: FormGroup, price: number, quantity: number, tax?: number) {
        const totalBeforeTaxes = price * quantity;
        const taxes = tax ? totalBeforeTaxes * tax / 100 : 0;
        const totalAmounts = totalBeforeTaxes + taxes;
        goodsReceiptNoteDetailModel.patchValue({
            totalBeforeTaxes: totalBeforeTaxes,
            taxes: taxes,
            totalAmounts: totalAmounts
        });
        this.totalAmounts = 0;
        this.totalBeforeTaxes = 0;
        this.taxes = 0;
        this.goodsReceiptNoteDetails.forEach((goodsReceiptNoteDetail: GoodsReceiptNoteDetail) => {
            this.totalAmounts += goodsReceiptNoteDetail.totalAmounts;
            this.totalBeforeTaxes += goodsReceiptNoteDetail.totalBeforeTaxes;
            this.taxes += goodsReceiptNoteDetail.taxes;
        });
    }
}
