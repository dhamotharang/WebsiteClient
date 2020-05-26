import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UtilService} from '../../../shareds/services/util.service';
import {NumberValidator} from '../../../validators/number.validator';
import {FaqService} from '../service/faq.service';
import {FaqGroup, FaqGroupTranslation} from '../model/faq-group.model';
import {ToastrService} from 'ngx-toastr';
import {BaseFormComponent} from '../../../base-form.component';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {finalize} from 'rxjs/operators';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import * as _ from 'lodash';
import {FaqGroupDetailViewModel} from '../model/faq-group.detail.viewmodel';

@Component({
    selector: 'app-faq-group-form',
    templateUrl: './faq-group-form.component.html',
    styleUrls: ['./faq-group-form.component.css'],
    providers: [NumberValidator]
})

export class FaqGroupFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('faqGroupFormModal', {static: true}) faqGroupFormModal: NhModalComponent;

    faqGroup = new FaqGroup();
    translation = new FaqGroupTranslation();
    faqGroupId;

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private faqService: FaqService,
                private cdr: ChangeDetectorRef,
                private utilService: UtilService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    onModalShown() {
        this.utilService.focusElement('name');
    }

    onModalHidden() {
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    update(id: string) {
        this.isUpdate = true;
        this.faqGroupId = id;
        this.getDetail(id);
        this.faqGroupFormModal.open();
    }

    add() {
        this.resetForm();
        this.isUpdate = false;
        this.faqGroupFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
        if (isValid) {
            this.faqGroup = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.faqService.updateGroup(this.faqGroupId, this.faqGroup)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        this.faqGroupFormModal.dismiss();
                    });
            } else {
                this.faqService.insertGroup(this.faqGroup)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.utilService.focusElement('name');
                            this.resetForm();
                        } else {
                            this.resetForm();
                            this.faqGroupFormModal.dismiss();
                        }
                    });
            }
        }
    }

    private getDetail(id: string) {
        this.faqService.getDetailGroup(id)
            .subscribe(
                (result: ActionResultViewModel<FaqGroupDetailViewModel>) => {
                    const detail = result.data;
                    if (detail) {
                        this.model.patchValue({
                            isActive: detail.isActive,
                            order: detail.order,
                            concurrencyStamp: detail.concurrencyStamp,
                        });
                        if (detail.translations && detail.translations.length > 0) {
                            this.translations.controls.forEach(
                                (model: FormGroup) => {
                                    const detailTransaction = _.find(
                                        detail.translations,
                                        (translation1: FaqGroupTranslation) => {
                                            return (
                                                translation1.languageId ===
                                                model.value.languageId
                                            );
                                        }
                                    );
                                    if (detail) {
                                        model.patchValue(detailTransaction);
                                    }
                                }
                            );
                        }
                    }
                }
            );
    }


    private renderForm() {
        this.buildForm();
        this.renderTranslationArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError(['order', 'isActive']);
        this.validationMessages = this.renderFormErrorMessage([
            {'order': ['required']},
            {'isActive': ['required']},
        ]);
        this.model = this.fb.group({
            order: [this.faqGroup.order, [Validators.required]],
            isActive: [this.faqGroup.isActive, [Validators.required]],
            concurrencyStamp: [this.faqGroup.concurrencyStamp],
            translations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            order: 0,
            isActive: true
        });
        this.translations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                description: '',
            });
        });
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'description']
        );
        this.translationValidationMessage[language] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxlength']},
            {description: ['maxlength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.translation.name,
                [Validators.required, Validators.maxLength(256)]
            ],
            description: [
                this.translation.description,
                [Validators.maxLength(500)]
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslation(false)
        );
        return translationModel;
    };
}
