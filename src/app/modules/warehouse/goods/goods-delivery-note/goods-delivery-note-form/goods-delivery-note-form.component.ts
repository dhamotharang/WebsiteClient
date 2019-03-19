import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { GoodsDeliveryNote } from '../model/goods-delivery-note.model';
import { UtilService } from '../../../../../shareds/services/util.service';
import { NumberValidator } from '../../../../../validators/number.validator';
import { DeliveryType, DeliveryTypes } from '../../../../../shareds/constants/deliveryType.const';
import { DateTimeValidator } from '../../../../../validators/datetime.validator';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { GoodsDeliveryNoteService } from '../goods-delivery-note.service';
import { GoodsDeliveryNoteDetail } from '../model/goods-delivery-note-details.model';
import { finalize } from 'rxjs/operators';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';
import { GoodsDeliveryNoteDetailViewModel } from '../viewmodel/goods-delivery-note.detail.viewmodel';
import { ToastrService } from 'ngx-toastr';
import {
    GhmUserSuggestionComponent,
    UserSuggestion
} from '../../../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';
import * as moment from 'moment';
import * as _ from 'lodash';
import { WarehouseSuggestionComponent } from '../../../warehouse/warehouse-suggestion/warehouse-suggestion.component';
import { SupplierSuggestionComponent } from '../../../product/supplier/supplier-suggestion/supplier-suggestion.component';
import { TreeData } from '../../../../../view-model/tree-data';
import { GoodsDeliveryNoteProductComponent } from './list-product/goods-delivery-note-product.component';

