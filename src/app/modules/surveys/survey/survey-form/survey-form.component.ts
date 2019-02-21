import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../base-form.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Survey } from '../survey.model';
import { SurveyTranslation } from '../survey-translation.model';
import { SurveyService } from '../survey.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { QuestionSelectComponent } from '../../question/question-select/question-select.component';
import { NhUserPickerComponent } from '../../../../shareds/components/nh-user-picker/nh-user-picker.component';
import { NhUserPicker } from '../../../../shareds/components/nh-user-picker/nh-user-picker.model';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { SurveyDetailViewModel } from '../survey-detail.viewmodel';
import * as _ from 'lodash';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-survey-form',
    templateUrl: './survey-form.component.html'
})

export class SurveyFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('surveyFormModal') surveyFormModal: NhModalComponent;
    @ViewChild(QuestionSelectComponent) questionSelectComponent: QuestionSelectComponent;
    @ViewChild(NhUserPickerComponent) userPickerComponent: NhUserPickerComponent;
    @Input() surveyGroupTree = [];
    survey = new Survey();
    surevyTranslation = new SurveyTranslation();
    // TODO: need to refact by multilanguage.
    surveyTypes = [{id: 0, name: 'Khảo sát thông thường'}, {id: 1, name: 'Khảo sát điều hướng'}];

    totalQuestion = 0;

    listSelectedUsers = [];
    listSelectedQuestions = [];
    listSelectedQuestionGroups = [];

    constructor(private fb: FormBuilder,
                private surveyService: SurveyService) {
        super();
    }

    ngOnInit() {
        this.renderForm();
    }

    onModalShown() {

    }

    onModalHidden() {
        this.resetModel();
        if (this.isModified) {
            this.saveSuccessful.emit();
        }
    }

    onAcceptSelectQuestion(result: { questions: any, questionGroups: any, totalQuestion: number }) {
        this.listSelectedQuestions = result.questions;
        this.listSelectedQuestionGroups = result.questionGroups;
        this.model.patchValue({
            totalQuestion: result.totalQuestion
        });
    }

    onAcceptSelectUsers(selectedUsers: NhUserPicker[]) {
        this.listSelectedUsers = selectedUsers;
    }

    add() {
        this.isUpdate = false;
        this.listSelectedQuestions = [];
        this.listSelectedQuestionGroups = [];
        this.surveyFormModal.open();
    }

    edit(id: string) {
        this.id = id;
        this.isUpdate = true;
        this.surveyFormModal.open();
        this.surveyService.detail(id)
            .subscribe((surveyDetail: SurveyDetailViewModel) => {
                if (surveyDetail) {
                    this.model.patchValue(surveyDetail);
                    if (surveyDetail.surveyTranslations && surveyDetail.surveyTranslations.length > 0) {
                        this.modelTranslations.controls.forEach((model: FormGroup) => {
                            const detail = _.find(surveyDetail.surveyTranslations, (translation: SurveyTranslation) => {
                                return translation.languageId === model.value.languageId;
                            });
                            if (detail) {
                                model.patchValue(detail);
                            }
                        });
                    }
                    this.listSelectedUsers = surveyDetail.users;
                    this.listSelectedQuestions = surveyDetail.questions;
                    this.listSelectedQuestionGroups = surveyDetail.questionGroups;
                }
            });
    }

    chooseQuestion() {
        this.questionSelectComponent.show();
    }

    chooseParticipant() {
        this.userPickerComponent.show();
    }

    save() {
        const isValid = this.validateModel(true);
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            this.survey = this.model.value;
            this.isSaving = true;
            if (this.isUpdate) {
                this.surveyService.update(this.id, this.survey, this.listSelectedQuestions, this.listSelectedQuestionGroups,
                    this.listSelectedUsers)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.isModified = true;
                        this.resetModel();
                        this.surveyFormModal.dismiss();
                    });
            } else {
                this.surveyService
                    .insert(this.survey, this.listSelectedQuestions, this.listSelectedQuestionGroups, this.listSelectedUsers)
                    .pipe(finalize(() => this.isSaving = false))
                    .subscribe((result: ActionResultViewModel) => {
                        this.resetModel();
                        this.isModified = true;
                        if (!this.isCreateAnother) {
                            this.surveyFormModal.dismiss();
                        }
                    });
            }
        }
    }

    // addGroup() {
    // }

    private renderForm() {
        this.buildForm();
        this.renderTranslationFormArray(this.buildFormLanguage);
    }

    private buildForm() {
        this.formErrors = this.renderFormError(['']);
        this.model = this.fb.group({
            surveyGroupId: [this.survey.surveyGroupId],
            isPublishOutside: [this.survey.isPublishOutside],
            isActive: [this.survey.isActive],
            isRequire: [this.survey.isRequire],
            totalQuestion: [this.survey.totalQuestion],
            limitedTimes: [this.survey.limitedTimes],
            limitedTime: [this.survey.limitedTime],
            status: [this.survey.status],
            seoLink: [this.survey.seoLink],
            concurrencyStamp: [this.survey.concurrencyStamp],
            startDate: [this.survey.startDate],
            endDate: [this.survey.endDate],
            isRequireLogin: [this.survey.isRequireLogin],
            type: [this.survey.type],
            isPreRendering: [this.survey.isPreRendering],
            modelTranslations: this.fb.array([])
        });
    }

    private resetModel() {
        this.listSelectedUsers = [];
        this.listSelectedQuestionGroups = [];
        this.listSelectedQuestions = [];
        this.isUpdate = false;
        this.id = null;
        this.model.patchValue({
            surveyGroupId: null,
            isPublishOutside: false,
            isActive: false,
            isRequire: false,
            totalQuestion: 0,
            limitedTimes: 1,
            limitedTime: null,
            concurrencyStamp: null,
            startDate: null,
            endDate: null,
            type: 0,
            isPreRendering: false,
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
        this.translationFormErrors[language] = this.renderFormError(['name', 'description']);
        this.translationValidationMessage[language] = this.renderFormErrorMessage([
            {'name': ['required', 'maxlength']},
            {'description': ['maxlength']},
        ]);
        const pageTranslationModel = this.fb.group({
            languageId: [language],
            name: [this.surevyTranslation.name, [
                Validators.required,
                Validators.maxLength(500)
            ]],
            description: [this.surevyTranslation.description, [
                Validators.maxLength(4000)
            ]],
        });
        pageTranslationModel.valueChanges.subscribe((data: any) => this.validateTranslationModel(false));
        return pageTranslationModel;
    };
}
