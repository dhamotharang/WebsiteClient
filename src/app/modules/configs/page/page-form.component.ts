import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Page } from './models/page.model';
import { PageService } from './page.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../shareds/services/util.service';
import { BaseFormComponent } from '../../../base-form.component';
import { NhModalComponent } from '../../../shareds/components/nh-modal/nh-modal.component';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { LanguageService } from '../../../shareds/services/language.service';
import { PageTranslation } from './models/page-translation.model';
import { LanguageViewModel } from '../../../shareds/models/language.viewmodel';
import { TreeData } from '../../../view-model/tree-data';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';
import { IActionResultResponse } from '../../../interfaces/iaction-result-response.result';
import { PageDetailViewModel } from './models/page-detail.viewmodel';

@Component({
    selector: 'app-page-form',
    templateUrl: './page-form.component.html',
    providers: [LanguageService]
})

export class PageFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('pageFormModal', {static: true}) pageFormModal: NhModalComponent;
    @Input() page = new Page();
    @Output() onPageFormClose = new EventEmitter();
    pageTree: TreeData[] = [];
    model: FormGroup;
    pageTranslation = new PageTranslation();
    pageTranslationFormArray: FormArray;
    translationFormErrors = {};
    translationValidationMessage = [];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private utilService: UtilService,
                private pageService: PageService) {
        super();
    }

    get pageTranslations(): FormArray {
        return this.model.get('pageTranslations') as FormArray;
    }

    ngOnInit() {
        this.renderForm();
        this.getPageTree();
    }

    add() {
        this.pageFormModal.open();
        this.isUpdate = false;
    }

    edit(page: Page) {
        this.pageFormModal.open();
        this.isUpdate = true;
        this.pageService.getLanguageDetail(page.id)
            .subscribe((result: IActionResultResponse<PageDetailViewModel>) => {
                if (result.data) {
                    const pageData = result.data;
                    this.model.patchValue({
                        id: pageData.id,
                        parentId: pageData.parentId,
                        url: pageData.url,
                        icon: pageData.icon,
                        bgColor: pageData.bgColor,
                        order: pageData.order
                    });
                    if (pageData.pageTranslation && pageData.pageTranslation.length > 0) {
                        this.languages.forEach((language: LanguageViewModel, index: number) => {
                            const pageTranslationFormGroup = this.modelTranslations.at(index);
                            if (pageTranslationFormGroup) {
                                const pageTranslationInfo = _.find(pageData.pageTranslation, (pageTranslation: PageTranslation) => {
                                    return pageTranslationFormGroup.value.languageId === pageTranslation.languageId;
                                });
                                if (pageTranslationInfo) {
                                    pageTranslationFormGroup.patchValue(pageTranslationInfo);
                                } else {
                                    pageTranslationFormGroup.patchValue({name: '', description: ''});
                                }
                            }
                        });
                    }
                }
            });
    }

    onModalShown() {
        this.utilService.focusElement('pageId');
        this.isModified = false;
    }

    onModalHidden() {
        this.resetModel();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.page = this.model.value;
            this.page.pageTranslations = this.modelTranslations.getRawValue();
            this.isSaving = true;
            if (this.isUpdate) {
                this.pageService
                    .update(this.page)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.isModified = true;
                        this.pageFormModal.dismiss();
                    });
            } else {
                this.pageService
                    .insert(this.page)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: IResponseResult) => {
                        this.utilService.focusElement('pageId');
                        this.isModified = true;
                        this.getPageTree();
                        if (this.isCreateAnother) {
                            this.resetModel();
                        } else {
                            this.pageFormModal.dismiss();
                        }
                    });
            }
        }
    }

    // private renderLanguageData() {
    //     this.languages = this.appService.languages;
    //     this.languageData = this.languages.map((language: LanguageSearchViewModel) => {
    //         if (language.isDefault) {
    //             this.currentLanguage = language.languageId;
    //         }
    //         return {id: language.languageId, name: language.name, isSelected: language.isDefault};
    //     });
    //     this.renderPageTranslation();
    // }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private resetModel() {
        this.model.patchValue({
            id: null,
            name: '',
            isActive: true,
            url: '',
            icon: '',
            bgColor: '',
            order: 0
        });
        this.modelTranslations.controls.forEach((pageTranslation: FormControl) => {
            pageTranslation.patchValue({
                name: '',
                description: ''
            });
        });
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['id', 'icon', 'bgColor', 'url']);
        this.validationMessages = {
            id: {
                required: 'Mã trang không được để trống',
            },
            icon: {
                maxlength: 'Icon không được phép vượt quá 50 ký tự.',
            },
            bgColor: {
                maxlength: 'Mã màu nền không được phép lớn hơn 10 ký tự.'
            },
            url: {
                maxlength: 'Url không được phép vượt quá 500 ký tự.'
            }
        };

        this.model = this.fb.group({
            'id': [this.page.id, [
                Validators.required
            ]],
            'isActive': [this.page.isActive],
            'url': [this.page.url, [
                Validators.maxLength(500)
            ]],
            'icon': [this.page.icon, [
                Validators.maxLength(50)
            ]],
            'order': [this.page.order],
            'parentId': [this.page.parentId],
            'bgColor': [this.page.bgColor, [
                Validators.maxLength(10)
            ]],
            'modelTranslations': this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    // private buildFormLanguage(language: string): FormGroup {
    //     this.translationFormErrors[language] = this.utilService.renderFormError(['name', 'description']);
    //     this.translationValidationMessage[language] = {
    //         name: {
    //             required: 'Vui lòng nhập tên trang',
    //             maxLength: 'Tên trang không được phép vượt quá 256 ký tự.'
    //         },
    //         description: {
    //             maxLength: 'Mô tả không được phép vượt quá 500 ký tự.'
    //         }
    //     };
    //
    // }

    private getPageTree() {
        this.pageService.getPageTree()
            .subscribe((result: TreeData[]) => {
                this.pageTree = result;
            });
    }

    private renderPageTranslation() {
        this.pageTranslationFormArray = this.model.get('pageTranslations') as FormArray;
        this.languages.forEach((language: LanguageViewModel) => {
            this.pageTranslationFormArray.push(this.buildFormLanguage(language.id));
        });
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(['name', 'description']);
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['maxlength']},
        ]);
        const pageTranslationModel = this.fb.group({
            name: [this.pageTranslation.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            languageId: [language],
            description: [this.pageTranslation.description, [
                Validators.maxLength(500)
            ]]
        });
        pageTranslationModel.valueChanges.subscribe((data: any) => this.utilService.onValueChanged(pageTranslationModel,
            this.translationFormErrors[language],
            this.translationValidationMessage[language]));
        return pageTranslationModel;
    };
}
