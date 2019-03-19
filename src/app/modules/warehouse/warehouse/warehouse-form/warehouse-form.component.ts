import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../base-form.component';
import { Warehouse } from '../model/warehouse.model';
import { WarehouseService } from '../service/warehouse.service';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { finalize } from 'rxjs/operators';
import { UtilService } from '../../../../shareds/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Pattern } from '../../../../shareds/constants/pattern.const';
import { WarehouseManagerConfig } from '../model/warehouse-manager-config.model';
import { WarehouseDetailViewModel } from '../viewmodel/warehouse-detail.viewmodel';
import { WarehouseLimitComponent } from './warehouse-limit/warehouse-limit.component';
import { NHTab } from '../../../../shareds/components/nh-tab/nh-tab.model';
import { NhTabComponent } from '../../../../shareds/components/nh-tab/nh-tab.component';
import { WarehouseConfigComponent } from './warehouse-config/warehouse-config.component';

@Component({
    selector: 'app-warehouse-form',
    templateUrl: './warehouse-form.component.html'
})
export class WarehouseFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild(WarehouseLimitComponent) warehouseLimitComponent: WarehouseLimitComponent;
    @ViewChild(NhTabComponent) nhTabComponent: NhTabComponent;
    @ViewChild(WarehouseConfigComponent) warehouseConfigComponent: WarehouseConfigComponent;
    warehouse = new Warehouse();
    listWarehouseManagerConfig: WarehouseManagerConfig[] = [];
    warehouseDetail: WarehouseDetailViewModel;
    inventoryCalculatorMethods = [
        // {id: 0, name: 'Thực tế đích danh'},
        // {id: 1, name: 'Bình quân ra quyền cả kỳ dự trữ.'},
        {id: 2, name: 'Bình quân ra quyền tức thì sau mỗi lần nhập.'},
        // {id: 3, name: 'Nhập trước xuất trước.'},
        // {id: 4, name: 'Nhập sau xuất trước.'},
    ];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private fb: FormBuilder,
                private utilService: UtilService,
                private router: Router,
                private route: ActivatedRoute,
                private warehouseService: WarehouseService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.WAREHOUSE_MANAGEMENT, 'Quản lý kho', 'Quản lý sản phẩm');
        this.renderForm();
        this.subscribers.routerParam = this.route.params.subscribe((params: any) => {
                const id = params['id'];
                if (id) {
                    this.id = id;
                    this.isUpdate = true;
                    this.warehouseService.getDetail(id).subscribe((result: ActionResultViewModel<WarehouseDetailViewModel>) => {
                        this.warehouseDetail = result.data;
                        if (this.warehouseDetail) {
                            this.model.patchValue({
                                id: this.warehouseDetail.id,
                                name: this.warehouseDetail.name,
                                address: this.warehouseDetail.address,
                                description: this.warehouseDetail.description,
                                isActive: this.warehouseDetail.isActive,
                                concurrencyStamp: this.warehouseDetail.concurrencyStamp,
                                inventoryCalculatorMethod: this.warehouseDetail.inventoryCalculatorMethod
                            });
                            this.listWarehouseManagerConfig = this.warehouseDetail.warehouseManagerConfigs;
                        }
                    });
                }
            }
        );
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );

        if (isValid) {
            this.warehouse = this.model.value;
            this.warehouse.warehouseManagerConfigs = this.listWarehouseManagerConfig;
            this.isSaving = true;
            if (this.isUpdate) {
                this.warehouseService
                    .update(this.id, this.warehouse)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.router.navigate(['/warehouses']);
                    });
            } else {
                this.warehouseService
                    .insert(this.warehouse)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe((result: ActionResultViewModel) => {
                        this.id = result.data;
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            // this.utilService.focusElement('name ' + this.currentLanguage);
                            this.resetForm();
                        } else {
                            this.id = result.data;
                            this.nhTabComponent.tabs.push(new NHTab('limitQuantityProduct', 'Limit Quantity Product'));
                            setTimeout(() => {
                                this.nhTabComponent.setTabActiveById('warehouseManager');
                            }, 200);
                        }
                    });
            }
        }
    }

    onWarehouseConfigSelected() {
        this.warehouseConfigComponent.getConfig(this.id);
    }

    selectListManger(value: WarehouseManagerConfig[]) {
        this.listWarehouseManagerConfig = value;
    }

    getWarehouseLimit(value) {
        this.warehouseLimitComponent.search(1);
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'address', 'description', 'isActive', 'inventoryCalculatorMethod']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxLength', 'pattern']},
            {'address': ['maxLength']},
            {'description': ['maxLength']},
            {'isActive': ['required']},
            {'inventoryCalculatorMethod': ['required']},
        ]);

        this.model = this.fb.group({
            name: [this.warehouse.name, [Validators.required, Validators.maxLength(50), Validators.pattern(Pattern.whiteSpace)]],
            address: [this.warehouse.address, [Validators.maxLength(500)]],
            isActive: [this.warehouse.isActive, [Validators.required]],
            description: [this.warehouse.description, [Validators.maxLength(4000)]],
            concurrencyStamp: [this.warehouse.concurrencyStamp],
            inventoryCalculatorMethod: [this.warehouse.inventoryCalculatorMethod, [
                Validators.required
            ]],
            warehouseManagerConfigs: [this.warehouse.warehouseManagerConfigs]
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            name: '',
            address: '',
            description: '',
            isActive: true,
        });
        this.clearFormError(this.formErrors);
    }
}
