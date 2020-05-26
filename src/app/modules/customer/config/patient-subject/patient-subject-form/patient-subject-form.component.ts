import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    Inject,
    ViewChild
} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {BaseFormComponent} from '../../../../../base-form.component';
import {TreeData} from '../../../../../view-model/tree-data';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {SpinnerService} from '../../../../../core/spinner/spinner.service';
import {UtilService} from '../../../../../shareds/services/util.service';
import {IActionResultResponse} from '../../../../../interfaces/iaction-result-response.result';
import * as _ from 'lodash';
import {NhModalComponent} from '../../../../../shareds/components/nh-modal/nh-modal.component';
import {JobTranslation} from '../../jobs/models/job-translations.model';
import {NumberValidator} from '../../../../../validators/number.validator';
import {PatientSubjectService} from '../service/patient-subject.service';
import {PatientSubject} from '../models/patient-subject.model';
import {PatientSubjectTranslation} from '../models/patient-subject-translation.model';
import {PatientSubjectDetailViewModel} from '../models/patient-subject-detail.viewmodel';

@Component({
    selector: 'app-patient-subject-form',
    templateUrl: './patient-subject-form.component.html',
    providers: [PatientSubjectService, NumberValidator]
})

export class PatientSubjectFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('patientSubjectFormModal', {static: true}) patientSubjectFormModal: NhModalComponent;
    @Input() elementId: string;
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onCloseForm = new EventEmitter<any>();
    patientSubject: PatientSubject;
    modelTranslation = new PatientSubjectTranslation();

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private patientSubjectService: PatientSubjectService,
                private numberValidator: NumberValidator,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.patientSubject = new PatientSubject();
        this.renderForm();
    }

    onModalShow() {
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
        this.renderForm();
        this.patientSubjectFormModal.open();
    }

    edit(id: string) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.patientSubjectFormModal.open();
    }

    save() {
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.patientSubject = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.patientSubjectService
                    .update(this.id, this.patientSubject)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.patientSubjectFormModal.dismiss();
                    });
            } else {
                this.patientSubjectService
                    .insert(this.patientSubject)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.resetForm();
                        } else {
                            this.patientSubjectFormModal.dismiss();
                        }
                    });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit();
    }

    onParentSelect(job: TreeData) {
        this.model.patchValue({parentId: job ? job.id : null});
    }

    private getDetail(id: string) {
        this.subscribers.patientSourceService = this.patientSubjectService
            .getDetail(id)
            .subscribe((result: IActionResultResponse<PatientSubjectDetailViewModel>) => {
                    const patientSubjectDetail = result.data;
                    if (patientSubjectDetail) {
                        this.model.patchValue({
                            isActive: patientSubjectDetail.isActive,
                            order: patientSubjectDetail.order,
                            patientSubjectId: patientSubjectDetail.patientSubjectId,
                            totalReduction: patientSubjectDetail.totalReduction,
                            concurrencyStamp: patientSubjectDetail.concurrencyStamp
                        });
                        if (patientSubjectDetail.patientSubjectTranslations && patientSubjectDetail.patientSubjectTranslations.length > 0) {
                            this.modelTranslations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        patientSubjectDetail.patientSubjectTranslations,
                                        (jobTranslation: JobTranslation) => {
                                            return (
                                                jobTranslation.languageId ===
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

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError([
            'order', 'totalReduction'
        ]);
        this.validationMessages = {
            'order': {
                'required': 'Số thứ tự không được để trống',
                'isValid': 'Số thứ tự phải là số'
            },
            'totalReduction': {
                'isValid': 'Tổng số tiền phải là số'
            }
        };
        this.model = this.fb.group({
            'order': [this.patientSubject.order, [Validators.required, this.numberValidator.isValid]],
            'isActive': [this.patientSubject.isActive],
            'concurrencyStamp': [this.patientSubject.concurrencyStamp],
            'totalReduction': [this.patientSubject.totalReduction, [this.numberValidator.isValid]],
            'modelTranslations': this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            parentId: null,
            isActive: true,
            order: 1,
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
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
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxlength']},
            {description: ['maxlength']},
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.modelTranslation.name,
                [Validators.required, Validators.maxLength(256)]
            ],
            description: [
                this.modelTranslation.description,
                [Validators.maxLength(500)]
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    }
}
