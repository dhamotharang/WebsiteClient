import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { InventoryService } from '../service/inventory.service';
import { Inventory, InventoryStatus } from '../model/inventory.model';
import { finalize } from 'rxjs/operators';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';
import { FormBuilder, Validators } from '@angular/forms';
import { InventoryMember } from '../model/inventory-member.model';
import { InventoryDetail } from '../model/inventory-detail.model';
import { UtilService } from '../../../../../shareds/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { InventoryDetailViewModel } from '../viewmodel/inventory-detail.viewmodel';
import { WarehouseSuggestionComponent } from '../../../warehouse/warehouse-suggestion/warehouse-suggestion.component';
import { DateTimeValidator } from '../../../../../validators/datetime.validator';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { UserSuggestion } from '../../../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.component';
import { InventoryProductComponent } from '../inventory-form/inventory-product/inventory-product.component';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';

@Component({
    selector: 'app-inventory-detail',
    templateUrl: './inventory-detail.component.html',
    providers: [DateTimeValidator]
})

export class InventoryDetailComponent extends BaseFormComponent implements OnInit {
    // @ViewChild('formInventory') formInventory: NhModalComponent;
    @ViewChild(WarehouseSuggestionComponent) warehouseSuggestionComponent: WarehouseSuggestionComponent;
    @ViewChild(InventoryProductComponent) inventoryProductComponent: InventoryProductComponent;
    inventory = new Inventory();
    inventoryDetail: InventoryDetailViewModel;
    selectedMembers: UserSuggestion[] = [];
    listInventoryDetail: InventoryDetail[] = [];
    inventoryStatus = InventoryStatus;
    currentPage = 1;
    pageSize = 20;
    date: string;

