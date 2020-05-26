import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../../base-form.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Category, CategoryTranslation} from '../models/category.model';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {finalize} from 'rxjs/operators';
import {CategoryService} from '../category.service';
import {CategoryDetailViewModel} from '../view-models/category-detail.viewmodel';
import * as _ from 'lodash';
import {TreeData} from '../../../../view-model/tree-data';
import {NumberValidator} from '../../../../validators/number.validator';

@Component({
    selector: 'app-category-form',
    templateUrl: './category-form.component.html',
    providers: [NumberValidator],
    styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild(NhModalComponent, {static: true}) categoryFormModal: NhModalComponent;
    category = new Category();
    modelTranslation = new CategoryTranslation();
    categoryTreeData: TreeData[] = [];

    constructor(private fb: FormBuilder,
                private numberValidator: NumberValidator,
                private categoryService: CategoryService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    onModalShown() {
        this.getTree();
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
        this.model.patchValue({'bannerImage': value.absoluteUrl});
    }

    deleteImage() {
        this.model.patchValue({'bannerImage': ''});
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
                        this.categoryFormModal.dismiss();
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
                            this.categoryFormModal.dismiss();
                        }
                    });
            }
        }
    }

    private getDetail(id: number) {
        this.subscribers.getDetail = this.categoryService.getDetail(id)
            .subscribe((categoryDetail: CategoryDetailViewModel) => {
                if (categoryDetail) {
                    console.log(categoryDetail);
                    this.model.patchValue(categoryDetail);
                    if (categoryDetail.categoryTranslations && categoryDetail.categoryTranslations.length > 0) {
                        this.modelTranslations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(categoryDetail.categoryTranslations, (translation: CategoryTranslation) => {
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
            isHomePage: [this.category.isHomePage],
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
