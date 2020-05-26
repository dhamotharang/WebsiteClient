import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {NhModalComponent} from '../../../../../shareds/components/nh-modal/nh-modal.component';
import {BaseFormComponent} from '../../../../../base-form.component';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../../../../shareds/services/util.service';
import * as _ from 'lodash';
import {NumberValidator} from '../../../../../validators/number.validator';
import {DateTimeValidator} from '../../../../../validators/datetime.validator';
import {EmailTemplate} from '../model/email-template.model';
import {EmailTemplateTranslation} from '../model/email-template-translation';
import {EmailTemplateService} from '../email-template.service';
import {EmailTemplateDetailViewModel} from '../viewmodel/email-template-detail.viewmodel';

@Component({
    selector: 'app-config-email-template-form',
    templateUrl: './email-template-form.component.html',
    providers: [NumberValidator, DateTimeValidator, EmailTemplateService]
})

export class EmailTemplateFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('emailTemplateFormModal', {static: true}) emailTemplateFormModal: NhModalComponent;
    @Output() onSaveSuccess = new EventEmitter();

    emailTemplate = new EmailTemplate();
    modelTranslation = new EmailTemplateTranslation();

    constructor(private fb: FormBuilder,
                private numberValidator: NumberValidator,
                private datetimeValidator: DateTimeValidator,
                private utilService: UtilService,
                private emailTemplateService: EmailTemplateService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    onFormModalShown() {
        this.isModified = false;
    }

    onFormModalHidden() {
        this.isUpdate = false;
        this.resetForm();
        if (this.isModified) {
            this.onSaveSuccess.emit();
        }
    }

    add() {
        this.isUpdate = false;
        this.renderForm();
        this.emailTemplateFormModal.open();
    }

    edit(id: string) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.emailTemplateFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.emailTemplate = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.emailTemplateService.update(this.id, this.emailTemplate)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.emailTemplateFormModal.dismiss();
                    });
            } else {
                this.emailTemplateService.insert(this.emailTemplate)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.resetForm();
                        } else {
                            this.emailTemplateFormModal.dismiss();
                        }
                    });
            }
        }
    }

    getDetail(id: string) {
        this.emailTemplateService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<EmailTemplateDetailViewModel>) => {
                    const emailTemplateDetail = result.data;
                    if (emailTemplateDetail) {
                        this.model.patchValue({
                            mailTempGroupId: emailTemplateDetail.mailTempGroupId,
                            concurrencyStamp: emailTemplateDetail.concurrencyStamp,
                            isActive: emailTemplateDetail.isActive,
                            isDefault: emailTemplateDetail.isDefault,
                            startTime: emailTemplateDetail.startTime,
                            endTime: emailTemplateDetail.endTime,
                        });
                        if (emailTemplateDetail.emailTemplateTranslations && emailTemplateDetail.emailTemplateTranslations.length > 0) {
                            this.modelTranslations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        emailTemplateDetail.emailTemplateTranslations,
                                        (emailTemplateTranslation: EmailTemplateTranslation) => {
                                            return (
                                                emailTemplateTranslation.languageId === model.value.languageId
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

    closeModal() {
        this.emailTemplateFormModal.dismiss();
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['mailTempGroupId', 'startTime', 'endTime']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'mailTempGroupId': ['required', 'inValid']},
            {'startTime': ['isValid']},
            {'endTime': ['isValid']}
        ]);

        this.model = this.fb.group({
            mailTempGroupId: [this.emailTemplate.mailTempGroupId,
                [Validators.required, this.numberValidator.isValid]],
            isActive: [this.emailTemplate.isActive],
            isDefault: [this.emailTemplate.isDefault],
            startTime: [this.emailTemplate.startTime],
            endTime: [this.emailTemplate.endTime],
            concurrencyStamp: [this.emailTemplate.concurrencyStamp],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['title', 'contentMail', 'description']
        );
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {title: ['required, maxLength']},
            {description: ['maxLength']},
            {contentMail: ['required']}
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            title: [this.modelTranslation.title, [Validators.required, Validators.maxLength(256)]],
            description: [this.modelTranslation.description,
                [Validators.maxLength(500)]],
            contentMail: [this.modelTranslation.contentMail, [Validators.required]]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            account: '',
            startTime: '',
            endTime: '',
            isDefault: false,
            isActive: true,
            concurrencyStamp: '',
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                contentMail: '',
                description: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }
}

