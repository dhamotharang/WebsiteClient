import {AfterViewInit, Component, enableProdMode, Inject, OnInit, ViewChild} from '@angular/core';
import {Product} from '../model/product.model';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductImage} from '../model/product-image.model';
import {ProductTranslation} from '../model/product-translation.model';
import {finalize} from 'rxjs/operators';
import {ProductService} from '../service/product.service';
import * as _ from 'lodash';
import {ProductCategoryService} from '../../product-category/service/product-category-service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ProductDetailViewModel} from '../viewmodel/product-detail.viewmodel';
import {ProductUnitComponent} from './product-unit/product-unit.component';
import {ProductConversionUnit} from './product-unit/model/product-conversion-unit.model';
import {ProductFormAttributeComponent} from './product-attribute/product-form-attribute.component';
import {ProductAttribute} from './product-attribute/model/product-value.model';
import {ProductCategoryViewModel} from '../viewmodel/product-category.viewmodel';
import {NumberValidator} from '../../../../validators/number.validator';
import {NhTabComponent} from '../../../../shareds/components/nh-tab/nh-tab.component';
import {environment} from '../../../../../environments/environment';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {BaseFormComponent} from '../../../../base-form.component';
import {TreeData} from '../../../../view-model/tree-data';
import {NhSuggestion} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {Pattern} from '../../../../shareds/constants/pattern.const';
import {ProductAttributeService} from '../../product-attribute/product-attribute.service';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ProductAttributeViewModel} from '../../product-attribute/product-attribute.viewmodel';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }

