import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { IPageId, PAGE_ID } from '../../../../../configs/page-id.config';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { Product } from '../model/product.model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilService } from '../../../../../shareds/services/util.service';
import { ProductImage } from '../model/product-image.model';
import { ProductTranslation } from '../model/product-translation.model';
import { ProductService } from '../service/product.service';
import { TreeData } from '../../../../../view-model/tree-data';
import * as _ from 'lodash';
import { ProductCategoryService } from '../../product-category/service/product-category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductDetailViewModel } from '../viewmodel/product-detail.viewmodel';
import { NhTabComponent } from '../../../../../shareds/components/nh-tab/nh-tab.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { NumberValidator } from '../../../../../validators/number.validator';
import { ProductCategoryViewModel } from '../viewmodel/product-category.viewmodel';
import { ProductFormAttributeComponent } from '../product-form/product-attribute/product-form-attribute.component';
import { ProductUnitComponent } from '../product-form/product-unit/product-unit.component';
import { ProductConversionUnit } from '../product-form/product-unit/model/product-conversion-unit.model';
import { ProductAttribute } from '../product-form/product-attribute/model/product-value.model';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-detail.component.html',
    styleUrls: ['../product.scss'],
    providers: [UtilService, NumberValidator]
})

export class ProductDetailComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild(ProductUnitComponent) productUnitComponent: ProductUnitComponent;
    @ViewChild(ProductFormAttributeComponent) productAttributeComponent: ProductFormAttributeComponent;
    @ViewChild(NhTabComponent) nhTabComponent: NhTabComponent;
    @ViewChild('productFormModal') productFormModal: NhModalComponent;
    product = new Product();
    categoryTree: TreeData[];
    categoryText;
    categories: any[];
    productImages: ProductImage[] = [];
    modelTranslation = new ProductTranslation();
    listProductValue: ProductAttribute[] = [];
    conversionFormErrors: any = {};
    conversionValidationMessages: any = {};
    attributeFormErrors: any = {};
    attributeValidationMessages: any = {};
    conversionUnits = [];
    attributes = [];


    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private numberValidator: NumberValidator,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private route: ActivatedRoute,
                private router: Router,
                private productCategoryService: ProductCategoryService,
                private productService: ProductService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.PRODUCT, 'Quản lý sản phẩm', 'Quản lý sản phẩm');
    }

    ngAfterViewInit() {
        this.reloadTree();
    }

    onProductAttributeValueSelected(selectedAttributeValue: any, attributeFormControl: FormControl, index: number) {
        const count = _.countBy(attributeFormControl.get('attributeValues').value, (attributeValue: NhSuggestion) => {
            return attributeValue.id === selectedAttributeValue.id;
        }).true;
        if (count) {
            this.toastr.warning('Giá trị thuộc tính đã tồn tại. Vui lòng kiểm tra lại.');
            attributeFormControl.patchValue({attributeId: null, productAttributeName: null});
            return;
        }
        attributeFormControl.patchValue({
            productAttributeValues: selectedAttributeValue.map((attribute: NhSuggestion) => {
                return {
                    id: attribute.id,
                    name: attribute.name
                };
            })
        });
        // if (this.isUpdate) {
        //     this.saveAttribute(attributeFormControl, index);
        // }
    }

    onProductAttributeValueRemoved(attributeFormControl: FormControl) {
    }

    add() {
        this.productFormModal.open();
    }

    show(productId: string) {
        this.id = productId;
        this.isUpdate = true;
        this.getDetail(productId);
    }

    removeThumbnail() {
        this.model.patchValue({thumbnail: ''});
    }

    removeImage(productImage: ProductImage) {
        if (productImage.isThumbnail) {
            this.model.patchValue({thumbnail: ''});
        }
        _.remove(this.productImages, (item: ProductImage) => {
            return item.url === productImage.url;
        });
    }

    clickTabProductUnit(value) {
        this.productUnitComponent.renderListUnit();
    }

    clickTabProductAttribute(value) {
        this.productAttributeComponent.getProductAttribute();
    }

    reloadTree() {
        this.productCategoryService.getTree().subscribe((result: TreeData[]) => {
            this.categoryTree = result;
        });
    }

    checkThumbnail(item: ProductImage) {
        if (!item.isThumbnail) {
            _.each(this.productImages, (image: ProductImage) => {
                image.isThumbnail = false;
            });
            this.product.thumbnail = item.url;
            // this.model.patchValue({thumbnail: item.url});
        }
        item.isThumbnail = !item.isThumbnail;
    }

    private buildConversionForm(index: number, conversionUnit?: ProductConversionUnit) {
        this.conversionFormErrors[index] = this.renderFormError(['unitId', 'value']);
        this.conversionValidationMessages[index] = this.renderFormErrorMessage([
            {unitId: ['required']},
            {value: ['isValid']}
        ]);
        const conversionModel = this.formBuilder.group({
            unitId: [conversionUnit ? conversionUnit.unitId : '', [
                Validators.required
            ]],
            unitName: [conversionUnit ? conversionUnit.unitName : ''],
            salePrice: [conversionUnit ? conversionUnit.salePrice : null],
            conversionUnitId: [conversionUnit ? conversionUnit.conversionUnitId : this.model.value.unitId],
            conversionUnitName: [conversionUnit ? conversionUnit.conversionUnitName : ''],
            value: [conversionUnit ? conversionUnit.value : null, [
                this.numberValidator.isValid
            ]],
        });
        conversionModel.valueChanges.subscribe(() => this.validateFormGroup(conversionModel, this.conversionFormErrors[index],
            this.conversionValidationMessages[index], false));
        return conversionModel;
    }

    private buildAttributeForm(index: number, productValue?: ProductAttribute) {
        this.attributeFormErrors[index] = this.renderFormError(['unitId', 'value', 'productAttributeValues']);
        this.attributeValidationMessages[index] = this.renderFormErrorMessage([
            {unitId: ['required']},
            {value: ['isValid']},
            {productAttributeValues: ['required']},
        ]);
        const attributeModel = this.formBuilder.group({
            attributeId: [productValue ? productValue.attributeId : '', [
                Validators.required
            ]],
            attributeName: [productValue ? productValue.attributeName : ''],
            value: [productValue ? productValue.value : ''],
            isSelfContent: [productValue ? productValue.isSelfContent : false],
            isMultiple: [productValue ? productValue.isMultiple : false],
            isShowClient: [productValue ? productValue.isShowClient : false],
            attributeValues: [productValue ? productValue.attributeValues : [], [
                Validators.required
            ]],
        });
        attributeModel.valueChanges.subscribe(() => this.validateFormGroup(attributeModel, this.attributeFormErrors[index],
            this.attributeValidationMessages[index], false));
        return attributeModel;
    }

    private getDetail(productId: string) {
        this.productFormModal.open();
        this.subscribers.getDetail = this.productService.getDetail(productId)
            .subscribe((result: ProductDetailViewModel) => {
                this.product = {
                    unitId: result.unitId,
                    unitName: result.unitName,
                    isActive: result.isActive,
                    isManagementByLot: result.isManagementByLot,
                    salePrice: result.salePrice,
                    translations: result.translations,
                    concurrencyStamp: result.concurrencyStamp,
                    thumbnail: result.thumbnail,
                    images: result.images
                } as Product;
                this.productImages = result.images;
                if (result.categories) {
                    this.categories = result.categories;
                }
                if (result.conversionUnits && result.conversionUnits.length > 0) {
                    this.conversionUnits = result.conversionUnits;
                    // result.conversionUnits.forEach((conversionUnit: ProductConversionUnit) => {
                    //     this.conversionUnits.push(this.buildConversionForm(index, conversionUnit));
                    //     index++;
                    // });
                }
                if (result.attributes) {
                    const groups = _.groupBy(result.attributes, 'attributeId');
                    if (groups) {
                        // this.attributes.removeAt(0);
                        let index = 0;
                        for (const key in groups) {
                            if (groups.hasOwnProperty(key)) {
                                const groupItem: ProductAttribute = groups[key][0];
                                const productAttributeValue: ProductAttribute = {
                                    id: groupItem.id,
                                    attributeId: groupItem.attributeId,
                                    attributeName: groupItem.attributeName,
                                    value: groupItem.value,
                                    isSelfContent: groupItem.isSelfContent,
                                    isMultiple: groupItem.isMultiple,
                                    isShowClient: groupItem.isShowClient,
                                    attributeValues: groups[key].map((group: ProductAttribute) => {
                                        return {
                                            id: group.attributeValueId,
                                            name: group.attributeValueName
                                        };
                                    })
                                };
                                // this.attributes.push(this.buildAttributeForm(index, productAttributeValue));
                                this.attributes = [...this.attributes, productAttributeValue];
                            }
                            index++;
                        }
                    }
                }
                if (result.images) {
                    this.productImages = result.images;
                    _.each(this.productImages, (image: ProductImage) => {
                        if (image.url === result.thumbnail) {
                            image.isThumbnail = true;
                        } else {
                            image.isThumbnail = false;
                        }
                    });
                }
            });
    }
}
