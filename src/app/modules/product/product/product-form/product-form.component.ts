import {AfterViewInit, Component, Inject, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Product} from '../model/product.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductImage} from '../model/product-image.model';
import {ProductTranslation} from '../model/product-translation.model';
import {finalize} from 'rxjs/operators';
import {ProductService} from '../service/product.service';
import * as _ from 'lodash';
import {ProductCategoryService} from '../../product-category/service/product-category-service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {ProductDetailViewModel} from '../viewmodel/product-detail.viewmodel';
import {ProductCategoryViewModel} from '../viewmodel/product-category.viewmodel';
import {ProductUnitComponent} from './product-unit/product-unit.component';
import {ProductUnit} from './product-unit/model/product-unit.model';
import {ProductConversionUnit} from './product-unit/model/product-conversion-unit.model';
import {ProductFormAttributeComponent} from './product-attribute/product-form-attribute.component';
import {ProductValue} from './product-attribute/model/product-value.model';
import {ProductListUnit} from './product-unit/model/product-list-unit.model';
import {UtilService} from '../../../../shareds/services/util.service';
import {BaseFormComponent} from '../../../../base-form.component';
import {NhTabComponent} from '../../../../shareds/components/nh-tab/nh-tab.component';
import {TreeData} from '../../../../view-model/tree-data';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {NHTab} from '../../../../shareds/components/nh-tab/nh-tab.model';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {Pattern} from '../../../../shareds/constants/pattern.const';
import {Tag, TagType} from '../../../../shareds/components/nh-tags/tag.model';
import {TinymceComponent} from '../../../../shareds/components/tinymce/tinymce.component';

declare var tinyMCE;

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['../product.scss'],
    providers: [UtilService]
})

