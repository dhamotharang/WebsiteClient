import {AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {BaseFormComponent} from '../../../../base-form.component';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductDetail} from '../../model/product-detail.model';
import {UtilService} from '../../../../shareds/services/util.service';
import {ProductTranslationViewModel} from '../../model/product-translation.viewmodel';
import {TinymceComponent} from '../../../../shareds/components/tinymce/tinymce.component';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {TreeData} from '../../../../view-model/tree-data';
import {ProductService} from '../../services/product.service';
import {CategoryProductService} from '../../services/category-product.service';
import * as _ from 'lodash';
import {ProductCategoriesViewModel} from '../../model/product-categories.viewmodel';
import {environment} from '../../../../../environments/environment';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {Products} from '../../model/products.model';
import {TagType} from '../../../../shareds/components/nh-tags/tag.model';
import {SpinnerService} from '../../../../core/spinner/spinner.service';

declare var tinyMCE;

@Component({
    selector: 'app-product-form',
    templateUrl: './product-form.component.html',
    styleUrls: ['./product-form.component.scss'],
    providers: [ProductService, CategoryProductService]
})
export class ProductFormComponent extends BaseFormComponent implements OnInit, AfterViewInit {
    @ViewChildren(TinymceComponent) eventContentEditors: QueryList<TinymceComponent>;
    productDetail: ProductDetail = new ProductDetail();
    products: Products = new Products();
    modelTranslation = new ProductTranslationViewModel();
    listTag = [];
    tagType = TagType;
    categoryText: string;
    categoriesProduct: number[];
    categoryTree;
    currentUser;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                @Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private utilService: UtilService,
                private toastrService: ToastrService,
                private productService: ProductService,
                private spinnerService: SpinnerService,
                private categoryService: CategoryProductService,
                public dialogRef: MatDialogRef<ProductFormComponent>) {
        super();
        this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.PRODUCT_MANAGER, this.pageId.PRODUCT, 'Quản lý sản phẩm', 'Danh sách sản phẩm');
        this.renderForm();
        this.getCategoryTree();
        if (this.data) {
            if (this.data.id) {
                this.isUpdate = true;
                this.spinnerService.show();
                this.id = this.data.id;
                this.productService.getDetail(this.data.id).subscribe((result: ActionResultViewModel<ProductDetail>) => {
                    this.productDetail = result.data;
                    this.spinnerService.hide();
                    if (this.productDetail) {
                        if (this.productDetail.categories) {
                            this.categoriesProduct = [];
                            // const listCategoryByLanguageId = _.filter(this.productDetail.categories,
                            //     (category: ProductCategoriesViewModel) => {
                            //         return category.languageId === this.currentLanguage;
                            //     });

                            _.each(this.productDetail.categories, (category: any) => {
                                this.categoriesProduct.push(category.categoryId);
                            });

                            this.categoryText = _.join(_.map(this.productDetail.categories, (categoryNews: ProductCategoriesViewModel) => {
                                return categoryNews.categoryName;
                            }), ', ');
                        }
                        this.model.patchValue({
                            productId: this.productDetail.productId,
                            categories: this.categoriesProduct,
                            isHot: this.productDetail.isHot !== null ? this.productDetail.isHot : true,
                            isHomePage: this.productDetail.isHomePage ? this.productDetail.isHomePage : false,
                            featureImage: this.productDetail.featureImage,
                            concurrencyStamp: this.productDetail.concurrencyStamp,
                            salePrice: this.productDetail.salePrice
                        });
                    }

                    if (this.productDetail.translations && this.productDetail.translations.length > 0) {
                        this.modelTranslations.controls.forEach(
                            (model: FormGroup) => {
                                const detail = _.find(
                                    this.productDetail.translations,
                                    (productTranslation: ProductTranslationViewModel) => {
                                        return (
                                            productTranslation.languageId === model.value.languageId
                                        );
                                    }
                                );
                                if (detail.content) {
                                    detail.content = detail.content.replace(new RegExp('"uploads/', 'g'), '"' +
                                        environment.fileUrl + 'uploads/');
                                }
                                if (detail) {
                                     model.patchValue(detail);
                                }
                            }
                        );
                    }
                });
            }
        }
    }

    ngAfterViewInit() {
        this.cdr.detectChanges();
        this.initEditor();
        this.utilService.focusElement('title ' + this.currentLanguage);
    }

    onAcceptSelectCategory(data: TreeData[]) {
        this.categoriesProduct = [];
        if (data && data.length > 0) {
            _.each(data, (tree: TreeData) => {
                this.categoriesProduct.push(parseInt(tree.id));
            });
        }
        this.model.patchValue({categories: this.categoriesProduct});
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.products = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.productService.update(this.id, this.products)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.dialogRef.close({isModified: this.isModified});
                    });
            } else {
                this.productService.insert(this.products)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('title ' + this.currentLanguage);
                            this.resetForm();
                        } else {
                            this.dialogRef.close({isModified: this.isModified});
                        }
                    });
            }
        }
    }

    removeTag(value) {
    }

    selectTag(value) {
    }

    selectListTag(value) {
        if (value) {
            this.listTag = value;
        }
        this.modelTranslations.controls.forEach(
            (model: FormGroup) => {
                model.patchValue({tags: this.listTag});
            }
        );
    }

    afterUploadImage(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({featureImage: file.absoluteUrl});
        } else {
            this.toastrService.error('Please select file image');
        }
    }

    removeFeatureImage(item: any) {
        this.model.patchValue({featureImage: ''});
    }

    removeBannerImage(item: any) {
        this.model.patchValue({bannerImage: ''});
    }

    afterUploadImageBanner(file: ExplorerItem) {
        if (file.isImage) {
            this.model.patchValue({bannerImage: file.absoluteUrl});
        } else {
            this.toastrService.error('Please select file image');
        }
    }

    afterDeleteImage() {
        this.model.patchValue({altImage: ''});
    }

    afterUploadImageContent(images: ExplorerItem[], i: number) {
        const id = 'content' + i;
        images.forEach((image) => {
            if (image.isImage) {
                const imageAbsoluteUrl = environment.fileUrl + image.url;
                tinyMCE.execCommand('mceInsertContent', false,
                    `<img class="img-responsive lazy" style="margin-left: auto; margin-right: auto" src="${imageAbsoluteUrl}"/>`);
            }
        });
        // let content = tinyMCE.get(id).getContent();
        // content = content.replace('"uploads/', '"' + environment.fileUrl + 'uploads/');
        // tinyMCE.get(id).setContent(content);
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['categories']);
        this.validationMessages = this.renderFormErrorMessage([
            {'categories': ['required']}]);
        this.model = this.fb.group({
            productId: [this.products.productId],
            isHot: [this.products.isHot],
            isHomePage: [this.products.isHomePage],
            featureImage: [this.products.featureImage],
            salePrice: [this.products.salePrice],
            concurrenyStamp: [this.products.concurrencyStamp],
            categories: [this.products.categories, [
                Validators.required
            ]],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.model.valueChanges.subscribe(
            () => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages)));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError([
            'metaDescription', 'metaKeyword', 'seoLink', 'content', 'alt'
        ]);
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage(
            [
                {metaDescription: ['required', 'maxLength']},
                {metaKeyword: ['required', 'maxLength']},
                {seoLink: ['required']},
                {content: ['required', 'maxLength']},
                {alt: ['maxLength']}
            ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: this.modelTranslation.name,
            description: this.modelTranslation.description,
            unsignName: this.modelTranslation.unsignName,
            metaDescription: [
                this.modelTranslation.metaDescription,
                [Validators.maxLength(1000), Validators.required]
            ],
            metaKeyword: [
                this.modelTranslation.metaKeyword,
                [Validators.maxLength(300), Validators.required]
            ],
            seoLink: [
                this.modelTranslation.seoLink,
                [Validators.maxLength(256), Validators.required]
            ],
            alt: [this.modelTranslation.alt],
            content: [
                this.modelTranslation.content,
                [Validators.required]
            ],
            tags: [this.listTag]
        });
        translationModel.valueChanges.subscribe((data: any) => {
            this.validateTranslationModel(false);
        });
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            productId: null,
            categories: [],
            featureImage: '',
            salePrice: null,
            isHot: false,
            concurrencyStamp: '',
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                content: '',
                metaTitle: '',
                alt: '',
                metaDescription: '',
                metaKeyword: '',
                seoLink: ''
            });
        });
        this.listTag = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private initEditor() {
        this.eventContentEditors.forEach((eventContentEditor: TinymceComponent) => {
            eventContentEditor.initEditor();
        });
    }

    private getCategoryTree() {
        this.categoryService.getTree().subscribe((result: TreeData[]) => {
            this.categoryTree = result;
        });
    }
}
