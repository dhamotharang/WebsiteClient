import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {TreeData} from '../../../../view-model/tree-data';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {UtilService} from '../../../../shareds/services/util.service';
import {finalize} from 'rxjs/operators';
import {IResponseResult} from '../../../../interfaces/iresponse-result';
import {BaseFormComponent} from '../../../../base-form.component';
import {CategoryProductService} from '../../services/category-product.service';
import * as _ from 'lodash';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ProductCategory} from '../../model/product-category.model';
import {ProductCategoryViewModel} from '../../model/product-category.viewmodel';
import {ProductCategoryTranslation} from '../../model/product-category-translation.model';
import {NumberValidator} from '../../../../validators/number.validator';

@Component({
    selector: 'app-product-category-form',
    templateUrl: './product-category-form.component.html',
    styleUrls: ['./product-category-form.component.scss'],
    providers: [NumberValidator],
})
export class ProductCategoryFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('categoryFormModal') categoryFormModal: NhModalComponent;
    @Output() onSaveSuccess = new EventEmitter();
    categoryTree: TreeData[] = [];
    category = new ProductCategory();
    modelTranslation = new ProductCategoryTranslation();
    categoryTreeData: TreeData[] = [];
    isShowMore = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private categoryService: CategoryProductService,
                private utilService: UtilService,
                public dialogRef: MatDialogRef<ProductCategoryFormComponent>
    ) {
        super();
    }

    ngOnInit() {
        if (this.data) {
            if (this.data.id) {
                this.id = this.data.id;
                this.isUpdate = true;
                this.getDetail(this.data.id);
            }
        }
        this.getTree();
        this.renderForm();
    }

    onModalHidden() {
        this.isUpdate = false;
        this.resetModels();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add() {
        this.isUpdate = false;
        this.categoryFormModal.open();
    }

    edit(id: number) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.categoryFormModal.open();
    }

    onImageSelected(value: any) {
        console.log(value);
        this.model.patchValue({'bannerImage': value.absoluteUrl});
    }

    save() {
        const isValid = this.validateModel();
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.isSaving = true;
            this.category = this.model.value;
            this.category.categoryTranslations = this.modelTranslations.getRawValue();
            this.isSaving = true;
            if (this.isUpdate) {
                this.categoryService.update(this.id, this.category)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.dialogRef.close({isModified: this.isModified});
                    });
            } else {
                this.categoryService.insert(this.category)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        if (this.isCreateAnother) {
                            this.resetModels();
                            this.getTree();
                        } else {
                            this.isModified = true;
                            this.dialogRef.close({isModified: this.isModified});
                        }
                    });
            }
        }
    }

    private getDetail(id: number) {
        this.subscribers.getDetail = this.categoryService.getDetail(id)
            .subscribe((categoryDetail: ProductCategoryViewModel) => {
                if (categoryDetail) {
                    console.log(categoryDetail);
                    this.model.patchValue(categoryDetail);
                    if (categoryDetail.categoryTranslations && categoryDetail.categoryTranslations.length > 0) {
                        this.modelTranslations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(categoryDetail.categoryTranslations, (translation: ProductCategoryTranslation) => {
                                return translation.languageId === model.value.languageId;
                            });
                            if (detail) {
                                model.patchValue(detail);
                            }
                        });
                    }
                }
            });
    }

    private getTree() {
        this.subscribers.getCategoryTree = this.categoryService.getTree()
            .subscribe((result: TreeData[]) => {
                this.categoryTreeData = result;
            });
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['order']);
        this.validationMessages = this.renderFormErrorMessage([
            {'order': ['required', 'isValid', 'greaterThan']},
            {'shortName': ['required', 'maxlength']},
        ]);
        this.model = this.fb.group({
            isActive: [this.category.isActive],
            bannerImage: [this.category.bannerImage],
            parentId: [this.category.parentId],
            order: [this.category.order, [this.numberValidator.isValid, this.numberValidator.greaterThan(0)]],
            concurrencyStamp: [this.category.concurrencyStamp],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetModels() {
        this.isUpdate = false;
        this.model.patchValue({
            isActive: true,
            parentId: null,
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                metaTitle: '',
                description: '',
                metaDescription: '',
                seoLink: ''
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.renderFormError(['name', 'metaTitle', 'description', 'metaDescription', 'seoLink']);
        this.translationValidationMessage[language] = this.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['maxlength']},
            {'metaTitle': ['maxlength']},
            {'metaDescription': ['maxlength']},
            {'seoLink': ['maxlength']}
        ]);

        const pageTranslationModel = this.fb.group({
            languageId: [language],
            name: [this.modelTranslation.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            seoLink: [this.modelTranslation.seoLink, [
                Validators.maxLength(500)
            ]],
            metaTitle: [this.modelTranslation.metaTitle, [
                Validators.maxLength(256)
            ]],
            metaDescription: [this.modelTranslation.metaDescription, [
                Validators.maxLength(500)
            ]],
            description: [this.modelTranslation.description, [
                Validators.maxLength(500)
            ]],
        });
        pageTranslationModel.valueChanges.subscribe((data: any) => this.validateTranslationModel(false));
        return pageTranslationModel;
    };
}
