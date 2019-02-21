import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {UtilService} from '../../../../../shareds/services/util.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActionResultViewModel} from '../../../../../shareds/view-models/action-result.viewmodel';
import {finalize} from 'rxjs/operators';
import {BaseFormComponent} from '../../../../../base-form.component';
import {CoreValue} from '../model/core-value.model';
import {CoreValuesTranslation} from '../model/core-values.translation';
import {CoreValuesService} from '../core-values.service';
import {CoreValueDetailViewModel} from '../viewmodel/core-value-detail.viewmodel';
import * as _ from 'lodash';
import {NumberValidator} from '../../../../../validators/number.validator';

@Component({
    selector: 'app-config-website-core-values-form',
    templateUrl: './core-values-form.component.html',
    providers: [NumberValidator]
})

export class CoreValuesFormComponent extends BaseFormComponent implements OnInit {
    @Output() onCloseForm = new EventEmitter();
    @Output() onSaveSuccess = new EventEmitter();
    coreValue = new CoreValue();
    modelTranslation = new CoreValuesTranslation();

    constructor(private utilService: UtilService,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private numberValidator: NumberValidator,
                private coreValueService: CoreValuesService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    add() {
        this.utilService.focusElement('name ' + this.currentLanguage);
        this.isUpdate = false;
        this.renderForm();
        this.resetForm();
    }

    edit(id: string) {
        this.utilService.focusElement('name ' + this.currentLanguage);
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        const isLanguageValid = this.validateLanguage();
        if (isValid && isLanguageValid) {
            this.coreValue = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.coreValueService.update(this.id, this.coreValue)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.isModified = true;
                        this.onSaveSuccess.emit();
                    });
            } else {
                this.coreValueService.insert(this.coreValue)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe(() => {
                        this.utilService.focusElement('name ' + this.currentLanguage);
                        this.isModified = true;
                        this.onSaveSuccess.emit();
                        this.resetForm();
                    });
            }
        }
    }

    getDetail(id: string) {
        this.coreValueService.getDetail(id).subscribe((result: ActionResultViewModel<CoreValueDetailViewModel>) => {
            const coreValueDetail = result.data;
            if (coreValueDetail) {
                this.model.patchValue({
                    id: coreValueDetail.id,
                    isActive: coreValueDetail.isActive,
                    order: coreValueDetail.order,
                    concurrencyStamp: coreValueDetail.concurrencyStamp,
                });
                if (coreValueDetail.translations && coreValueDetail.translations.length > 0) {
                    this.translations.controls.forEach(
                        (model: FormGroup) => {
                            const detail = _.find(
                                coreValueDetail.translations,
                                (translations: CoreValuesTranslation) => {
                                    return (
                                        translations.languageId ===
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
        });
    }

    closeForm() {
        this.onCloseForm.emit();
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['isActive', 'order']);
        this.validationMessages = this.utilService.renderFormErrorMessage([
            {'isActive': ['required']},
            {'order': ['isValid', 'greaterThan']}
        ]);

        this.model = this.fb.group({
            order: [this.coreValue.order,
                [this.numberValidator.isValid, this.numberValidator.greaterThan(0)]],
            isActive: [this.coreValue.isActive, [
                Validators.required
            ]],
            concurrencyStamp: [this.coreValue.concurrencyStamp],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(() => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'description']
        );
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxLength']},
            {description: ['maxLength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.modelTranslation.name,
                [Validators.required, Validators.maxLength(256)]
            ],
            description: [this.modelTranslation.description,
                [Validators.maxLength(500)]],
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    };

    private resetForm() {
        this.id = null;
        this.model.patchValue(new CoreValue(0, true, ''));
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                description: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }
}
