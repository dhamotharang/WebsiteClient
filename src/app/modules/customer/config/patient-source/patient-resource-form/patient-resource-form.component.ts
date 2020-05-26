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
import {PatientResourceService} from '../service/patient-resource.service';
import {PatientResource} from '../models/patient-resource.model';
import {PatientResourceTranslation} from '../models/patient-resource-translation.model';
import {PatientResourceDetailViewModel} from '../models/patient-resource-detail.viewmodel';
import {NumberValidator} from '../../../../../validators/number.validator';

@Component({
    selector: 'app-patient-source-form',
    templateUrl: './patient-resource-form.component.html',
    providers: [PatientResourceService, NumberValidator]
})

export class PatientResourceFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('patientSourceFormModal', {static: true}) patientSourceFormModal: NhModalComponent;
    @Input() elementId: string;
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onCloseForm = new EventEmitter<any>();
    patientResource: PatientResource;
    modelTranslation = new PatientResourceTranslation();

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private patientResourceService: PatientResourceService,
                private numberValidator: NumberValidator,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.patientResource = new PatientResource();
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
        this.patientSourceFormModal.open();
    }

    edit(id: string) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.patientSourceFormModal.open();
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
            this.patientResource = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.patientResourceService
                    .update(this.id, this.patientResource)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.patientSourceFormModal.dismiss();
                    });
            } else {
                this.patientResourceService
                    .insert(this.patientResource)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.resetForm();
                        } else {
                            this.patientSourceFormModal.dismiss();
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
        this.subscribers.patientResourceService = this.patientResourceService
            .getDetail(id)
            .subscribe((result: IActionResultResponse<PatientResourceDetailViewModel>) => {
                    const patientResourceDetail = result.data;
                    if (patientResourceDetail) {
                        this.model.patchValue({
                            isActive: patientResourceDetail.isActive,
                            order: patientResourceDetail.order,
                            id: patientResourceDetail.id,
                            concurrencyStamp: patientResourceDetail.concurrencyStamp
                        });
                        if (patientResourceDetail.patientResourceTranslations
                            && patientResourceDetail.patientResourceTranslations.length > 0) {
                            this.modelTranslations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        patientResourceDetail.patientResourceTranslations,
                                        (patientResourceTranslation: PatientResourceTranslation) => {
                                            return (
                                                patientResourceTranslation.languageId ===
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
            'order'
        ]);
        this.validationMessages = {
            'order': {
                'required': 'Số thứ tự không được để trống',
                'isValid': 'Số thứ tự phải là số'
            },
        };
        this.model = this.fb.group({
            'order': [this.patientResource.order, [Validators.required, this.numberValidator.isValid]],
            'isActive': [this.patientResource.isActive],
            'concurrencyStamp': [this.patientResource.concurrencyStamp],
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