declare var tinyMCE;

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
    @ViewChild('productFormModal') productFormModal: NhModalComponent;
    product = new Product();
    categoryTree: TreeData[];
    categoryText;
    categories: number[];
    productImages: ProductImage[] = [];
    modelTranslation = new ProductTranslation();
    listProductAttribute: ProductAttributeViewModel[] = [];
    conversionFormErrors: any = {};
    conversionValidationMessages: any = {};
    attributeFormErrors: any = {};
    attributeValidationMessages: any = {};
    urlFile = `${environment.fileUrl}`;
    thumbnail = '';

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private numberValidator: NumberValidator,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private route: ActivatedRoute,
                private router: Router,
                private productAttributeService: ProductAttributeService,
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
        this.renderForm();
        this.addConversionUnit();
        this.addAttribute();
    }

    ngAfterViewInit() {
        this.reloadTree();
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
            conversionUnitControl.patchValue({unitId: unit.id, unitName: unit.name});
            this.utilService.focusElement(`conversionValue${index}`);
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
            return formControl.value && !formControl.value.attributeId;
        });

        if (!defaultFormControl) {
            this.addAttribute();
        }
    }

    onProductAttributeValueSelected(selectedAttributeValue: any, attributeFormControl: FormControl, index: number) {
        if (attributeFormControl.get('isMultiple').value) {
            const count = _.countBy(attributeFormControl.get('attributeValues').value, (attributeValue: NhSuggestion) => {
                return attributeValue.id === selectedAttributeValue.id;
            }).true;
            if (count) {
                this.toastr.warning('Giá trị thuộc tính đã tồn tại. Vui lòng kiểm tra lại.');
                attributeFormControl.patchValue({attributeId: null, productAttributeName: null});
                return;
            }
            attributeFormControl.patchValue({
                attributeValues: selectedAttributeValue.map((attribute: NhSuggestion) => {
                    return {
                        id: attribute.id,
                        name: attribute.name
                    };
                })
            });
        } else {
            attributeFormControl.patchValue({
                attributeValues: []
            });
            attributeFormControl.patchValue({
                attributeValues: [{id: selectedAttributeValue.id, name: selectedAttributeValue.name}]
            });
        }
    }

    onAProductAttributeValueAdded(selectedAttributeValue: any, attributeFormControl: FormControl, index: number) {
        if (attributeFormControl.get('isMultiple').value) {
            let productAttributeValues = attributeFormControl.get('attributeValues').value;
            if (!productAttributeValues) {
                productAttributeValues = [];
            }
            productAttributeValues.push(selectedAttributeValue);

            attributeFormControl.patchValue({
                attributeValues: productAttributeValues.map((attribute: NhSuggestion) => {
                    return {
                        id: attribute.id,
                        name: attribute.name
                    };
                })
            });
        } else {
            attributeFormControl.patchValue({
                attributeValues: []
            });
            attributeFormControl.patchValue({
                attributeValues: [{id: selectedAttributeValue.id, name: selectedAttributeValue.name}]
            });
        }
    }

    add() {
        this.productFormModal.open();
        this.initProductAttribute();
    }

    edit(productId: string) {
        this.id = productId;
        this.isUpdate = true;
        this.productAttributeService.search('', null, null, true, 1, 20)
            .subscribe((result: SearchResultViewModel<ProductAttributeViewModel>) => {
                this.listProductAttribute = result.items;
                this.getDetail(productId);
            });
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
            this.product.conversionUnits = _.filter(this.product.conversionUnits, (productConversionUnit: ProductConversionUnit) => {
                return productConversionUnit.unitId;
            });

            const attributeRequired = _.find(this.product.attributes, (productAttributeValue: ProductAttribute) => {
                return productAttributeValue.isRequired
                    && (((!productAttributeValue.attributeValues || productAttributeValue.attributeValues.length === 0)
                        && !productAttributeValue.isSelfContent)
                        || (productAttributeValue.isSelfContent && !productAttributeValue.value));
            });

            if (attributeRequired) {
                this.toastr.error(`${attributeRequired.attributeName} chưa nhập giá trí`);
                return;
            }

            this.product.attributes = _.filter(this.product.attributes, (productAttributeValue: ProductAttribute) => {
                return productAttributeValue.attributeId
                    && ((productAttributeValue.attributeValues
                        && productAttributeValue.attributeValues.length > 0 && !productAttributeValue.isSelfContent)
                        || (productAttributeValue.isSelfContent && productAttributeValue.value));
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
                const existsProductImage = _.find(this.productImages, (productImage: ProductImage) => {
                    return productImage.url === file.url;
                });

                if (existsProductImage || !file.isImage) {
                    this.toastr.error('Product image already exists or File have select not is image');
                    return;
                } else {
                    this.productImages.push(new ProductImage(this.id, '', file.url));
                }
            });

            const existsProductThumbnail = _.find(this.productImages, (productImage: ProductImage) => {
                return productImage.isThumbnail;
            });

            if (!existsProductThumbnail) {
                this.thumbnail = files[0].url;
            }

            this.model.patchValue({images: this.productImages});
        }
    }

    selectProductImage(file: ExplorerItem) {
        const existsProductImage = _.find(this.productImages, (productImage: ProductImage) => {
            return productImage.url === file.url;
        });

        if (existsProductImage || !file.isImage) {
            this.toastr.error('Product image already exists or File have select not is image');
            return;
        } else {
            this.productImages.push(new ProductImage(this.id, '', file.url));
        }

        const existsProductThumbnail = _.find(this.productImages, (productImage: ProductImage) => {
            return productImage.isThumbnail;
        });

        if (!existsProductThumbnail) {
            this.thumbnail = file.url;
        }
        this.model.patchValue({images: this.productImages});
    }

    removeThumbnail() {
        const existsProductImage = _.find(this.productImages, (productImage: ProductImage) => {
            return productImage.isThumbnail;
        });

        if (existsProductImage) {
            existsProductImage.isThumbnail = false;
        }

        this.model.patchValue({thumbnail: ''});
        this.thumbnail = '';
    }

    removeImage(productImage: ProductImage) {
        if (productImage.isThumbnail) {
            this.model.patchValue({thumbnail: ''});
            this.thumbnail = '';
        }
        _.remove(this.productImages, (item: ProductImage) => {
            return item.url === productImage.url;
        });
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
            this.thumbnail = item.url;
        }
        item.isThumbnail = !item.isThumbnail;
    }

    afterUploadImageContent(images: ExplorerItem[]) {
        images.forEach((image) => {
            if (image.isImage) {
                const imageAbsoluteUrl = environment.fileUrl + image.url;
                tinyMCE.execCommand('mceInsertContent', false,
                    `<img class="img-responsive lazy" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}"/>`);
            }
        });
    }

    selectImage(image: ExplorerItem) {
        if (image.isImage) {
            const imageAbsoluteUrl = environment.fileUrl + image.url;
            tinyMCE.execCommand('mceInsertContent', false,
                `<img class="img-responsive lazy" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}"/>`);
        }
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['id', 'unitId', 'thumbnail', 'isManagementByLot', 'isActive',
            'categories', 'salePrice']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'id': ['maxLength', 'pattern']},
            {'unitId': ['required', 'maxLength']},
            {'thumbnail': ['maxLength']},
            {'categories': ['required']},
            {'isManagementByLot': ['required']},
            {'isActive': ['required']},
            {'salePrice': ['required', 'isValid']},
        ]);

        this.model = this.fb.group({
            id: [this.product.id, [Validators.maxLength(50),
                Validators.pattern('[a-zA-Z0-9]+([-_\\.][a-z0-9]+)*[a-z0-9]$')]],
            unitId: [this.product.unitId, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            unitName: [this.product.unitName],
            salePrice: [this.product.salePrice, [Validators.required, this.numberValidator.isValid]],
            thumbnail: [this.product.thumbnail, [Validators.maxLength(500)]],
            isManagementByLot: [this.product.isManagementByLot, [Validators.required]],
            isActive: [this.product.isActive, [Validators.required]],
            isHomePage: [this.product.isHomePage],
            isHot: [this.product.isHot],
            categories: [this.categories, [Validators.required]],
            images: [this.productImages],
            concurrencyStamp: [this.product.concurrencyStamp],
            translations: this.fb.array([]),
            conversionUnits: this.fb.array([]),
            attributes: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'description', 'content', 'seoLink']
        );
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxlength', 'pattern']},
            {description: ['maxlength']},
            {content: ['maxlength']},
            {seoLink: ['maxlength']},
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
            content: [this.modelTranslation.content, [Validators.maxLength(4000)]],
            seoLink: [this.modelTranslation.seoLink, [Validators.maxLength(256)]],
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
        this.attributeFormErrors[index] = this.renderFormError(['unitId', 'value', 'attributeValues']);
        this.attributeValidationMessages[index] = this.renderFormErrorMessage([
            {unitId: ['required']},
            {value: ['isValid']},
            {attributeValues: ['required']},
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
            isRequired: [productValue ? productValue.isRequired : false],
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
        // this.attributes.push(this.buildAttributeForm(index));
    }

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
                    id: productId,
                    categories: result.categories.map((category: any) => category.categoryId),
                    unitId: result.unitId,
                    unitName: result.unitName,
                    isActive: result.isActive,
                    isManagementByLot: result.isManagementByLot,
                    salePrice: result.salePrice,
                    translations: result.translations,
                    concurrencyStamp: result.concurrencyStamp,
                    thumbnail: result.thumbnail,
                    images: result.images,
                    isHot: result.isHot,
                    isHomePage: result.isHomePage
                });
                this.thumbnail = result.thumbnail;
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
                    this.attributes.removeAt(0);
                    let index = 0;
                    _.each(this.listProductAttribute, (productAttribute: ProductAttributeViewModel) => {
                        const groupItemInfo = _.find(groups, (group: any) => {
                            return group && group.length > 0 && group[0].attributeId === productAttribute.id;
                        });

                        if (groupItemInfo) {
                            const groupItem = groups[productAttribute.id][0];
                            const productAttributeValue: ProductAttribute = {
                                id: groupItem.id,
                                attributeId: groupItem.attributeId,
                                attributeName: groupItem.attributeName,
                                value: groupItem.value,
                                isSelfContent: groupItem.isSelfContent,
                                isMultiple: groupItem.isMultiple,
                                isShowClient: groupItem.isShowClient,
                                isRequired: productAttribute.isRequire,
                                attributeValues: groups[productAttribute.id].map((group: ProductAttribute) => {
                                    return {
                                        id: group.attributeValueId,
                                        name: group.attributeValueName
                                    };
                                })
                            };
                            this.attributes.push(this.buildAttributeForm(index, productAttributeValue));
                        } else {
                            const productAttributeValue: ProductAttribute = {
                                id: '',
                                attributeId: productAttribute.id,
                                attributeName: productAttribute.name,
                                value: null,
                                isSelfContent: productAttribute.isSelfContent,
                                isMultiple: productAttribute.isMultiple,
                                isShowClient: true,
                                isRequired: productAttribute.isRequire,
                                attributeValues: []
                            };
                            this.attributes.push(this.buildAttributeForm(index, productAttributeValue));
                        }
                        index++;
                    });
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

    private initProductAttribute() {
        this.productAttributeService.search('', null, null, true, 1, 20)
            .subscribe((result: SearchResultViewModel<ProductAttributeViewModel>) => {
                this.listProductAttribute = result.items;
                this.attributes.removeAt(0);
                let index = 0;
                _.each(this.listProductAttribute, (item: ProductAttributeViewModel) => {
                    const productAttributeValue: ProductAttribute = {
                        id: '',
                        attributeId: item.id,
                        attributeName: item.name,
                        value: null,
                        isSelfContent: item.isSelfContent,
                        isMultiple: item.isMultiple,
                        isShowClient: true,
                        isRequired: item.isRequire,
                        attributeValues: []
                    };
                    this.attributes.push(this.buildAttributeForm(index, productAttributeValue));
                    index++;
                });
                setTimeout(() => {
                    this.addAttribute();
                });
            });
    }
}
