import {AfterViewInit, Component, Inject, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { BaseFormComponent } from '../../../../../base-form.component';
import { IPageId, PAGE_ID } from '../../../../../configs/page-id.config';
import { APP_CONFIG, IAppConfig } from '../../../../../configs/app.config';
import { Product } from '../model/product.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilService } from '../../../../../shareds/services/util.service';
import { ProductImage } from '../model/product-image.model';
import { ProductTranslation } from '../model/product-translation.model';
import { Pattern } from '../../../../../shareds/constants/pattern.const';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../service/product.service';
import { TreeData } from '../../../../../view-model/tree-data';
import * as _ from 'lodash';
import { ProductCategoryService } from '../../product-category/service/product-category-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExplorerItem } from '../../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import { ToastrService } from 'ngx-toastr';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';
import { ProductDetailViewModel } from '../viewmodel/product-detail.viewmodel';
import { ProductUnitComponent } from './product-unit/product-unit.component';
import { ProductConversionUnit } from './product-unit/model/product-conversion-unit.model';
import { ProductFormAttributeComponent } from './product-attribute/product-form-attribute.component';
import { ProductAttribute } from './product-attribute/model/product-value.model';
import { NhTabComponent } from '../../../../../shareds/components/nh-tab/nh-tab.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { NumberValidator } from '../../../../../validators/number.validator';
import { ProductCategoryViewModel } from '../viewmodel/product-category.viewmodel';
import {TinymceComponent} from '../../../../../shareds/components/tinymce/tinymce.component';
import {ProductStatus} from '../contants/product-status.const';

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['../product.scss'],
    providers: [UtilService, NumberValidator]
})

