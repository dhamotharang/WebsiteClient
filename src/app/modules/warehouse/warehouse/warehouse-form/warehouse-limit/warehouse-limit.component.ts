import {AfterViewInit, Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import {WarehouseLimit} from '../../model/warehouse-limit.model';
import {WarehouseService} from '../../service/warehouse.service';
import {finalize} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../../../shareds/view-models/search-result.viewmodel';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {NhSuggestion} from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';
import {FormBuilder, Validators} from '@angular/forms';
import {BaseFormComponent} from '../../../../../base-form.component';
import {UtilService} from '../../../../../shareds/services/util.service';
import {NumberValidator} from '../../../../../validators/number.validator';
import {ProductService} from '../../../product/product/service/product.service';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import {WarehouseLimitSearchViewModel} from '../../viewmodel/warehouse-limit-search.viewmodel';
import * as _ from 'lodash';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-warehouse-limit',
    templateUrl: './warehouse-limit.component.html',
    providers: [NumberValidator, ProductService]
})

export class WarehouseLimitComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('confirmDeleteWarehouseLimit') swalConfirmDelete: SwalComponent;
    @Input() warehouseId: string;
    @Input() isReadOnly = false;
    keyword;
    currentPage;
    isSearching;
    totalRows;
    pageSize;
    listWarehouseLimit: WarehouseLimitSearchViewModel[] = [];
    warehouseLimit = new WarehouseLimit();
    urlSearchProduct;
    listProductUnit = [];
    warehouseLimitQuantityProduct: WarehouseLimitSearchViewModel;
    isShowAdd;

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private numberValidator: NumberValidator,
                private productService: ProductService,
                private warehouseService: WarehouseService) {
        super();
        this.urlSearchProduct = `${appConfig.API_GATEWAY_URL}api/v1/warehouse/products`;
        this.pageSize = this.appConfig.PAGE_SIZE;
    }

    ngOnInit() {
        this.renderForm();
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.warehouseLimitQuantityProduct);
        });
    }

    resetFormSearch() {
        this.keyword = '';
        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.warehouseService.searchWarehouseLimit(this.warehouseId, this.keyword, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<WarehouseLimitSearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listWarehouseLimit = data.items;
            });
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.warehouseLimit = this.model.value;
            this.warehouseService.insertWarehouseLimit(this.warehouseId, this.warehouseLimit).subscribe((result: ActionResultViewModel) => {
                this.resetForm();
                this.isUpdate = false;
                this.search(1);
            });
        }
    }

    confirm(value: WarehouseLimitSearchViewModel) {
        this.warehouseLimitQuantityProduct = value;
        this.swalConfirmDelete.show();
    }

    delete(value: WarehouseLimitSearchViewModel) {
        this.warehouseService.deleteWarehouseLimit(this.warehouseId, value.productId, value.unitId)
            .subscribe(() => {
                _.remove(this.listWarehouseLimit, (item: WarehouseLimitSearchViewModel) => {
                    return item.productId === item.productId && item.unitId === value.unitId;
                });
            });
    }

    add() {
        this.warehouseLimitQuantityProduct = new WarehouseLimitSearchViewModel();
        this.listWarehouseLimit.push(new WarehouseLimitSearchViewModel());
        this.checkAdd();
        this.renderForm();
    }

    selectProduct(value) {
        if (value) {
            const existsProduct = _.find(this.listWarehouseLimit, (item: WarehouseLimitSearchViewModel) => {
                return item.productId === value.id;
            });

            if (existsProduct && !this.isUpdate) {
                this.toastr.error('Product already exists');
                return;
            } else {
                this.utilService.focusElement('quantity');
                this.model.patchValue({productName: value.name, productId: value.id});
                this.productService.getUnit(value.id, 1, 20).subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                    this.listProductUnit = result.items;
                    const productUnitIsDefault = _.filter(result.items, (unit: any) => {
                        return unit.isDefault = true;
                    });
                    if (productUnitIsDefault && productUnitIsDefault.length > 0) {
                        this.model.patchValue({unitId: productUnitIsDefault[0].id});

                    }
                });
            }
        }
    }

    edit(item: WarehouseLimitSearchViewModel) {
        this.isUpdate = true;
        item.isEdit = true;
        this.utilService.focusElement('quantityUpdate');
        this.warehouseLimitQuantityProduct = item;
        _.each(this.listWarehouseLimit, (warehouseLimit: WarehouseLimitSearchViewModel) => {
            warehouseLimit.isEdit = false;
            warehouseLimit.isNew = false;
        });
        item.isEdit = true;
        this.model.patchValue({
            productId: item.productId,
            productName: item.productName,
            unitId: item.unitId,
            quantity: item.quantity,
            warehouseId: this.warehouseId
        });

        this.productService.getUnit(item.productId).subscribe((result: SearchResultViewModel<NhSuggestion>) => {
            this.listProductUnit = result.items;
        });

        this.checkAdd();
    }

    cancel() {
        this.isUpdate = false;
        this.resetForm();
        _.each(this.listWarehouseLimit, (item: WarehouseLimitSearchViewModel) => {
            item.isEdit = false;
        });
    }

    private checkAdd() {
        const existsAdd = _.filter(this.listWarehouseLimit, (item: WarehouseLimitSearchViewModel) => {
            return item.isNew || item.isEdit;
        });
        this.isShowAdd = existsAdd;
    }

    private renderForm() {
        this.buildForm();
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['productId', 'productName', 'quantity', 'unitId']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'productId': ['required', 'maxLength']},
            {'productName': ['required', 'maxLength']},
            {'quantity': ['required', 'isValid', 'lessThan', 'greaterThan']},
            {'unitId': ['required', 'maxLength']},
        ]);

        this.model = this.fb.group({
            warehouseId: [this.warehouseId],
            productId: [this.warehouseLimit.productId, [Validators.required, Validators.maxLength(50)]],
            productName: [this.warehouseLimit.productName, [Validators.required, Validators.maxLength(50)]],
            quantity: [this.warehouseLimit.quantity, [Validators.required, this.numberValidator.isValid,
                this.numberValidator.lessThan(2147483648), this.numberValidator.greaterThan(0)]],
            unitId: [this.warehouseLimit.unitId, [Validators.required, Validators.maxLength(50)]],
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    resetForm() {
        this.id = null;
        this.model.patchValue({
            productId: '',
            productName: '',
            quantity: 0,
            unitId: '',
        });
        this.clearFormError(this.formErrors);
    }
}
