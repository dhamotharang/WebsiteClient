import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Title } from '../title.model';
import { TitleService } from '../title.service';
import { IPageId, PAGE_ID } from '../../../../../configs/page-id.config';
import { BaseFormComponent } from '../../../../../base-form.component';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { UtilService } from '../../../../../shareds/services/util.service';
import { TitleDetailViewModel, TitleTranslationViewModel } from '../models/title-detail.viewmodel';
import { TitleTranslation } from '../models/title-translation.model';
import * as _ from 'lodash';
import { IActionResultResponse } from '../../../../../interfaces/iaction-result-response.result';

@Component({
    selector: 'app-title-form',
    templateUrl: './title-form.component.html'
})

export class TitleFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('titleFormModal') titleFormModal: NhModalComponent;
    title = new Title();
    modelTranslation = new TitleTranslation();

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private titleService: TitleService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.renderForm();
    }

    onTitleFormModalShown() {
        this.utilService.focusElement('name');
    }

    onTitleFormModalHidden() {
        this.resetModels();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    add() {
        this.titleFormModal.open();
        this.validateModel(false);
    }

    edit(title: Title) {
        this.isUpdate = true;
        this.title = title;
        this.getDetail(title.id);
        this.titleFormModal.open();
    }

    save() {
        const isValid = this.validateModel();
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.isSaving = true;
            this.title = this.model.value;
            if (this.isUpdate) {
                this.titleService.update(this.title.id, this.title)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.titleFormModal.dismiss();
                    });
            } else {
                this.titleService.insert(this.title)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.utilService.focusElement('name');
                        if (this.isCreateAnother) {
                            this.resetModels();
                        } else {
                            this.isModified = true;
                            this.titleFormModal.dismiss();
                        }
                    });
            }
        }
    }

    private getDetail(id: string) {
        this.subscribers.getTitleDetail = this.titleService.getDetail(id)
            .subscribe((result: IActionResultResponse<TitleDetailViewModel>) => {
                const titleDetail = result.data;
                if (titleDetail) {
                    this.model.patchValue({
                        id: titleDetail.id,
                        isActive: titleDetail.isActive,
                        order: titleDetail.order,
                        concurrencyStamp: titleDetail.concurrencyStamp,
                    });

                    if (titleDetail.titleTranslations && titleDetail.titleTranslations.length > 0) {
                        this.modelTranslations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(titleDetail.titleTranslations, (titleTranslation: TitleTranslationViewModel) => {
                                return titleTranslation.languageId === model.value.languageId;
                            });
                            if (detail) {
                                model.patchValue(detail);
                            }
                        });
                    }
                }
            });
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['name', 'shortName', 'description']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'shortName': ['required', 'maxlength']},
        ]);

        this.model = this.fb.group({
            'id': [this.title.id],
            'concurrencyStamp': [this.title.concurrencyStamp],
            'isActive': [this.title.isActive],
            'modelTranslations': this.fb.array([])
        });

        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetModels() {
        this.isUpdate = false;
        this.model.patchValue({
            isActive: true,
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                shortName: '',
                description: ''
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.renderFormError(['name', 'shortName', 'description']);
        this.translationValidationMessage[language] = this.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['maxlength']},
            {'shortName': ['required', 'maxlength']}
        ]);
        const pageTranslationModel = this.fb.group({
            languageId: [language],
            name: [this.modelTranslation.name, [
                Validators.required,
                Validators.maxLength(256)
            ]],
            shortName: [this.modelTranslation.shortName, [
                Validators.required,
                Validators.maxLength(50)
            ]],
            description: [this.modelTranslation.description, [
                Validators.maxLength(500)
            ]],
        });
        pageTranslationModel.valueChanges.subscribe((data: any) => this.validateTranslationModel(false));
        return pageTranslationModel;
    };
}