@Component({
    selector: 'app-goods-delivery-note-form',
    templateUrl: './goods-delivery-note-form.component.html',
    styleUrls: ['../goods-delivery-note.scss'],
    providers: [NumberValidator, DateTimeValidator, GoodsDeliveryNoteService]
})
export class GoodsDeliveryNoteFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('formGoodsDeliveryNote') formGoodsDeliveryNote: NhModalComponent;
    @ViewChild('warehouseSuggestion') warehouseSuggestionComponent: WarehouseSuggestionComponent;
    @ViewChild(SupplierSuggestionComponent) supplierSuggestionComponent: SupplierSuggestionComponent;
    @ViewChild(GhmUserSuggestionComponent) ghmUserSuggestionComponent: GhmUserSuggestionComponent;
    @ViewChild(GoodsDeliveryNoteProductComponent) goodsDeliveryNoteProductComponent: GoodsDeliveryNoteProductComponent;
    goodsDeliveryNote = new GoodsDeliveryNote();
    listDeliveryType = DeliveryTypes;

    warehouses: NhSuggestion[];
    deliveryType = DeliveryType;
    goodsDeliveryNoteDetail: GoodsDeliveryNoteDetailViewModel;
    listGoodsDeliveryNoteDetail: GoodsDeliveryNoteDetail[];
    selectedReceiverWarehouse: NhSuggestion = null;
    officeTree: TreeData[] = [];

    private _reasonRequired = false;

    set reasonRequired(value: boolean) {
        this._reasonRequired = value;
        const reasonControl = this.model.get('reason');
        if (value) {
            reasonControl.setValidators([Validators.required, Validators.maxLength(500)]);
            reasonControl.updateValueAndValidity();
        } else {
            reasonControl.setValidators(Validators.maxLength(500));
            reasonControl.updateValueAndValidity();
        }
    }

    get reasonRequired() {
        return this._reasonRequired;
    }

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private utilService: UtilService,
                private numberValidator: NumberValidator,
                private dateTimeValidator: DateTimeValidator,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private goodsDeliveryNoteService: GoodsDeliveryNoteService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
        // this.subscribers.getDay = this.model.get('day').valueChanges.subscribe((value) => {
        //     const month = this.model.value.month;
        //     const year = this.model.value.year;
        //     this.getDeliveryDate(value, month, year);
        // });
        // this.subscribers.getMonth = this.model.get('month').valueChanges.subscribe((value) => {
        //     const day = this.model.value.day;
        //     const year = this.model.value.year;
        //     this.getDeliveryDate(day, value, year);
        // });
        // this.subscribers.getYear = this.model.get('year').valueChanges.subscribe((value) => {
        //     const day = this.model.value.day;
        //     const month = this.model.value.month;
        //     this.getDeliveryDate(day, month, value);
        // });
        this.subscribers.getType = this.model.get('type').valueChanges.subscribe((value) => {
            this.reasonRequired = value === this.deliveryType.voided || value === this.deliveryType.return;
        });
    }

    onModalShow() {
    }

    onModalHidden() {
    }

    onOfficeSelected(data: TreeData) {
        this.model.patchValue({
            officeId: data.id,
            officeName: data.text
        });
    }

    onUserSelected(user: UserSuggestion) {
        this.model.patchValue({
            receiverId: user.id,
            receiverFullName: user.fullName
        });
    }

    onUserRemoved() {
        this.model.patchValue({
            receiverId: null,
            receiverFullName: null
        });
    }

    onReceiverSelected(receiver: any) {
        this.model.patchValue({
            receiverId: receiver ? receiver.id : null,
            receiverFullName: receiver ? receiver.name : null,
            receiverPhoneNumber: receiver ? receiver.phoneNumber : null
        });
    }

    onReceiverRemoved() {
        this.model.patchValue({
            receiverId: null,
            receiverFullName: null,
            receiverPhoneNumber: null
        });
    }

    add() {
        this.resetForm();
        this.isUpdate = false;
        this.listGoodsDeliveryNoteDetail = [];
        this.formGoodsDeliveryNote.open();
    }

    edit(id: string) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.formGoodsDeliveryNote.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.goodsDeliveryNote = this.model.value;
            this.goodsDeliveryNote.goodsDeliveryNoteDetails = this.goodsDeliveryNoteProductComponent.listGoodsDeliveryNoteDetail;
            // Compare real quantity with inventory quantity.
            const count = _.countBy(this.goodsDeliveryNote.goodsDeliveryNoteDetails, (goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail) => {
                return goodsDeliveryNoteDetail.quantity > goodsDeliveryNoteDetail.conversionInventory;
            }).true;
            if (count && count > 0) {
                this.toastr.warning('Số lượng thực xuất phải nhỏ hơn số lượng tồn kho.');
                return;
            }
            if (!this.goodsDeliveryNote.goodsDeliveryNoteDetails || this.goodsDeliveryNote.goodsDeliveryNoteDetails.length === 0) {
                this.toastr.error('Vui lòng chọn sản phẩm.');
                return;
            }
            this.isSaving = true;
            if (this.isUpdate) {
                this.goodsDeliveryNoteService.update(this.id, this.goodsDeliveryNote)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.saveSuccessful.emit();
                        this.formGoodsDeliveryNote.dismiss();
                    });
            } else {
                this.goodsDeliveryNoteService.insert(this.goodsDeliveryNote)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.resetForm();
                        } else {
                            this.saveSuccessful.emit();
                            this.formGoodsDeliveryNote.dismiss();
                        }
                    });
            }
        }
    }

    onReceptionWarehouseSelected(value) {
        if (value) {
            this.model.patchValue({
                receptionWarehouseId: value.id
            });

            if (this.model.value.type === DeliveryType.transfer && this.model.value.receptionWarehouseId && this.model.value.warehouseId
                && this.model.value.receptionWarehouseId === this.model.value.warehouseId) {
                this.toastr.error('Kho xuất và kho nhập phải khác nhau.');
                this.model.patchValue({
                    receptionWarehouseId: ''
                });
                return;
            }
        }
    }

    onWarehouseSelected(warehouse: NhSuggestion) {
        this.model.patchValue({warehouseId: warehouse ? warehouse.id : null});
        if (this.model.value.type === DeliveryType.transfer && this.model.value.receptionWarehouseId && this.model.value.warehouseId
            && this.model.value.receptionWarehouseId === this.model.value.warehouseId) {
            this.toastr.error('Kho nhận phải khác kho xuất.');
            this.model.patchValue({
                warehouseId: ''
            });
            return;
        }
    }

    onRemoveWarehouse() {
        this.model.patchValue({
            warehouseId: null
        });
    }

    onRemoveReceptionWarehouse() {
        this.model.patchValue({
            receptionWarehouseId: null
        });
    }

    onSupplierSelected(supplier) {
        this.model.patchValue({receiverId: supplier ? supplier.id : null});
    }

    selectUser(user: UserSuggestion) {
        if (user) {
            this.model.patchValue({receiverId: user.id, receiverFullName: user.fullName});
        } else {
            this.model.patchValue({receiverId: null, receiverFullName: ''});
        }
    }

    onSelectProduct(value) {
        if (value) {
            this.listGoodsDeliveryNoteDetail = value;
        }
    }

    onTotalAmountChanged(value) {
        if (value) {
            this.model.patchValue({totalAmounts: value});
        } else {
            this.model.patchValue({totalAmounts: 0});
        }
    }

    private getDetail(id: string) {
        this.goodsDeliveryNoteService.getDetail(id).subscribe((result: ActionResultViewModel<GoodsDeliveryNoteDetailViewModel>) => {
            const data = result.data;
            this.goodsDeliveryNoteDetail = data;
            const totalQuantity = _.sumBy(this.goodsDeliveryNoteDetail.goodsDeliveryNoteDetails, (item: GoodsDeliveryNoteDetail) => {
                return item.quantity;
            });
            if (data) {
                if (data.warehouseId && data.warehouseName) {
                    this.selectedReceiverWarehouse = new NhSuggestion(data.receptionWarehouseId, data.receptionWarehouseName);
                }
                data.deliveryDate = moment(data.deliveryDate).format('YYYY/MM/DD HH:mm:ss');
                this.model.patchValue({
                    warehouseId: data.warehouseId,
                    warehouseName: data.warehouseName,
                    reason: data.reason,
                    type: data.type,
                    receiverId: data.receiverId,
                    receiverFullName: data.receiverFullName,
                    receiverPhoneNumber: data.receiverPhoneNumber,
                    note: data.note,
                    officeId: data.officeId,
                    officeName: data.officeName,
                    receptionWarehouseId: data.receptionWarehouseId,
                    agencyId: data.agencyId,
                    totalAmounts: data.totalAmounts,
                    totalQuantity: totalQuantity,
                    inventoryId: data.inventoryId,
                    deliveryNo: data.deliveryNo,
                    deliveryDate: data.deliveryDate,
                    concurrencyStamp: data.concurrencyStamp,
                    supplierName: data.supplierName
                });
                this.listGoodsDeliveryNoteDetail = this.goodsDeliveryNoteDetail.goodsDeliveryNoteDetails
                    .map((goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail) => {
                        return new GoodsDeliveryNoteDetail(goodsDeliveryNoteDetail.id, goodsDeliveryNoteDetail.code,
                            goodsDeliveryNoteDetail.productId,
                            goodsDeliveryNoteDetail.productName, goodsDeliveryNoteDetail.warehouseId, goodsDeliveryNoteDetail.warehouseName,
                            goodsDeliveryNoteDetail.unitId, goodsDeliveryNoteDetail.unitName, goodsDeliveryNoteDetail.price,
                            goodsDeliveryNoteDetail.quantity, goodsDeliveryNoteDetail.recommendedQuantity, goodsDeliveryNoteDetail.lotId,
                            goodsDeliveryNoteDetail.inventoryQuantity, goodsDeliveryNoteDetail.goodsReceiptNoteDetailCode,
                            goodsDeliveryNoteDetail.concurrencyStamp, goodsDeliveryNoteDetail.units);
                    });
            }
        });
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['warehouseId', 'reason', 'type', 'receiverId', 'receiverFullName',
            'receiverPhoneNumber', 'note', 'receptionWarehouseId', 'agencyId', 'totalAmounts', 'inventoryId', 'deliveryNo', 'day', 'month',
            'year']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'warehouseId': ['required', 'maxlength']},
            {'reason': ['required', 'maxlength']},
            {'type': ['required', 'isValid']},
            {'receiverId': ['maxlength']},
            {'receiverFullName': ['maxlength']},
            {'receiverPhoneNumber': ['maxlength']},
            {'note': ['maxlength']},
            {'receptionWarehouseId': ['maxLength']},
            {'totalAmounts': ['required', 'isValid', 'greaterThan', 'lessThan']},
            {'inventoryId': ['maxlength']},
            {'deliveryNo': ['maxlength']},
            {'day': ['required', 'isValid', 'lessThan', 'greaterThan']},
            {'month': ['required', 'isValid', 'lessThan', 'greaterThan']},
            {'year': ['required', 'isValid', 'greaterThan']},
        ]);

        this.model = this.fb.group({
            warehouseId: [this.goodsDeliveryNote.warehouseId, [
                Validators.required, Validators.maxLength(50)
            ]],
            warehouseName: [this.goodsDeliveryNote.warehouseName],
            reason: [this.goodsDeliveryNote.reason, [
                Validators.maxLength(500)
            ]],
            type: [this.goodsDeliveryNote.type, [
                Validators.required, this.numberValidator.isValid
            ]],
            receiverId: [this.goodsDeliveryNote.receiverId, [
                Validators.maxLength(50)
            ]],
            receiverFullName: [this.goodsDeliveryNote.receiverFullName, [
                Validators.maxLength(50)
            ]],
            receiverAvatar: [this.goodsDeliveryNote.receiverAvatar],
            receiverPhoneNumber: [this.goodsDeliveryNote.receiverPhoneNumber, [
                Validators.maxLength(50)
            ]],
            note: [this.goodsDeliveryNote.note, [
                Validators.maxLength(500)
            ]],
            receptionWarehouseId: [this.goodsDeliveryNote.receptionWarehouseId, [
                Validators.maxLength(50)
            ]],
            agencyId: [this.goodsDeliveryNote.agencyId, [
                Validators.maxLength(50)
            ]],
            totalAmounts: [this.goodsDeliveryNote.totalAmounts, [
                Validators.required, this.numberValidator.isValid,
                this.numberValidator.greaterThan(0), this.numberValidator.lessThan(2147483648)
            ]],
            totalQuantity: [this.goodsDeliveryNote.totalQuantity],
            inventoryId: [this.goodsDeliveryNote.inventoryId, [
                Validators.maxLength(50)
            ]],
            deliveryNo: [{value: this.goodsDeliveryNote.deliveryNo, disabled: true}, [
                Validators.maxLength(50)
            ]],
            day: [this.goodsDeliveryNote.day, [
                Validators.required, this.numberValidator.isValid, this.numberValidator.lessThan(32), this.numberValidator.greaterThan(0)
            ]],
            month: [this.goodsDeliveryNote.month, [
                Validators.required, this.numberValidator.isValid, this.numberValidator.lessThan(13), this.numberValidator.greaterThan(0)
            ]],
            year: [this.goodsDeliveryNote.year, [
                Validators.required, this.numberValidator.isValid, this.numberValidator.greaterThan(new Date().getFullYear() - 1),
                this.numberValidator.lessThan(new Date().getFullYear() + 1)
            ]],
            officeId: [this.goodsDeliveryNote.officeId],
            officeName: [this.goodsDeliveryNote.officeName],
            deliveryDate: [this.goodsDeliveryNote.deliveryDate],
            supplierName: [this.goodsDeliveryNote.supplierName],
            concurrencyStamp: [this.goodsDeliveryNote.concurrencyStamp],
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.listGoodsDeliveryNoteDetail = [];
        this.model.patchValue(new GoodsDeliveryNote());
        if (this.warehouseSuggestionComponent) {
            this.warehouseSuggestionComponent.clear();
        }
        this.selectedReceiverWarehouse = null;
        if (this.supplierSuggestionComponent) {
            this.supplierSuggestionComponent.clear();
        }
        if (this.ghmUserSuggestionComponent) {
            this.ghmUserSuggestionComponent.clear();
        }
        this.clearFormError(this.formErrors);
    }
}
