import {Component, OnInit, ViewChild} from '@angular/core';
import {ProductCategory} from '../model/product-category.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {finalize} from 'rxjs/operators';
import {ProductCategoryTranslation} from '../model/product-category-translation.model';
import {ProductCategoryService} from '../service/product-category-service';
import {ProductCategoryDetailViewModel} from '../viewmodel/product-category-detail.viewmodel';
import * as _ from 'lodash';
import {ProductCategoryAttribute} from '../product-category-attribute/product-category-attribute.model';
import {ProductAttributeService} from '../../product-attribute/product-attribute.service';
import {ToastrService} from 'ngx-toastr';
import {ProductCategoryAttributeViewModel} from '../product-category-attribute/product-category-attribute.viewmodel';
import {BaseFormComponent} from '../../../../base-form.component';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {NhTabComponent} from '../../../../shareds/components/nh-tab/nh-tab.component';
import {TreeData} from '../../../../view-model/tree-data';
import {NhSuggestion} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {UtilService} from '../../../../shareds/services/util.service';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {Pattern} from '../../../../shareds/constants/pattern.const';

@Component({
    selector: 'app-product-category-form',
    templateUrl: './product-category-form.component.html',
})

export class ProductCategoryFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('productCategoryFormModal') productCategoryFormModal: NhModalComponent;
    @ViewChild(NhTabComponent) nhTabComponent: NhTabComponent;
    productCategory = new ProductCategory();
    productCategoryTree: TreeData[] = [];
    modelTranslation = new ProductCategoryTranslation();
    isGettingTree = false;
    productCategoryAttributes: ProductCategoryAttribute[] = [];
    listProductCategoryAttributeViewModel: ProductCategoryAttributeViewModel[];
    productCategoryAttributeSuggestions: NhSuggestion[];
    isSearchingProductCategory;
    categoryText;
    productCategoryAttributeSelect: NhSuggestion[];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private productCategoryService: ProductCategoryService,
                private productAttributeService: ProductAttributeService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.renderForm();
    }

    onModalShow() {
        this.getProductCategoryTree();
        this.isModified = false;
    }

    onModalHidden() {
        this.isUpdate = false;
        this.resetForm();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add() {
        this.resetForm();
        this.utilService.focusElement('name ' + this.currentLanguage);
        this.renderForm();
        this.productCategoryFormModal.open();
    }

    edit(id: number) {
        this.utilService.focusElement('name ' + this.currentLanguage);
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.productCategoryFormModal.open();
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
            this.productCategory = this.model.value;
            this.productCategory.productCategoryAttributes = this.productCategoryAttributes;
            this.isSaving = true;
            if (this.isUpdate) {
                this.productCategoryService
                    .update(this.id, this.productCategory)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.reloadTree();
                        this.saveSuccessful.emit();
                        this.productCategoryFormModal.dismiss();
                    });
            } else {
                this.productCategoryService
                    .insert(this.productCategory)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name ' + this.currentLanguage);
                            this.getProductCategoryTree();
                            this.resetForm();
                        } else {
                            this.saveSuccessful.emit();
                            this.productCategoryFormModal.dismiss();
                        }
                        this.reloadTree();
                    });
            }
        }
    }

    onSearched(keyword) {
        this.isSearchingProductCategory = true;
        this.subscribers.searchSuggestionProductAttribute = this.productAttributeService
            .suggestions(keyword)
            .pipe(
                finalize(() => this.isSearchingProductCategory = false)
            )
            .subscribe((result: SearchResultViewModel<NhSuggestion>) => this.productCategoryAttributeSuggestions = result.items);
    }

    onSelectedProductAttribute(value: NhSuggestion) {
        if (value) {
            const countByProductAttributeId = _.countBy(this.productCategoryAttributes, (item: ProductCategoryAttribute) => {
                return item.attributeId === value.id;
            }).true;

            if (countByProductAttributeId && countByProductAttributeId > 0) {
                this.toastr.error('This attribute aldresdy exists');
                return;
            }

            this.productCategoryAttributes.push(new ProductCategoryAttribute(this.id, value.id.toString()));
            this.listProductCategoryAttributeViewModel
                .push(new ProductCategoryAttributeViewModel(this.id, value.id.toString(), value.name));
            this.productCategoryAttributeSelect = null;
        } else {
            this.productCategoryAttributeSelect = null;
        }
    }

    deleteAttribute(value, index: number) {
        _.pullAt(this.productCategoryAttributes, [index]);
        _.remove(this.listProductCategoryAttributeViewModel, (item: ProductCategoryAttributeViewModel) => {
            return item.attributeId === value.attributeId;
        });
    }

    reloadTree() {
        this.isGettingTree = true;
        this.productCategoryService.getTree().subscribe((result: any) => {
            this.isGettingTree = false;
            this.productCategoryTree = result;
        });
    }

    onParentSelect(productCategory: TreeData) {
        this.model.patchValue({parentId: productCategory ? productCategory.id : null});
    }

    private getDetail(id: number) {
        this.subscribers.productCategoryService = this.productCategoryService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<ProductCategoryDetailViewModel>) => {
                    const productCategoryDetail = result.data;
                    if (productCategoryDetail) {
                        this.model.patchValue({
                            isActive: productCategoryDetail.isActive,
                            order: productCategoryDetail.order,
                            parentId: productCategoryDetail.parentId,
                            concurrencyStamp: productCategoryDetail.concurrencyStamp,
                        });

                        if (productCategoryDetail.productCategoryAttributes && productCategoryDetail.productCategoryAttributes.length > 0) {
                            this.productCategoryAttributes = [];
                            _.each(productCategoryDetail.productCategoryAttributes, (item: ProductCategoryAttributeViewModel) => {
                                this.productCategoryAttributes.push(new ProductCategoryAttribute(item.categoryId, item.attributeId));
                            });
                        } else {
                            this.productCategoryAttributes = [];
                        }
                        this.listProductCategoryAttributeViewModel = productCategoryDetail.productCategoryAttributes;

                        if (productCategoryDetail.translations && productCategoryDetail.translations.length > 0) {
                            this.translations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        productCategoryDetail.translations,
                                        (productCategoryTranslation: ProductCategoryTranslation) => {
                                            return (
                                                productCategoryTranslation.languageId ===
                                                model.value.languageId
                                            );
                                        }
                                    );
                                    if (detail) {
                                        model.patchValue(detail);
                                    }
                                }
                            );
                        }
                    }
                }
            );
    }

    private getProductCategoryTree() {
        this.subscribers.getTree = this.productCategoryService
            .getTree()
            .subscribe((result: TreeData[]) => {
                this.productCategoryTree = result;
            });
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError([]);
        this.model = this.fb.group({
            parentId: [this.productCategory.parentId],
            isActive: [this.productCategory.isActive],
            order: [this.productCategory.order],
            concurrencyStamp: [this.productCategory.concurrencyStamp],
            productCategoryAttributes: [this.productCategoryAttributes],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.categoryText = '-';
        this.model.patchValue({
            parentId: null,
            isActive: true,
            order: 0,
        });
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                description: '',
            });
        });
        this.productCategoryAttributes = [];
        this.listProductCategoryAttributeViewModel = [];
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'description']
        );
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxlength', 'pattern']},
            {description: ['maxlength']},
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
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    }
}
