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
import * as _ from 'lodash';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { TreeData } from '../../../../view-model/tree-data';
import { QuestionGroup } from '../models/question-group.model';
import { QuestionGroupTranslation } from '../models/question-group-translation.model';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { BaseFormComponent } from '../../../../base-form.component';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { QuestionGroupService } from '../service/question-group.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { QuestionGroupDetailViewModel } from '../viewmodels/question-group-detail.viewmodel';

@Component({
    selector: 'app-survey-question-group-form',
    templateUrl: './question-group-form.component.html',
})

export class QuestionGroupFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('questionGroupFormModal') questionGroupFormModal: NhModalComponent;
    @Input() elementId: string;
    @Output() onEditorKeyup = new EventEmitter<any>();
    @Output() onCloseForm = new EventEmitter<any>();
    questionGroupTree: TreeData[] = [];
    questionGroup: QuestionGroup;
    modelTranslation = new QuestionGroupTranslation();
    isGettingTree = false;

    constructor(@Inject(PAGE_ID) pageId: IPageId,
                private fb: FormBuilder,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private questionGroupService: QuestionGroupService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.questionGroup = new QuestionGroup();
        this.renderForm();
        this.getQuestionTree();
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
        this.questionGroupFormModal.open();
    }

    edit(id: number) {
        this.isUpdate = true;
        this.id = id;
        this.getDetail(id);
        this.questionGroupFormModal.open();
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
            this.questionGroup = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.questionGroupService
                    .update(this.id, this.questionGroup)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        this.reloadTree();
                        this.questionGroupFormModal.dismiss();
                    });
            } else {
                this.questionGroupService
                    .insert(this.questionGroup)
                    .pipe(finalize(() => (this.isSaving = false)))
                    .subscribe(() => {
                        this.isModified = true;
                        if (this.isCreateAnother) {
                            this.getQuestionTree();
                            this.resetForm();
                        } else {
                            this.questionGroupFormModal.dismiss();
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
        this.questionGroupService.getTree().subscribe((result: any) => {
            this.isGettingTree = false;
            this.questionGroupTree = result;
        });
    }

    onParentSelect(questionGroup: TreeData) {
        this.model.patchValue({parentId: questionGroup ? questionGroup.id : null});
    }

    private getDetail(id: number) {
        this.subscribers.questionGroupService = this.questionGroupService
            .getDetail(id)
            .subscribe(
                (result: IActionResultResponse<QuestionGroupDetailViewModel>) => {
                    const questionGroupDetail = result.data;
                    console.log(questionGroupDetail);
                    if (questionGroupDetail) {
                        this.model.patchValue({
                            isActive: questionGroupDetail.isActive,
                            order: questionGroupDetail.order,
                            parentId: questionGroupDetail.parentId,
                            concurrencyStamp: questionGroupDetail.concurrencyStamp,
                        });
                        if (questionGroupDetail.questionGroupTranslations && questionGroupDetail.questionGroupTranslations.length > 0) {
                            this.modelTranslations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        questionGroupDetail.questionGroupTranslations,
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

    private getQuestionTree() {
        this.subscribers.getTree = this.questionGroupService
            .getTree()
            .subscribe((result: TreeData[]) => {
                this.questionGroupTree = result;
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
            parentId: [this.questionGroup.parentId],
            isActive: [this.questionGroup.isActive],
            concurrencyStamp: [this.questionGroup.concurrencyStamp],
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
