import { AfterViewInit, Component, DoCheck, EventEmitter, Input, IterableDiffers, OnInit, Output, ViewChild } from '@angular/core';
import { InventoryDetail } from '../../model/inventory-detail.model';
import { InventoryService } from '../../service/inventory.service';
import { SearchResultViewModel } from '../../../../../../shareds/view-models/search-result.viewmodel';
import { finalize } from 'rxjs/internal/operators';
import * as _ from 'lodash';
import { BaseFormComponent } from '../../../../../../base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { UtilService } from '../../../../../../shareds/services/util.service';
import { NumberValidator } from '../../../../../../validators/number.validator';
import { InventoryStatus } from '../../model/inventory.model';
import { InventoryReportService } from '../../../inventory-report/inventory-report.service';
import { ToastrService } from 'ngx-toastr';
import { ActionResultViewModel } from '../../../../../../shareds/view-models/action-result.viewmodel';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ProductSuggestionComponent } from '../../../../product/product/product-suggestion/product-suggestion.component';

@Component({
    selector: 'app-inventory-product',
    templateUrl: './inventory-product.component.html',
    providers: [NumberValidator]
})

export class InventoryProductComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('confirmDeleteProduct') swalConfirmDelete: SwalComponent;
    @ViewChild('productSuggestion') productSuggestion: ProductSuggestionComponent;
    @Input() details: InventoryDetail[];
    @Input() inventoryId;
    @Input() status;
    @Input() totalRows;
    @Input() date: string;
    @Input() isUpdate = false;
    @Output() onBalanced = new EventEmitter();
    @Output() warehouseSelected = new EventEmitter();
    @Input() warehouseId: string;
    @Input() readonly: string;
    isSearching;
    keyword;
    currentPage = 1;
    pageSize = 1000;
    inventoryDetail = new InventoryDetail();
    productId;
    index;
    selectedInventoryDetail: InventoryDetail;
    inventoryStatus = InventoryStatus;

    constructor(private utilService: UtilService,
                private numberValidator: NumberValidator,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private inventoryReportService: InventoryReportService,
                private inventoryService: InventoryService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
        this.model.get('realQuantity').valueChanges.subscribe((value) => {
            const quantity = this.model.value.quantity;
        });
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete();
        });
    }

    // onWarehouseSelected(warehouse: any) {
    //     this.warehouseId = warehouse.id;
    //     this.warehouseSelected.emit(warehouse.id);
    // }

    onProductSelected(product: any) {
        if (!this.warehouseId) {
            this.toastr.warning(' Vui lòng chọn kho.');
            this.productSuggestion.clear();
            return;
        }
        const existingInventoryDetail = _.find(this.details, (detail: any) => {
            return detail.productId === product.id && detail.lotId === product.description;
        });
        if (existingInventoryDetail) {
            this.toastr.warning('Sản phẩm đã tồn tại trong danh sách kiểm kê. Vui lòng kiểm tra lại.');
            this.productSuggestion.clear();
            return;
        }
        this.subscribers.getProduct = this.inventoryReportService.getProduct(this.warehouseId, product.id, this.date)
            .subscribe((result: any) => {
                const inventoryDetail = {
                    inventoryId: this.inventoryId,
                    productId: product.id,
                    productName: product.name,
                    lotId: result.lotId,
                    unitId: result.unitId,
                    unitName: result.unitName,
                    inventoryQuantity: result.inventoryQuantity,
                    reason: '',
                } as InventoryDetail;
                this.details = [...this.details, inventoryDetail];
                this.productSuggestion.clear();
                // if (this.isUpdate && this.inventoryId) {
                //     this.subscribers.insertDetail = this.inventoryService.insertProduct(this.inventoryId, inventoryDetail)
                //         .subscribe((resultInsert: ActionResultViewModel) => {
                //             inventoryDetail.concurrencyStamp = resultInsert.data;
                //         });
                // }
            });
    }

    onRealQuantityBlur(inventoryDetail: InventoryDetail) {
        if (inventoryDetail.realQuantity) {
            inventoryDetail.difference = inventoryDetail.realQuantity - inventoryDetail.inventoryQuantity;
        }
    }

    addAllProduct() {
        if (!this.warehouseId) {
            this.toastr.warning('Vui lòng chọn kho.');
            return;
        }
        if (!this.date) {
            this.toastr.warning('Vui lòng chọn thời ngày kiểm kê.');
            return;
        }
        this.subscribers.inventoryGetAllProducts = this.inventoryReportService
            .getAllProductToTakeInventory(this.warehouseId, this.date)
            .subscribe((result: any) => {
                this.details = result;
            });
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.inventoryService.searchProduct(this.inventoryId, this.keyword, this.currentPage, this.pageSize)
            .pipe(finalize(() => {
                this.isSearching = false;
            })).subscribe((result: SearchResultViewModel<InventoryDetail>) => {
            this.details = result.items;
            this.totalRows = result.totalRows;
        });
    }

    confirm(inventoryDetail: InventoryDetail) {
        this.selectedInventoryDetail = inventoryDetail;
        this.swalConfirmDelete.show();
    }

    resetFormSearch() {
        this.keyword = '';
        this.search(1);
    }

    selectInventory(inventoryDetail: InventoryDetail) {
        this.selectedInventoryDetail = _.cloneDeep(inventoryDetail);
    }

    onSaveSuccess(inventoryDetail?: InventoryDetail) {
        this.isUpdate = false;
        if (!inventoryDetail) {
            this.search(1);
        } else {
            const inventoryDetailInfo = _.find(this.details, (item: InventoryDetail) => {
                return item.productId === inventoryDetail.productId && item.unitId === inventoryDetail.unitId;
            });

            if (inventoryDetailInfo) {
                inventoryDetailInfo.realQuantity = inventoryDetail.realQuantity;
                inventoryDetailInfo.reason = inventoryDetail.reason;
            }
        }
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.inventoryDetail = this.model.value;
            if (this.inventoryId) {
                if (!this.isUpdate) {
                    this.inventoryService.insertProduct(this.inventoryId, this.inventoryDetail).subscribe(() => {
                        this.resetForm();
                        this.search(1);
                    });
                } else {
                    this.inventoryService.updateProduct(this.inventoryDetail).subscribe(() => {
                        this.resetForm();
                        this.search(1);
                    });
                }
            } else {
                const inventoryDetailInfo = this.details[this.index];

                if (inventoryDetailInfo) {
                    inventoryDetailInfo.realQuantity = this.inventoryDetail.realQuantity;
                    inventoryDetailInfo.reason = this.inventoryDetail.reason;
                }
            }

            _.each(this.details, (item: InventoryDetail) => {
                item.isEdit = false;
            });
        }
    }

    update(inventoryDetail: InventoryDetail) {
        this.subscribers.updateProduct = this.inventoryService.updateProduct(inventoryDetail)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                inventoryDetail.concurrencyStamp = result.data;
            });
    }

    edit(inventoryDetail: InventoryDetail, index: number) {
        _.each(this.details, (item: InventoryDetail) => {
            item.isEdit = false;
        });
        this.index = index;
        inventoryDetail.isEdit = true;
        this.isUpdate = true;
        this.productId = inventoryDetail.productId;
        this.model.patchValue({
            inventoryId: inventoryDetail.productId,
            productId: inventoryDetail.productId,
            productName: inventoryDetail.productName,
            unitId: inventoryDetail.unitId,
            unitName: inventoryDetail.unitName,
            inventoryQuantity: inventoryDetail.inventoryQuantity,
            realQuantity: inventoryDetail.realQuantity ? this.inventoryDetail.realQuantity : 0,
            reason: inventoryDetail.reason,
        });
    }

    editRealQuantity(inventoryDetail: InventoryDetail, index: number) {
        this.edit(inventoryDetail, index);
        this.utilService.focusElement('realQuantity');
    }

    editReason(inventoryDetail: InventoryDetail, index: number) {
        this.edit(inventoryDetail, index);
        this.utilService.focusElement('reason');
    }

    delete() {
        // if (this.inventoryId) {
        //     this.subscribers.deleteProduct = this.inventoryService.deleteProduct(this.selectedInventoryDetail.inventoryId,
        //         this.selectedInventoryDetail.productId)
        //         .subscribe((result: ActionResultViewModel) => {
        //             _.remove(this.details, (detail: InventoryDetail) => {
        //                 return detail.productId === this.selectedInventoryDetail.productId
        //                     && detail.productId === this.selectedInventoryDetail.productId;
        //             });
        //         });
        // } else {
        _.remove(this.details, (detail: InventoryDetail) => {
            return detail.productId === this.selectedInventoryDetail.productId
                && detail.productId === this.selectedInventoryDetail.productId;
        });
        // }
    }

    balance() {
        this.inventoryService.balancedWarehouse(this.inventoryId).subscribe(() => {
            this.search(1);
            this.status = InventoryStatus.balanced;
            this.onBalanced.emit();
        });
    }

    private renderForm() {
        this.formErrors = this.utilService.renderFormError(['productId', 'unitId', 'closingStockQuantity', 'realQuantity',
            'reason', 'difference']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'productId': ['required']},
            {'unitId': ['required']},
            {'closingStockQuantity': ['isValid', 'required', 'lessThan', 'greaterThan']},
            {'realQuantity': ['isValid', 'required', 'lessThan', 'greaterThan']},
            {'reason': ['maxLength']},
            {'difference': ['isValid', 'required', 'lessThan']}
        ]);

        this.model = this.fb.group({
            inventoryId: [this.inventoryId],
            productId: [this.inventoryDetail.productId, [Validators.required]],
            productName: [this.inventoryDetail.productName],
            unitId: [this.inventoryDetail.unitId, [Validators.required]],
            unitName: [this.inventoryDetail.unitName],
            inventoryQuantity: [this.inventoryDetail.inventoryQuantity, [this.numberValidator.isValid,
                this.numberValidator.lessThan(2147483648), this.numberValidator.greaterThan(0)]],
            realQuantity: [this.inventoryDetail.realQuantity, [Validators.required, this.numberValidator.isValid,
                this.numberValidator.greaterThan(0), this.numberValidator.lessThan(2147483648)]],
            reason: [this.inventoryDetail.reason, [Validators.maxLength(500)]],
            difference: [this.inventoryDetail.difference, [this.numberValidator.isValid, this.numberValidator.lessThan(2147483648)]]
        });

        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.model.patchValue(new InventoryDetail());
    }
}
