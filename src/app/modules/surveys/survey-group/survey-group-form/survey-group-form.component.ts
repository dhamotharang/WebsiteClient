import { BaseFormComponent } from '../../../../base-form.component';
import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TreeData } from '../../../../view-model/tree-data';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { ToastrService } from 'ngx-toastr';
import { SurveyGroup } from '../models/survey-group.model';
import { SurveyGroupTranslation } from '../models/survey-group-translation.model';
import { SurveyGroupService } from '../services/survey-group.service';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { finalize } from 'rxjs/operators';
import { QuestionGroupTranslation } from '../../question-group/models/question-group-translation.model';
import { SurveyGroupDetailViewModel } from '../viewmodels/survey-group-detail.viewmodel';
import * as _ from 'lodash';

@Component({
    selector: 'app-survey-survey-group-form',
    templateUrl: './survey-group-form.component.html'
})

export class SurveyGroupFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('surveyGroupFormModal') surveyGroupFormModal: NhModalComponent;
    @Input() elementId: string;
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onCloseForm = new EventEmitter<any>();
    surveyGroupTree: TreeData[] = [];
    surveyGroup: SurveyGroup;
    modelTranslation = new SurveyGroupTranslation();
    isGettingTree = false;

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private surveyGroupService: SurveyGroupService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.surveyGroup = new SurveyGroup();
        this.renderForm();
        this.getSurveyTree();
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
        this.surveyGroupFormModal.open();
    }

    edit(id: number) {
        this.resetForm();
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.surveyGroupFormModal.open();
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
            this.surveyGroup = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.surveyGroupService
                    .update(this.id, this.surveyGroup)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.reloadTree();
                        this.surveyGroupFormModal.dismiss();
                    });
            } else {
                this.surveyGroupService
                    .insert(this.surveyGroup)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.getSurveyTree();
                        } else {
                            this.surveyGroupFormModal.dismiss();
                        }
                        this.reloadTree();
                    });
            }
        }
    }

    closeForm() {
        this.onCloseForm.emit();
    }

    reloadTree() {
        this.isGettingTree = true;
        this.surveyGroupService.getTree().subscribe((result: any) => {
            this.isGettingTree = false;
            this.surveyGroupTree = result;
        });
    }

    onParentSelect(questionGroup: TreeData) {
        this.model.patchValue({parentId: questionGroup ? questionGroup.id : null});
    }

    private getDetail(id: number) {
        this.subscribers.surveyGroupService = this.surveyGroupService
            .getDetail(id)
            .subscribe(
                (result: IActionResultResponse<SurveyGroupDetailViewModel>) => {
                    const surveyGroupDetail = result.data;
                    if (surveyGroupDetail) {
                        this.model.patchValue({
                            isActive: surveyGroupDetail.isActive,
                            order: surveyGroupDetail.order,
                            parentId: surveyGroupDetail.parentId,
                            concurrencyStamp: surveyGroupDetail.concurrencyStamp,
                        });
                        if (surveyGroupDetail.surveyGroupTranslations && surveyGroupDetail.surveyGroupTranslations.length > 0) {
                            this.modelTranslations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        surveyGroupDetail.surveyGroupTranslations,
                                        (questionGroupTranslation: QuestionGroupTranslation) => {
                                            return (
                                                questionGroupTranslation.languageId ===
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

    private getSurveyTree() {
        this.subscribers.getTree = this.surveyGroupService
            .getTree()
            .subscribe((result: TreeData[]) => {
                this.surveyGroupTree = result;
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
            parentId: [this.surveyGroup.parentId],
            isActive: [this.surveyGroup.isActive],
            concurrencyStamp: [this.surveyGroup.concurrencyStamp],
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
    }
}
