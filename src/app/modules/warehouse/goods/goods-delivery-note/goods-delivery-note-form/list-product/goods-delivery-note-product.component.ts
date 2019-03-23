import { AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ProductService } from '../../../../product/product/service/product.service';
import { NhSuggestion } from '../../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { SearchResultViewModel } from '../../../../../../shareds/view-models/search-result.viewmodel';
import { BaseFormComponent } from '../../../../../../base-form.component';
import { FormBuilder, Validators } from '@angular/forms';
import { UtilService } from '../../../../../../shareds/services/util.service';
import { GoodsDeliveryNoteDetail } from '../../model/goods-delivery-note-details.model';
import { NumberValidator } from '../../../../../../validators/number.validator';
import { APP_CONFIG, IAppConfig } from '../../../../../../configs/app.config';
import * as _ from 'lodash';
import { GoodsDeliveryNoteService } from '../../goods-delivery-note.service';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ActionResultViewModel } from '../../../../../../shareds/view-models/action-result.viewmodel';
import { DeliveryType } from '../../../../../../shareds/constants/deliveryType.const';
import { ProductInfoDeliveryViewModel } from '../../viewmodel/product-info-delivery.viewmodel';
import { ProductSuggestionComponent } from '../../../../product/product/product-suggestion/product-suggestion.component';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { GoodsReceiptNoteService } from '../../../goods-receipt-note/goods-receipt-note.service';
import {environment} from '../../../../../../../environments/environment';

@Component({
    selector: 'app-goods-delivery-note-product',
    templateUrl: './goods-delivery-note-product.component.html',
    providers: [NumberValidator]
})

export class GoodsDeliveryNoteProductComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild('confirmDeleteGoodsDeliveryNotesDetail') swalConfirmDelete: SwalComponent;
    @ViewChild(ProductSuggestionComponent) productSuggestion: ProductSuggestionComponent;
    @Input() goodsDeliveryNoteId: string;
    @Input() warehouseId: string;
    @Input() totalAmounts;
    @Input() totalQuantity;
    @Input() deliveryType;
    @Input() deliveryDate;
    @Input() readonly = false;
    @Output() selectProduct = new EventEmitter();
    @Output() totalAmountChanged = new EventEmitter();
    currentPage = 1;
    pageSize = 10;
    totalRows;
    listProductSuggestion: NhSuggestion[];
    goodsDeliveryNoteDetail = new GoodsDeliveryNoteDetail();
    units = [];
    urlSearchProduct;
    keyword;
    isSearching;
    goodsDeliveryNoteDetailId;
    productId;
    calculatorMethod;
    selectedUnit: NhSuggestion<string>;
    oldQuantity: number;
    oldUnitId: string;
    oldUnitName: string;
    oldRecommendedQuantity: number;

    private _listGoodsDeliveryNoteDetail: GoodsDeliveryNoteDetail[] = [];

    @Input()
    set listGoodsDeliveryNoteDetail(value: GoodsDeliveryNoteDetail[]) {
        this._listGoodsDeliveryNoteDetail = value;
        this.calculateAmount();
    }

    get listGoodsDeliveryNoteDetail() {
        return this._listGoodsDeliveryNoteDetail;
    }

    constructor(@Inject(APP_CONFIG) private appConfig: IAppConfig,
                private productService: ProductService,
                private numberValidator: NumberValidator,
                private fb: FormBuilder,
                private utilService: UtilService,
                private toastr: ToastrService,
                private goodsDeliveryNoteService: GoodsDeliveryNoteService,
                private goodsReceiptNoteService: GoodsReceiptNoteService) {
        super();
        this.urlSearchProduct = `${environment.apiGatewayUrl}api/v1/warehouse/products`;
    }

    ngOnInit() {
        this.buildForm();
        this.getProduct();
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.confirm();
        });
    }

    updateQuantity(goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail) {
        if (this.oldQuantity === goodsDeliveryNoteDetail.quantity) {
            return;
        }
        if (goodsDeliveryNoteDetail.quantity > goodsDeliveryNoteDetail.inventoryQuantity) {
            this.toastr.warning('Số lượng thực xuất phải nhỏ hơn số lượng tồn kho.');
            return;
        }
        if (goodsDeliveryNoteDetail.quantity.toString() === '') {
            this.toastr.error('Số lượng thực tế phải là số.');
            return;
        }
        if (goodsDeliveryNoteDetail.quantity <= 0) {
            this.toastr.error('Số lượng thức tế phải lớn hơn 0.');
            return;
        }
        if (!goodsDeliveryNoteDetail.quantity) {
            this.toastr.error('Số lượng phải lớn hơn 0');
            return;
        }
        if (this.goodsDeliveryNoteId) {
            this.subscribers.updateQuantity = this.goodsDeliveryNoteService.updateDetail(this.goodsDeliveryNoteId,
                goodsDeliveryNoteDetail.id, goodsDeliveryNoteDetail)
                .subscribe((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    goodsDeliveryNoteDetail.concurrencyStamp = result.data;
                }, () => {
                    goodsDeliveryNoteDetail.quantity = this.oldQuantity;
                });
        }
        goodsDeliveryNoteDetail.totalAmounts = goodsDeliveryNoteDetail.quantity * goodsDeliveryNoteDetail.conversionPrice;
        this.calculateAmount();
    }

    updateRecommendedQuantity(goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail) {
        if (this.oldRecommendedQuantity === goodsDeliveryNoteDetail.recommendedQuantity) {
            return;
        }
        if (goodsDeliveryNoteDetail.recommendedQuantity.toString() === '') {
            this.toastr.error('Số lượng yêu cầu phải là số.');
            return;
        }
        if (this.goodsDeliveryNoteId) {
            this.subscribers.updateRecommendedQuantity = this.goodsDeliveryNoteService.updateRecommendedQuantity(goodsDeliveryNoteDetail.id,
                goodsDeliveryNoteDetail.recommendedQuantity, goodsDeliveryNoteDetail.concurrencyStamp)
                .subscribe((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    goodsDeliveryNoteDetail.concurrencyStamp = result.data;
                });
        }
    }

    edit(value: GoodsDeliveryNoteDetail) {
        this.isUpdate = true;
        this.goodsDeliveryNoteDetailId = value.id;
        this.productId = value.productId;
        this.model.patchValue(value);
        this.model.patchValue({warehouseId: this.warehouseId, deliveryDate: this.deliveryDate});
        this.utilService.focusElement('quantityUpdate');
        this.getProductUnit(value.productId);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.goodsDeliveryNoteService.searchProduct(this.goodsDeliveryNoteId, this.keyword, this.currentPage, 1000)
            .subscribe((result: SearchResultViewModel<GoodsDeliveryNoteDetail>) => {
                this.listGoodsDeliveryNoteDetail = result.items;
                this.totalRows = result.totalRows;
                this.calculateAmount();
            });
    }

    resetFormSearch() {
        this.keyword = '';
        this.search(1);
    }

    searchProduct(value) {
        this.productService.suggestions(value, 20).subscribe((result: SearchResultViewModel<NhSuggestion>) => {
            this.listProductSuggestion = result.items;
        });
    }

    selectProductInForm(value: NhSuggestion) {
        if (value) {
            const existsProduct = _.find(this.listGoodsDeliveryNoteDetail, (item: GoodsDeliveryNoteDetail) => {
                return item.productId === value.id;
            });

            if (existsProduct && !this.isUpdate) {
                this.toastr.error('Product already exists');
                this.model.patchValue({productId: ''});
                return;
            } else {
                this.utilService.focusElement('quantity');
                this.model.patchValue({productName: value.name, productId: value.id, totalAmounts: 0});
                this.getProductUnit(value.id.toString());
            }
        }
    }

    getProductUnit(productId: string) {
        this.goodsDeliveryNoteService.getProductInfoDelivery(this.warehouseId ? this.warehouseId : '', productId)
            .subscribe((result: ActionResultViewModel<ProductInfoDeliveryViewModel>) => {
                const data = result.data;
                if (data) {
                    this.units = data.units;
                    this.calculatorMethod = data.calculatorMethod;
                    this.model.patchValue({unitId: data.unitDefaultId, unitName: data.unitDefaultName});
                    if (this.deliveryType === DeliveryType.retail) {
                        this.model.patchValue({price: data.priceRetail});
                    } else {
                        this.model.patchValue({price: data.exWarehousePrice});
                    }
                }
            });
    }

    onUnitSelected(goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail, unit: any) {
        this.oldUnitId = goodsDeliveryNoteDetail.unitId;
        this.oldUnitName = goodsDeliveryNoteDetail.unitName;
        goodsDeliveryNoteDetail.unitId = unit.unitId;
        goodsDeliveryNoteDetail.unitName = unit.name;
        const conversion = unit.conversionValue;
        if (conversion > 0) {
            if (unit.isDefault) {
                goodsDeliveryNoteDetail.conversionInventory = goodsDeliveryNoteDetail.inventoryQuantity;
                goodsDeliveryNoteDetail.conversionPrice = goodsDeliveryNoteDetail.price;
                goodsDeliveryNoteDetail.totalAmounts = goodsDeliveryNoteDetail.quantity * goodsDeliveryNoteDetail.price;
            } else {
                goodsDeliveryNoteDetail.conversionInventory = goodsDeliveryNoteDetail.inventoryQuantity / conversion;
                goodsDeliveryNoteDetail.conversionPrice = conversion * goodsDeliveryNoteDetail.price;
                goodsDeliveryNoteDetail.totalAmounts = goodsDeliveryNoteDetail.quantity * goodsDeliveryNoteDetail.conversionPrice;
            }
            this.calculateAmount();
        }
        if (this.goodsDeliveryNoteId) {
            this.goodsDeliveryNoteService.updateDetail(this.goodsDeliveryNoteId, goodsDeliveryNoteDetail.id, goodsDeliveryNoteDetail)
                .subscribe((result: ActionResultViewModel) => {
                    this.toastr.success(result.message);
                    goodsDeliveryNoteDetail.concurrencyStamp = result.data;
                }, () => {
                    goodsDeliveryNoteDetail.unitId = this.oldUnitId;
                    goodsDeliveryNoteDetail.unitName = this.oldUnitName;
                });
        }
    }


    onLotKeyPressed(keyword: string) {
        this.model.patchValue({lotId: keyword});
    }

    onLotSelected(lot: NhSuggestion) {
        if (lot) {
            this.model.patchValue({lotId: lot.id});
        }
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.goodsDeliveryNoteDetail = this.model.value;
            this.goodsDeliveryNoteDetail.totalAmounts = this.goodsDeliveryNoteDetail.quantity * this.goodsDeliveryNoteDetail.price;

            if (this.goodsDeliveryNoteDetail.inventoryQuantity < 1) {
                this.goodsDeliveryNoteDetail.quantity = this.goodsDeliveryNoteDetail.conversionInventory;
            } else if (this.goodsDeliveryNoteDetail.quantity > this.goodsDeliveryNoteDetail.inventoryQuantity) {
                this.toastr.warning('Số lượng thực xuất phải nhỏ hơn số lượng tồn kho.');
                return;
            }
            if (this.goodsDeliveryNoteId) {
                if (this.isUpdate) {
                    this.goodsDeliveryNoteService.updateProduct(this.goodsDeliveryNoteId, this.goodsDeliveryNoteDetailId,
                        this.goodsDeliveryNoteDetail).subscribe(() => {
                        this.resetForm();
                        this.search(1);
                    });
                } else {
                    this.goodsDeliveryNoteService.insertProduct(this.goodsDeliveryNoteId, this.goodsDeliveryNoteDetail)
                        .subscribe((result: ActionResultViewModel<any>) => {
                            this.resetForm();
                            this.id = result.data;
                            this.goodsDeliveryNoteDetail.id = result.data.id;
                            this.goodsDeliveryNoteDetail.concurrencyStamp = result.data.concurrencyStamp;
                            this.listGoodsDeliveryNoteDetail = [...this.listGoodsDeliveryNoteDetail,
                                _.cloneDeep(this.goodsDeliveryNoteDetail)];
                            this.calculateAmount();
                        });
                }
            } else {
                if (this.isUpdate) {
                    const goodsDeliveryNoteDetails = _.filter(this.listGoodsDeliveryNoteDetail, (detail: GoodsDeliveryNoteDetail) => {
                        return detail.productId === this.productId;
                    });

                    if (goodsDeliveryNoteDetails) {
                        const value = goodsDeliveryNoteDetails[0];
                        value.unitId = this.goodsDeliveryNoteDetail.unitId;
                        value.unitName = this.goodsDeliveryNoteDetail.unitName;
                        value.price = this.goodsDeliveryNoteDetail.price;
                        value.totalAmounts = this.goodsDeliveryNoteDetail.totalAmounts;
                        value.quantity = this.goodsDeliveryNoteDetail.quantity;
                        this.calculateAmount();
                        // this.selectProduct.emit(this.listGoodsDeliveryNoteDetail);
                        this.resetForm();
                        // _.each(this.listGoodsDeliveryNoteDetail, (goodsDeliveryDetail: GoodsDeliveryNoteDetail) => {
                        //     goodsDeliveryDetail.isEdit = false;
                        // });
                    }
                } else {
                    this.listGoodsDeliveryNoteDetail = [...this.listGoodsDeliveryNoteDetail, _.cloneDeep(this.goodsDeliveryNoteDetail)];
                    this.resetForm();
                    this.calculateAmount();
                    // this.selectProduct.emit(this.listGoodsDeliveryNoteDetail);
                }
            }
        }
    }

    cancel() {
        this.isUpdate = false;
        this.resetForm();
        // _.each(this.listGoodsDeliveryNoteDetail, (item: GoodsDeliveryNoteDetail) => {
        //     item.isEdit = false;
        // });
    }

    confirm() {
        this.goodsDeliveryNoteDetailId = this.goodsDeliveryNoteDetail.id;
        this.productId = this.goodsDeliveryNoteDetail.productId;
        this.goodsDeliveryNoteService.deleteDetail(this.goodsDeliveryNoteId, this.goodsDeliveryNoteDetail.id)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                _.remove(this.listGoodsDeliveryNoteDetail, this.goodsDeliveryNoteDetail);
            });
    }

    remove(goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail) {
        this.goodsDeliveryNoteDetail = goodsDeliveryNoteDetail;
        if (this.goodsDeliveryNoteId) {
            this.swalConfirmDelete.show();
        } else {
            this.listGoodsDeliveryNoteDetail.splice(_.indexOf(this.listGoodsDeliveryNoteDetail, goodsDeliveryNoteDetail), 1);
        }
    }

    private calculateAmount() {
        if (this.listGoodsDeliveryNoteDetail && this.listGoodsDeliveryNoteDetail.length > 0) {
            this.calculateTotalAmounts();
            this.totalAmountChanged.emit(this.totalAmounts);
        } else {
            this.totalAmountChanged.emit(0);
        }
    }

    private calculatorTotalAmount(quantity: number) {
        const price = this.model.value.price;
        this.totalAmounts = price && quantity ? price * quantity : 0;
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['goodsReceiptNoteDetailCode', 'productId', 'quantity', 'unitId']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'goodsReceiptNoteDetailCode': ['required', 'maxlength']},
            {'productId': ['required']},
            {'quantity': ['required', 'isValid', 'lessThan', 'greaterThan']},
            {'discountPrice': ['isValid', 'greaterThan']},
            {'discountByPercent': ['isValid', 'lessThan', 'greaterThan']},
            {'recommendedQuantity': ['isValid', 'lessThan', 'greaterThan']},
            {'realQuantity': ['isValid', 'lessThan', 'greaterThan']},
            {'unitId': ['required']},
        ]);
        this.model = this.fb.group({
            goodsReceiptNoteDetailCode: [this.goodsDeliveryNoteDetail.goodsReceiptNoteDetailCode, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            goodsDeliveryNoteId: [this.goodsDeliveryNoteId],
            warehouseId: [this.warehouseId],
            deliveryDate: [this.deliveryDate],
            productId: [this.goodsDeliveryNoteDetail.productId, [Validators.required]],
            productName: [this.goodsDeliveryNoteDetail.productName],
            quantity: [this.goodsDeliveryNoteDetail.quantity, [Validators.required, this.numberValidator.isValid,
                this.numberValidator.lessThan(2147483648), this.numberValidator.greaterThan(0)]],
            unitId: [this.goodsDeliveryNoteDetail.unitId, [Validators.required]],
            unitName: [this.goodsDeliveryNoteDetail.unitName],
            price: [this.goodsDeliveryNoteDetail.price],
            expiredDate: [this.goodsDeliveryNoteDetail.expiredDate],
            totalAmounts: [this.goodsDeliveryNoteDetail.totalAmounts],
            discountPrice: [this.goodsDeliveryNoteDetail.discountPrice, [this.numberValidator.isValid,
                this.numberValidator.greaterThan(0)]],
            discountByPercent: [this.goodsDeliveryNoteDetail.discountByPercent, [this.numberValidator.isValid,
                this.numberValidator.lessThan(100), this.numberValidator.greaterThan(0)]],
            recommendedQuantity: [this.goodsDeliveryNoteDetail.recommendedQuantity, [this.numberValidator.isValid,
                this.numberValidator.lessThan(2147483648), this.numberValidator.greaterThan(0)]],
            lotId: [this.goodsDeliveryNoteDetail.lotId],
            concurrencyStamp: [this.goodsDeliveryNoteDetail.concurrencyStamp],
            inventoryQuantity: [this.goodsDeliveryNoteDetail.inventoryQuantity],
            conversionInventory: [this.goodsDeliveryNoteDetail.conversionInventory],
            conversionPrice: [this.goodsDeliveryNoteDetail.conversionPrice],
            units: [[]]
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.isUpdate = false;
        this.id = null;
        this.model.patchValue({
            productId: '',
            productName: '',
            quantity: '',
            unitId: '',
            unitName: '',
            price: '',
            expiredDate: '',
            lotId: '',
            recommendedQuantity: '',
            inventoryQuantity: null,
            goodsReceiptNoteDetailCode: '',
            conversionInventory: null,
            conversionPrice: null,
            units: []
        });
        if (this.productSuggestion) {
            this.productSuggestion.clear();
        }
        this.clearFormError(this.formErrors);
    }

    private getProduct() {
        this.subscribers.getCode = this.model.get('goodsReceiptNoteDetailCode')
            .valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe((value: any) => {
                if (!value) {
                    return;
                }
                if (!this.warehouseId) {
                    this.toastr.warning('Vui lòng chọn kho xuất.');
                    return;
                }
                if (this.deliveryType == null || this.deliveryType === undefined) {
                    this.toastr.warning('Vui lòng chọn hình thức xuất.');
                    return;
                }
                this.goodsReceiptNoteService.getProductInfoByCode(value, this.warehouseId, this.deliveryType, this.deliveryDate)
                    .pipe(finalize(() => this.model.patchValue({'goodsReceiptNoteDetailCode': ''})))
                    .subscribe((result: any) => {
                        this.goodsDeliveryNoteDetail = new GoodsDeliveryNoteDetail(null, result.code, result.productId, result.productName,
                            result.warehouseId, result.warehouseName, result.unitId, result.unitName, result.price, 1,
                            0, result.lotId, result.inventoryQuantity, value.toUpperCase(), '', result.units);
                        // this.goodsDeliveryNoteDetail.realInventoryQuantity = result.realInventoryQuantity;
                        this.model.patchValue(this.goodsDeliveryNoteDetail);
                        this.save();
                    });
            });
    }

    private calculateTotalAmounts() {
        this.totalAmounts = _.sumBy(this.listGoodsDeliveryNoteDetail, (item: GoodsDeliveryNoteDetail) => {
            return parseFloat((item.totalAmounts ? item.totalAmounts : 0).toString());
        });
    }
}