export class ProductFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChild(ProductUnitComponent) productUnitComponent: ProductUnitComponent;
    @ViewChild(ProductFormAttributeComponent) productAttributeComponent: ProductFormAttributeComponent;
    @ViewChildren(TinymceComponent) eventContentEditors: QueryList<TinymceComponent>;
    @ViewChild(NhTabComponent) nhTabComponent: NhTabComponent;
    product = new Product();
    categoryTree: TreeData[];
    categoryText;
    categories: number[];
    productImages: ProductImage[] = [];
    productDetail: ProductDetailViewModel;
    modelTranslation = new ProductTranslation();
    listProductUnit: ProductUnit[] = [];
    listProductUnitConversion: ProductConversionUnit[] = [];
    listProductValue: ProductValue[] = [];
    productListUnit: ProductListUnit;
    listTag: Tag[] = [];
    currentUser;
    tagType = TagType;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private route: ActivatedRoute,
                private router: Router,
                private productCategoryService: ProductCategoryService,
                private productService: ProductService) {
        super();
        this.currentUser = this.appService.currentUser;
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.PRODUCT, this.pageId.PRODUCT, 'Quản lý sản phẩm', 'Quản lý sản phẩm');
        this.renderForm();
        this.subscribers.routerParam = this.route.params.subscribe((params: any) => {
                const id = params['id'];
                if (id) {
                    this.id = id;
                    this.isUpdate = true;
                    this.productService.getDetail(id).subscribe((result: ActionResultViewModel<ProductDetailViewModel>) => {
                        this.productDetail = result.data;
                        if (this.productDetail) {
                            if (this.productDetail.categories) {
                                this.categories = [];
                                const listCategoryByLanguageId = _.filter(this.productDetail.categories,
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
                            this.model.patchValue({
                                id: this.productDetail.id,
                                categories: this.categories,
                                thumbnail: this.productDetail.thumbnail,
                                images: this.productDetail.images,
                                isManagementByLot: this.productDetail.isManagementByLot,
                                isActive: this.productDetail.isActive,
                                isHot: this.productDetail.isHot,
                                isHomePage: this.productDetail.isHomePage,
                                concurrencyStamp: this.productDetail.concurrencyStamp,
                            });
                            this.productImages = this.productDetail.images;
                            this.listProductUnit = this.productDetail.units;
                            this.listProductUnitConversion = this.productDetail.conversionUnits;
                            this.getUnitIdFromProductUnitId();
                            this.listProductValue = _.filter(this.productDetail.values, (productValue: ProductValue) => {
                                return productValue.languageId === this.currentLanguage;
                            });

                            _.each(this.productImages, (image: ProductImage) => {
                                if (image.url === this.productDetail.thumbnail) {
                                    image.isThumbnail = true;
                                } else {
                                    image.isThumbnail = false;
                                }
                            });
                        }

                        if (this.productDetail.translations && this.productDetail.translations.length > 0) {
                            this.translations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        this.productDetail.translations,
                                        (productTranslation: ProductTranslation) => {
                                            return (
                                                productTranslation.languageId === model.value.languageId
                                            );
                                        }
                                    );
                                    if (detail) {
                                        model.patchValue(detail);
                                    }
                                }
                            );
                        }
                    });
                } else {
                    this.resetForm();
                }
            }
        );
        this.utilService.focusElement('name ' + this.currentLanguage);
    }

    ngAfterViewInit() {
        this.reloadTree();
        this.initEditor();
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
            this.isSaving = true;
            if (this.isUpdate) {
                this.productService
                    .update(this.id, this.product)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.router.navigate(['/products']);
                    });
            } else {
                // if (!this.productListUnit) {
                //     this.toastr.error('Please select product unit');
                //     return;
                // }

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
                            this.nhTabComponent.tabs.push(new NHTab('productAttribute', 'Product Attribute'));
                            setTimeout(() => {
                                this.nhTabComponent.setTabActiveById('productAttribute');
                                this.productUnitComponent.renderListUnit();
                            }, 200);
                            // this.router.navigate(['/products']);
                        }
                    });
            }
        }
    }

    updateThumbnail(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({thumbnail: file.absoluteUrl});
        } else {
            this.toastr.error('Please select file image');
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

    afterUploadImageContent(images: ExplorerItem[]) {
        images.forEach((image) => {
            if (image.isImage) {
                tinyMCE.execCommand('mceInsertContent', false,
                    `<img class="img-responsive" style="margin-left: auto; margin-right: auto" src="${image.absoluteUrl}"/>`);
            }
        });
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

    onSelectProductListUnit(value: ProductListUnit) {
        this.productListUnit = value ? value : null;
        this.model.patchValue({productListUnit: this.productListUnit});
    }

    removeTag(value) {
    }

    selectTag(value) {
    }

    selectListTag(value) {
        if (value) {
            this.listTag = value;
        }
    }

    private getUnitIdFromProductUnitId() {
        if (this.listProductUnitConversion && this.listProductUnit && this.listProductUnit.length > 0
            && this.listProductUnitConversion.length > 0) {
            _.each(this.listProductUnitConversion, (unitConversion: ProductConversionUnit) => {
                const productUnitById = _.filter(this.listProductUnit, (unit: ProductUnit) => {
                    return unit.id === unitConversion.productUnitId;
                });

                if (productUnitById && productUnitById.length > 0) {
                    unitConversion.unitId = productUnitById[0].unitId;
                }

                const productUnitConversionById = _.filter(this.listProductUnit, (unitConvert: ProductUnit) => {
                    return unitConvert.id === unitConversion.productUnitConversionId;
                });

                if (productUnitConversionById && productUnitConversionById.length > 0) {
                    unitConversion.unitConversionId = productUnitConversionById[0].unitId;
                }
            });
        }
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['thumbnail', 'isManagementByLot', 'isActive', 'categories']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'thumbnail': ['maxLength']},
            {'categories': ['required']},
            {'isManagementByLot': ['required']},
            {'isActive': ['required']},
        ]);

        this.model = this.fb.group({
            thumbnail: [this.product.thumbnail, [Validators.maxLength(500)]],
            isManagementByLot: [this.product.isManagementByLot, [Validators.required]],
            isActive: [this.product.isActive, [Validators.required]],
            isHot: [this.product.isHot],
            isHomePage: [this.product.isHomePage],
            categories: [this.categories, [Validators.required]],
            images: [this.productImages],
            productListUnit: [this.productListUnit],
            concurrencyStamp: [this.product.concurrencyStamp],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'description', 'metaTitle', 'metaDescription', 'metaKeyword']
        );
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxLength', 'pattern']},
            {description: ['maxLength']},
            {metaTitle: ['maxLength']},
            {metaDescription: ['maxLength']},
            {metaKeyword: ['maxLength']},
            {seoLink: ['maxLength']},
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
            content: [
                this.modelTranslation.content,
                [Validators.required]
            ],
            metaTitle: [this.modelTranslation.metaTitle,
                [Validators.maxLength(256)]],
            metaDescription: [
                this.modelTranslation.metaDescription,
                [Validators.maxLength(1000)]
            ],
            seoLink: [this.modelTranslation.seoLink, [Validators.maxLength(256)]],
            metaKeyword: [this.modelTranslation.metaKeyword,
                [Validators.maxLength(300)]],
            tags: [this.listTag]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            thumbnail: '',
            isManagementByLot: true,
            isActive: true,
            isHot: false,
            isHomePage: false,
            categories: [],
            images: [],
        });
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                description: '',
                content: '',
                metaTitle: '',
                metaDescription: '',
                metaKeyword: '',
                seoLink: ''
            });
        });
        this.listTag = [];
        this.productImages = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private initEditor() {
        this.eventContentEditors.forEach((eventContentEditor: TinymceComponent) => {
            eventContentEditor.initEditor();
        });
    }
}