export class ProductFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild(ProductUnitComponent) productUnitComponent: ProductUnitComponent;
    @ViewChild(ProductFormAttributeComponent) productAttributeComponent: ProductFormAttributeComponent;
    @ViewChild(NhTabComponent) nhTabComponent: NhTabComponent;
    @ViewChild(TinymceComponent) contentEditor: TinymceComponent;
    @ViewChild('productFormModal') productFormModal: NhModalComponent;
    product = new Product();
    categoryTree: TreeData[];
    categoryText;
    categories: number[];
    productStatus = ProductStatus;
    productImages: ProductImage[] = [];
    modelTranslation = new ProductTranslation();
    listProductValue: ProductAttribute[] = [];
    conversionFormErrors: any = {};
    conversionValidationMessages: any = {};
    attributeFormErrors: any = {};
    attributeValidationMessages: any = {};

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

    get conversionUnits(): FormArray {
        return this.model.get('conversionUnits') as FormArray;
    }

    get attributes(): FormArray {
        return this.model.get('attributes') as FormArray;
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.PRODUCT, 'Quản lý sản phẩm', 'Quản lý sản phẩm');
        this.renderForm();
        this.addConversionUnit();
        this.addAttribute();
        // this.subscribers.routerParam = this.route.params.subscribe((params: any) => {
        //         const id = params['id'];
        //         if (id) {
        //             this.id = id;
        //             this.isUpdate = true;
        //             this.productService.getDetail(id).subscribe((result: ActionResultViewModel<ProductDetailViewModel>) => {
        //                 this.productDetail = result.data;
        //                 if (this.productDetail) {
        //                     if (this.productDetail.categories) {
        //                         this.categories = [];
        //                         const listCategoryByLanguageId = _.filter(this.productDetail.categories,
        //                             (category: ProductCategoryViewModel) => {
        //                                 return category.languageId === this.currentLanguage;
        //                             });
        //
        //                         _.each(listCategoryByLanguageId, (category: ProductCategoryViewModel) => {
        //                             this.categories.push(category.categoryId);
        //                         });
        //
        //                         this.categoryText = _.join(_.map(listCategoryByLanguageId, (categoryNews: ProductCategoryViewModel) => {
        //                             return categoryNews.categoryName;
        //                         }), ', ');
        //                     }
        //                     this.model.patchValue({
        //                         id: this.productDetail.id,
        //                         categories: this.categories,
        //                         thumbnail: this.productDetail.thumbnail,
        //                         images: this.productDetail.images,
        //                         isManagementByLot: this.productDetail.isManagementByLot,
        //                         isActive: this.productDetail.isActive,
        //                         concurrencyStamp: this.productDetail.concurrencyStamp,
        //                     });
        //                     this.productImages = this.productDetail.images;
        //                     this.listProductUnit = this.productDetail.units;
        //                     this.listProductUnitConversion = this.productDetail.conversionUnits;
        //                     this.getUnitIdFromProductUnitId();
        //                     this.listProductValue = _.filter(this.productDetail.values, (productValue: ProductAttribute) => {
        //                         return productValue.languageId === this.currentLanguage;
        //                     });
        //
        //                     _.each(this.productImages, (image: ProductImage) => {
        //                         if (image.url === this.productDetail.thumbnail) {
        //                             image.isThumbnail = true;
        //                         } else {
        //                             image.isThumbnail = false;
        //                         }
        //                     });
        //                 }
        //
        //                 if (this.productDetail.translations && this.productDetail.translations.length > 0) {
        //                     this.translations.controls.forEach(
        //                         (model: FormGroup) => {
        //                             const detail = _.find(
        //                                 this.productDetail.translations,
        //                                 (productTranslation: ProductTranslation) => {
        //                                     return (
        //                                         productTranslation.languageId === model.value.languageId
        //                                     );
        //                                 }
        //                             );
        //                             if (detail) {
        //                                 model.patchValue(detail);
        //                             }
        //                         }
        //                     );
        //                 }
        //             });
        //         } else {
        //             this.resetForm();
        //         }
        //     }
        // );
        // this.utilService.focusElement('name ' + this.currentLanguage);
    }

    ngAfterViewInit() {
        this.reloadTree();
        this.contentEditor.initEditor();
    }
    onModalShown() {
        this.isModified = false;
    }

    onModalHidden() {
        this.resetForm();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    onUnitSelected(unit: any) {
        const {id, name} = unit;
        this.model.patchValue({
            unitId: id,
            unitName: name,
        });
    }

    onUnitRemoved() {
        this.model.patchValue({
            unitId: null,
            unitName: null
        });
    }

    onAcceptSelectCategory(data: TreeData[]) {
        this.categories = [];
        if (data && data.length > 0) {
            _.each(data, (tree: TreeData) => {
                this.categories.push(parseInt(tree.id));
            });
        }
        this.model.patchValue({categories: this.categories});
    }

    onConversionUnitSelected(unit: NhSuggestion, conversionUnitControl: FormControl, index: number) {
        if (unit.id === this.model.value.unitId) {
            this.toastr.warning('Đơn vị chuyển đổi phải khác đơn vị chuyển đổi.');
            return;
        }
        // Check conversion unit exists.
        const count = _.countBy(this.conversionUnits.controls, (conversion: FormControl) => {
            return conversion.get('unitId').value === unit.id;
        }).true;
        if (count) {
            this.toastr.warning('Đơn vị đã tồn tại. Vui lòng kiểm tra lại.');
            conversionUnitControl.patchValue({unitId: null, unitName: null});
            return;
        } else {
            // if (this.isUpdate) {
            //     this.saveProductUnit(conversionUnitControl.value, index);
            // } else {
            conversionUnitControl.patchValue({unitId: unit.id, unitName: unit.name});
            this.utilService.focusElement(`conversionValue${index}`);
            // }
            this.addConversionUnit();
        }
    }

    onConversionUnitRemoved(index: number) {
        this.conversionUnits.removeAt(index);
        const defaultFormControl = _.find(this.conversionUnits.controls, (control: FormControl) => {
            return !control.value.unitId;
        });
        if (!defaultFormControl) {
            this.addConversionUnit();
        }
    }

    // onConversionValueBlur(conversionUnitControl: FormControl, index: number) {
    //     if (this.isUpdate) {
    //         this.saveProductUnit(conversionUnitControl, index);
    //     }
    // }

    // onSalePriceBlur(conversionUnitControl: FormControl, index: number) {
    //     if (this.isUpdate) {
    //         // const isValid = this.validateFormGroup(conversionUnitControl, this.conversionFormErrors[index],
    //         //     this.conversionValidationMessages[index], true);
    //         // if (isValid) {
    //         //     const salePrice = conversionUnitControl.value.salePrice;
    //         //     const productUnitId = conversionUnitControl.value.productUnitId;
    //         //     const productUnitConversionId = conversionUnitControl.value.productUnitConversionId;
    //         //     this.subscribers.updateConversionSalePrice = this.productService.updateConversionUnitSalePrice(this.id, productUnitId,
    //         //         productUnitConversionId, salePrice)
    //         //         .subscribe((result: ActionResultViewModel) => {
    //         //             this.toastr.success(result.message);
    //         //         });
    //         // }
    //         // this.saveProductUnit(conversionUnitControl, index);
    //     }
    // }

    onAttributeSelected(selectedAttribute: any, attributeFormControl: FormControl, index: number) {
        const count = _.countBy(this.attributes.controls, (conversion: FormControl) => {
            return conversion.get('attributeId').value === selectedAttribute.id;
        }).true;
        if (count) {
            this.toastr.warning('Thuộc tính đã tồn tại. Vui lòng kiểm tra lại.');
            attributeFormControl.patchValue({attributeId: null, attributeName: null});
            return;
        }
        attributeFormControl.patchValue({
            attributeId: selectedAttribute.id,
            attributeName: selectedAttribute.name,
            isSelfContent: selectedAttribute.isSelfContent,
            isMultiple: selectedAttribute.isMultiple
        });
        this.utilService.focusElement(`conversionValue${index}`);
        this.addAttribute();
    }

    onAttributeRemoved(index: number) {
        this.attributes.removeAt(index);
        const defaultFormControl = _.find(this.attributes, (formControl: FormControl) => {
            return !formControl.value.attributeId;
        });

        if (!defaultFormControl) {
            this.addAttribute();
        }
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

    edit(productId: string) {
        this.id = productId;
        this.isUpdate = true;
        this.getDetail(productId);
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        const isLanguageValid = this.validateLanguage();
        if (isValid && isLanguageValid) {
            this.product = this.model.value;
            this.product.status = this.productStatus.pending;
            this.product.conversionUnits = _.filter(this.product.conversionUnits, (productConversionUnit: ProductConversionUnit) => {
                return productConversionUnit.unitId;
            });
            this.product.attributes = _.filter(this.product.attributes, (productAttributeValue: ProductAttribute) => {
                return productAttributeValue.attributeId
                    && productAttributeValue.attributeValues
                    && productAttributeValue.attributeValues.length > 0;
            });
            this.isSaving = true;
            if (this.isUpdate) {
                this.productService
                    .update(this.id, this.product)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.productFormModal.dismiss();
                        // this.router.navigate(['/products']);
                    });
            } else {
                this.productService
                    .insert(this.product)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe((result: ActionResultViewModel) => {
                        this.id = result.data;
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name ' + this.currentLanguage);
                            this.resetForm();
                        } else {
                            this.productFormModal.dismiss();
                        }
                    });
            }
        }
    }

    uploadImageProduct(files: ExplorerItem[]) {
        if (files && files.length > 0) {
            _.each(files, (file: ExplorerItem) => {
                const countByUrl = _.countBy(this.productImages, (productImage: ProductImage) => {
                    return productImage.url === file.absoluteUrl;
                }).true;

                if (countByUrl && countByUrl > 0 || !file.isImage) {
                    this.toastr.error('Product image already exists or File have select not is image');
                    return;
                } else {
                    this.productImages.push(new ProductImage(this.id, '', file.absoluteUrl));
                }
            });

            this.model.patchValue({images: this.productImages});
        }
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
            this.model.patchValue({thumbnail: item.url});
        }
        item.isThumbnail = !item.isThumbnail;
    }

    // onSelectProductListUnit(value: ProductListUnit) {
    //     this.productListUnit = value ? value : null;
    //     this.model.patchValue({productListUnit: this.productListUnit});
    // }
    //
    // private getUnitIdFromProductUnitId() {
    //     if (this.listProductUnitConversion && this.listProductUnit && this.listProductUnit.length > 0
    //         && this.listProductUnitConversion.length > 0) {
    //         _.each(this.listProductUnitConversion, (unitConversion: ProductConversionUnit) => {
    //             const productUnitById = _.filter(this.listProductUnit, (unit: ProductUnit) => {
    //                 return unit.id === unitConversion.productUnitId;
    //             });
    //
    //             if (productUnitById && productUnitById.length > 0) {
    //                 unitConversion.unitId = productUnitById[0].unitId;
    //             }
    //
    //             const productUnitConversionById = _.filter(this.listProductUnit, (unitConvert: ProductUnit) => {
    //                 return unitConvert.id === unitConversion.conversionUnitId;
    //             });
    //
    //             if (productUnitConversionById && productUnitConversionById.length > 0) {
    //                 unitConversion.conversionUnitId = productUnitConversionById[0].unitId;
    //             }
    //         });
    //     }
    // }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['unitId', 'thumbnail', 'isManagementByLot', 'isActive', 'categories', 'source']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'unitId': ['required', 'maxLength']},
            {'thumbnail': ['maxLength']},
            {'categories': ['required']},
            {'isManagementByLot': ['required']},
            {'isActive': ['required']},
            {'source': ['maxLength']}
        ]);

        this.model = this.fb.group({
            unitId: [this.product.unitId, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            unitName: [this.product.unitName],
            salePrice: [this.product.salePrice],
            thumbnail: [this.product.thumbnail, [Validators.maxLength(500)]],
            isManagementByLot: [this.product.isManagementByLot, [Validators.required]],
            isActive: [this.product.isActive, [Validators.required]],
            isHot: [this.product.isHot, [Validators.required]],
            isHomePage: [this.product.isHomePage, [Validators.required]],
            categories: [this.categories, [Validators.required]],
            images: [this.productImages],
            source: [
                this.product.source,
                [Validators.maxLength(500)]
            ],
            concurrencyStamp: [this.product.concurrencyStamp],
            translations: this.fb.array([]),
            conversionUnits: this.fb.array([]),
            attributes: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'description', 'metaKeyword', 'metaDescription', 'seoLink', 'content']
        );
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxlength', 'pattern']},
            {description: ['maxlength']},
            {metaKeyword: ['maxLength']},
            {metaDescription: ['maxLength']},
            {seoLink: ['maxLength']},
            {content: ['maxLength']}
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.modelTranslation.name,
                [Validators.required, Validators.maxLength(256), Validators.pattern(Pattern.whiteSpace)]
            ],
            description: [
                this.modelTranslation.description,
                [Validators.maxLength(500)]
            ],
            metaKeyword: [
                this.modelTranslation.metaKeyword,
                [Validators.maxLength(500)]
            ],
            metaDescription: [
                this.modelTranslation.metaDescription,
                [Validators.maxLength(500)]
            ],
            seoLink: [
                this.modelTranslation.seoLink,
                [Validators.maxLength(500)]
            ],
            content: [
                this.modelTranslation.content,
                [Validators.maxLength(4000)]
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue(new Product());
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                description: '',
            });
        });
        this.resetConversionUnit();
        this.resetAttributes();
        this.productImages = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private addConversionUnit() {
        const lastConversionUnitModel = this.conversionUnits.at(this.conversionUnits.length - 1);
        if (lastConversionUnitModel && !lastConversionUnitModel.value.unitId) {
            return;
        }
        const index = this.conversionUnits.length;
        this.conversionUnits.push(this.buildConversionForm(index));
    }

    // private saveProductUnit(conversionUnitFormControl: FormControl, index: number) {
    //     const isValid = this.validateFormGroup(conversionUnitFormControl, this.conversionFormErrors[index],
    //         this.conversionValidationMessages[index], true);
    //     if (!isValid) {
    //         return;
    //     }
    //     const conversionUnit = conversionUnitFormControl.value;
    //     this.subscribers.saveProductUnitConversion = this.productService.saveConversionUnit(this.id, conversionUnit.productUnitId,
    //         conversionUnit.productUnitConversionId, conversionUnit.value, conversionUnit.salePrice)
    //         .subscribe((result: ActionResultViewModel) => {
    //             this.toastr.success(result.message);
    //         });
    // }

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

    private addAttribute() {
        const lastAttributeModel = this.attributes.at(this.attributes.length - 1);
        if (lastAttributeModel && !lastAttributeModel.value.attributeId) {
            return;
        }
        const index = this.attributes.length;
        this.attributes.push(this.buildAttributeForm(index));
    }

    // private saveAttribute(attributeFormControl: FormControl, index: number) {
    //     const isValid = this.validateFormGroup(attributeFormControl, this.conversionFormErrors[index],
    //         this.conversionValidationMessages[index], true);
    //     if (!isValid) {
    //         return;
    //     }
    //     const attribute = attributeFormControl.value;
    //     this.subscribers.saveProductUnitConversion = this.productService.saveAttribute(this.id, attribute.attributeId,
    //         attribute.productAttributeValueId, attribute.value)
    //         .subscribe((result: ActionResultViewModel) => {
    //             this.toastr.success(result.message);
    //         });
    // }

    private resetAttributes() {
        while (this.attributes.length !== 0) {
            this.attributes.removeAt(0);
        }
        setTimeout(() => {
            this.addAttribute();
        });
    }

    private resetConversionUnit() {
        while (this.conversionUnits.length !== 0) {
            this.conversionUnits.removeAt(0);
        }
        setTimeout(() => {
            this.addConversionUnit();
        });
    }

    private getDetail(productId: string) {
        this.productFormModal.open();
        this.subscribers.getDetail = this.productService.getDetail(productId)
            .subscribe((result: ProductDetailViewModel) => {
                this.model.patchValue({
                    categories: result.categories.map((category: any) => category.categoryId),
                    unitId: result.unitId,
                    unitName: result.unitName,
                    isActive: result.isActive,
                    isManagementByLot: result.isManagementByLot,
                    salePrice: result.salePrice,
                    translations: result.translations,
                    concurrencyStamp: result.concurrencyStamp,
                    thumbnail: result.thumbnail,
                    images: result.images
                });
                this.productImages = result.images;
                if (result.categories) {
                    this.categories = [];
                    const listCategoryByLanguageId = _.filter(result.categories,
                        (category: ProductCategoryViewModel) => {
                            return category.languageId === this.currentLanguage;
                        });

                    _.each(listCategoryByLanguageId, (category: ProductCategoryViewModel) => {
                        this.categories.push(category.categoryId);
                    });

                    this.categoryText = _.join(_.map(listCategoryByLanguageId, (categoryNews: ProductCategoryViewModel) => {
                        return categoryNews.categoryName;
                    }), ', ');
                }
                if (result.conversionUnits && result.conversionUnits.length > 0) {
                    this.conversionUnits.removeAt(0);
                    let index = 0;
                    result.conversionUnits.forEach((conversionUnit: ProductConversionUnit) => {
                        this.conversionUnits.push(this.buildConversionForm(index, conversionUnit));
                        index++;
                    });
                }
                if (result.attributes) {
                    const groups = _.groupBy(result.attributes, 'attributeId');
                    if (groups) {
                        this.attributes.removeAt(0);
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
                                this.attributes.push(this.buildAttributeForm(index, productAttributeValue));
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
                setTimeout(() => {
                    this.addConversionUnit();
                    this.addAttribute();
                });
            });
    }
}