    constructor(private inventoryService: InventoryService,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private route: ActivatedRoute,
                private router: Router, @Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private datetimeValidator: DateTimeValidator,
                private utilService: UtilService) {
        super();
        this.date = this.inventory.inventoryDate;

        this.subscribers.queryParams = this.route.params.subscribe((params: any) => {
            if (params.id) {
                this.isUpdate = true;
                this.id = params.id;
                this.getDetail(params.id);
            }
        });
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.INVENTORY, 'Thêm mới', 'Quản lý kho');
        this.renderForm();
    }

    onModalShow() {
    }

    onModalHidden() {
    }

    onUserSelected(users: any) {
        this.selectedMembers = users;
    }

    onDateSelected(date: string) {
        this.date = date;
    }

    add() {
        this.resetForm();
        if (this.warehouseSuggestionComponent) {
            this.warehouseSuggestionComponent.clear();
        }
        this.isUpdate = false;
        // this.formInventory.open();
    }

    edit(id: string) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        // this.formInventory.open();
    }

    save(isBalance) {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (!this.inventoryProductComponent.details || this.inventoryProductComponent.details.length === 0) {
            this.toastr.error('Vui lòng chọn ít nhất một sản phẩm.');
            return;
        }
        const inValidDetail = _.countBy(this.inventoryProductComponent.details, (inventoryDetail: InventoryDetail) => {
            return !inventoryDetail.realQuantity && inventoryDetail.realQuantity !== 0;
        }).true;
        if (inValidDetail && inValidDetail > 0) {
            this.toastr.error('Vui lòng nhập số lượng thực tế.');
            return;
        }
        if (isValid) {
            this.inventory = this.model.value;
            this.inventory.members = this.selectedMembers.map((user: any) => {
                return {
                    userId: user.id
                } as InventoryMember;
            });
            this.inventory.details = this.inventoryProductComponent.details;
            if (this.isUpdate) {
                this.inventoryService.update(this.id, this.inventory, isBalance)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.router.navigateByUrl(
                            `/goods/inventories?warehouseId=${this.inventory.warehouseId.trim()}&warehouseName=${this.inventory.warehouseName.trim()}`
                        );
                    });
            } else {
                this.inventoryService.insert(this.inventory, isBalance)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        // this.isModified = true;
                        // if (this.isCreateAnother) {
                        //     this.resetForm();
                        // } else {
                        //     // this.saveSuccessful.emit();
                        //     // this.formInventory.dismiss();
                        // }
                        this.router.navigateByUrl(
                            `/goods/inventories?warehouseId=${this.inventory.warehouseId}&warehouseName=${this.inventory.warehouseName.trim()}`
                        );
                    });
            }
        }
    }

    onWarehouseSelected(warehouse: any) {
        this.model.patchValue({warehouseId: warehouse.id, warehouseName: warehouse.name});
        // if (warehouseId) {
        // this.inventoryService.getProductByWarehouseId('', warehouseId, this.model.value.inventoryDate, this.currentPage,
        // this.pageSize)
        //     .subscribe((result: SearchResultViewModel<InventoryDetail>) => {
        //         console.log(result.items);
        //         this.listInventoryDetail = result.items;
        //     });
        // }
    }

    balanced() {
        this.inventoryDetail.status = InventoryStatus.balanced;
    }

    private getDetail(id: string) {
        this.inventoryService.getDetail(id).subscribe((result: ActionResultViewModel<InventoryDetailViewModel>) => {
            const data = result.data;
            console.log(data);
            this.inventoryDetail = data;
            if (data) {
                this.model.patchValue({
                    id: data.id,
                    warehouseId: data.warehouseId,
                    warehouseName: data.warehouseName,
                    note: data.note,
                    inventoryDate: data.inventoryDate,
                    concurrencyStamp: data.concurrencyStamp,
                    status: data.status
                });
                this.inventoryProductComponent.warehouseId = data.warehouseId;
                // this.inventoryProductComponent.warehouseName = data.warehouseName;
                // this.listInventoryDetail = this.inventoryDetail.inventoryDetails;
                this.inventoryProductComponent.details = data.details
                    .map((inventoryDetail: InventoryDetail) => {
                        inventoryDetail.difference = inventoryDetail.realQuantity - inventoryDetail.inventoryQuantity;
                        inventoryDetail.amount = inventoryDetail.realQuantity * inventoryDetail.price;
                        inventoryDetail.accountingAmount = inventoryDetail.inventoryQuantity * inventoryDetail.price;
                        inventoryDetail.differenceAmount = inventoryDetail.amount - inventoryDetail.accountingAmount;
                        return inventoryDetail;
                    });
                this.selectedMembers = this.inventoryDetail.members
                    .map((member: InventoryMember) => {
                        return {
                            id: member.userId,
                            fullName: member.fullName,
                            avatar: member.avatar,
                            positionName: member.positionName,
                            officeName: member.officeName
                        } as UserSuggestion;
                    });
                // if (this.warehouseSuggestionComponent) {
                //     this.warehouseSuggestionComponent.selectedItem = new NhSuggestion(this.inventoryDetail.warehouseId,
                //         this.inventoryDetail.warehouseName);
                // }
            }
        });
    }

    selectAmount(value) {
        if (value) {
            this.model.patchValue({totalAmounts: value.totalAmounts, totalQuantity: value.totalQuantity});
        } else {
            this.model.patchValue({totalAmounts: 0, totalQuantity: 0});
        }
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['warehouseId', 'note', 'inventoryDate']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'warehouseId': ['required', 'maxLength']},
            {'note': ['maxLength']},
            {'inventoryDate': ['required', 'isValid']},
        ]);
        this.model = this.fb.group({
            id: [this.inventory.id],
            warehouseId: [this.inventory.warehouseId, [Validators.required, Validators.maxLength(50)]],
            warehouseName: [this.inventory.warehouseName],
            note: [this.inventory.note, [Validators.maxLength(500)]],
            inventoryDate: [this.inventory.inventoryDate, [this.datetimeValidator.isValid]],
            concurrencyStamp: [this.inventory.concurrencyStamp],
            status: [this.inventory.status],
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue(new Inventory());
        if (this.warehouseSuggestionComponent) {
            this.warehouseSuggestionComponent.clear();
        }
        this.listInventoryDetail = [];
        this.selectedMembers = [];
        this.clearFormError(this.formErrors);
    }
}
