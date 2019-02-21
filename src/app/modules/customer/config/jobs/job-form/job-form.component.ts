import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    Inject,
    ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { BaseFormComponent } from '../../../../../base-form.component';
import { TreeData } from '../../../../../view-model/tree-data';
import { IPageId, PAGE_ID } from '../../../../../configs/page-id.config';
import { SpinnerService } from '../../../../../core/spinner/spinner.service';
import { UtilService } from '../../../../../shareds/services/util.service';
import * as _ from 'lodash';
import { JobTranslation } from '../models/job-translations.model';
import { Job } from '../models/job.model';
import { JobService } from '../service/job.service';
import { JobDetailViewModel } from '../models/job-detail.viewmodel';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { ActionResultViewModel } from '../../../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-job-form',
    templateUrl: './job-form.component.html',
    providers: [JobService]
})

export class JobFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('jobFormModal') jobFormModal: NhModalComponent;
    @Input() elementId: string;
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onCloseForm = new EventEmitter<any>();
    jobTree: TreeData[] = [];
    job: Job;
    modelTranslation = new JobTranslation();
    isGettingTree = false;

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private jobService: JobService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.job = new Job();
        this.renderForm();
        this.getJobTree();
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
        this.getJobTree();
        this.jobFormModal.open();
    }

    edit(id: number) {
        this.getJobTree();
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.jobFormModal.open();
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
            this.job = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.jobService
                    .update(this.id, this.job)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.jobFormModal.dismiss();
                    });
            } else {
                this.jobService
                    .insert(this.job)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.getJobTree();
                            this.resetForm();
                        } else {
                            this.jobFormModal.dismiss();
                        }
                    });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit();
    }

    reloadTree() {
        this.isGettingTree = true;
        this.jobService.getTree().subscribe((result: any) => {
            this.isGettingTree = false;
            this.jobTree = result;
        });
    }

    onParentSelect(job: TreeData) {
        this.model.patchValue({parentId: job ? job.id : null});
    }

    private getDetail(id: number) {
        this.subscribers.jobService = this.jobService
            .getDetail(id)
            .subscribe(
                (result: ActionResultViewModel<JobDetailViewModel>) => {
                    const jobDetail = result.data;
                    if (jobDetail) {
                        this.model.patchValue({
                            isActive: jobDetail.isActive,
                            order: jobDetail.order,
                            parentId: jobDetail.parentId
                        });
                        if (jobDetail.jobTranslations && jobDetail.jobTranslations.length > 0) {
                            this.modelTranslations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        jobDetail.jobTranslations,
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

    private getJobTree() {
        this.subscribers.getTree = this.jobService
            .getTree()
            .subscribe((result: TreeData[]) => {
                this.jobTree = result;
            });
    }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.utilService.renderFormError([
            'name',
            'description',
        ]);
        this.model = this.fb.group({
            parentId: [this.job.parentId],
            isActive: [this.job.isActive],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.model.patchValue({
            parentId: null,
            isActive: true
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
    };
}
