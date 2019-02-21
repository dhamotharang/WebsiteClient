import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseFormComponent } from '../../../../base-form.component';
import { QuestionService } from '../service/question.service';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { TreeData } from '../../../../view-model/tree-data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionTranslation } from '../models/question-translation.model';
import { UtilService } from '../../../../shareds/services/util.service';
import { Question, QuestionStatus, QuestionType } from '../models/question.model';
import { NumberValidator } from '../../../../validators/number.validator';
import { finalize } from 'rxjs/internal/operators';
import { ToastrService } from 'ngx-toastr';
import { Answer } from '../models/answer.model';
import { AnswerTranslation } from '../models/answer-translation.model';
import * as _ from 'lodash';
import { AnswerComponent } from '../answer/answer.component';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { QuestionDetailViewModel } from '../viewmodels/question-detail.viewmodel';
import { QuestionSearchViewModel } from '../viewmodels/question-search.viewmodel';

@Component({
    selector: 'app-survey-question-form',
    templateUrl: './question-form.component.html',
    providers: [QuestionService, UtilService, NumberValidator, ToastrService]
})

export class QuestionFormComponent extends BaseFormComponent implements OnInit {
    @ViewChild('questionFormModal') questionFormModal: NhModalComponent;
    @ViewChild(AnswerComponent) answerComponent: AnswerComponent;
    @Input() listQuestionType = [];
    @Input() questionGroupTree: TreeData[] = [];

    questionType = QuestionType;
    questionStatus = QuestionStatus;
    type;
    question: Question;
    questionId;
    questionVersionId;
    currentUser;
    questionGroupName;
    modelTranslation = new QuestionTranslation();
    listAnswer: Answer[] = [];

    constructor(private fb: FormBuilder,
                private toastr: ToastrService,
                private numberValidator: NumberValidator,
                private utilService: UtilService,
                private questionService: QuestionService) {
        super();
        this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
        this.question = new Question();
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

    save(type: number) {
        const isSend = type === 2;
        const isValid = this.utilService.onValueChanged(
            this.model,
            this.formErrors,
            this.validationMessages,
            true
        );
        const isLanguageValid = this.checkLanguageValid();
        if (isValid && isLanguageValid) {
            // if (this.type !== this.questionType.selfResponded && !this.model.value.score) {
            //     this.toastr.error('Please enter score');
            //     return;
            // }
            if (this.type === this.questionType.selfResponded && !this.model.value.totalAnswer) {
                this.toastr.error('Please enter totalAnswer');
                return;
            }
            if (this.type === QuestionType.singleChoice || this.type === QuestionType.multiChoice) {
                this.checkListAnswer(this.listAnswer);
                if (!this.listAnswer || this.listAnswer.length < 2) {
                    this.toastr.error('Question has least 2 answer.');
                    return;
                }

                const listAnswerCorrect = _.filter(this.listAnswer, (item: Answer) => {
                    return item.isCorrect;
                });
                if (!listAnswerCorrect || listAnswerCorrect.length === 0) {
                    this.toastr.error('Question has least answer correct');
                    return;
                }
            }
            this.question = this.model.value;
            this.question.answers = this.type === QuestionType.essay || this.type === QuestionType.selfResponded ? [] : this.listAnswer;
            this.isSaving = true;
            if (this.isUpdate) {
                this.questionService.update(isSend, this.questionId, this.questionVersionId, this.question).pipe(finalize(() => {
                    this.isSaving = false;
                })).subscribe(() => {
                    this.saveSuccessful.emit();
                    this.questionFormModal.dismiss();
                });
            } else {
                this.questionService.insert(isSend, this.question).pipe(finalize(() => {
                    this.isSaving = false;
                })).subscribe(() => {
                    this.isModified = true;
                    if (this.isCreateAnother) {
                        this.resetForm();
                    } else {
                        this.questionFormModal.dismiss();
                    }
                });
            }
        }
    }

    add() {
        this.type = QuestionType.singleChoice;
        this.questionGroupName = '--Please select';
        this.renderForm();
        this.model.patchValue({questionType: this.type});
        this.insertListAnswerDefault();
        this.questionFormModal.open();
    }

    edit(question: QuestionSearchViewModel) {
        this.isUpdate = true;
        this.questionId = question.id;
        this.questionVersionId = question.versionId;
        this.getDetail(question.versionId);
        this.type = this.model.value.questionType;
        this.questionFormModal.open();
    }

    detail(question: QuestionSearchViewModel) {
        this.getDetail(question.versionId);
    }

    send() {
        this.questionService.updateStatus(this.questionVersionId, QuestionStatus.pending, '').subscribe(() => {
            this.questionFormModal.dismiss();
        });
    }

    selectLanguage(value: any) {
        if (value) {
            this.currentLanguage = value.id;
        }
    }

    selectQuestionType(value) {
        if (value) {
            if (this.model.value.questionType) {
                if (this.listAnswer && this.listAnswer.length > 0) {
                    _.each(this.listAnswer, (item: Answer) => {
                        item.isCorrect = false;
                    });
                }
            }
            this.type = value.id;
        }
    }

    selectAnswer(value) {
        if (value) {
            this.listAnswer = value;
        }
    }

    checkListAnswer(listAnswer: Answer[]) {
        if (listAnswer && listAnswer.length > 0) {
            const listAnswerCorrect = [];
            _.each(this.listAnswer, (item: Answer) => {
                const answerTranslation = _.filter(item.answerTranslations, (translation: AnswerTranslation) => {
                    return translation.name !== null && translation.name !== '' && translation.name !== undefined;
                });

                if (answerTranslation && answerTranslation.length > 0) {
                    listAnswerCorrect.push(item);
                }
            });
            this.listAnswer = listAnswerCorrect;
        }
    }

    private getDetail(versionId: string) {
        this.subscribers.questionService = this.questionService
            .getDetail(versionId)
            .subscribe(
                (result: IActionResultResponse<QuestionDetailViewModel>) => {
                    const questionDetail = result.data;
                    if (questionDetail) {
                        this.model.patchValue({
                            questionGroupId: questionDetail.questionGroupId,
                            questionType: questionDetail.questionType,
                            score: questionDetail.score,
                            totalAnswer: questionDetail.totalAnswer,
                            concurrencyStamp: questionDetail.concurrencyStamp,
                        });
                        this.type = questionDetail.questionType;
                        if (questionDetail.answers) {
                            this.listAnswer = questionDetail.answers;
                        }
                        if (questionDetail.questionTranslations && questionDetail.questionTranslations.length > 0) {
                            this.modelTranslations.controls.forEach(
                                (model: FormGroup) => {
                                    const detail = _.find(
                                        questionDetail.questionTranslations,
                                        (questionTranslation: QuestionTranslation) => {
                                            return (
                                                questionTranslation.languageId ===
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
            'questionGroupId',
            'questionType',
            'score',
            'totalAnswer',
            'isActive',
        ]);
        this.validationMessages = {
            'questionGroupId': {
                'required': 'Nhóm câu hỏi không được để trống',
                'isValid': 'Nhóm câu hỏi không hợp lệ'
            },
            'questionType': {
                'required': 'Loại câu hỏi.',
                'maxlength': 'Tài khoản không được phép vượt quá 30 ký tự.',
                'pattern': 'Tài khoản không đúng định dạng'
            },
            'score': {
                'isValid': 'Số điểm không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'totalAnswer': {
                'isValid': 'Tổng số câu hỏi không hợp lệ. Vui lòng kiểm tra lại.'
            },
            'isActive': {
                'required': 'Nhóm câu hỏi không được để trống',
            }
        };
        this.model = this.fb.group({
            questionGroupId: [this.question.questionGroupId, [
                Validators.required,
                this.numberValidator.isValid]],
            questionType: [this.question.questionType, [
                Validators.required,
                this.numberValidator.isValid
            ]],
            score: [this.question.score, [
                this.numberValidator.isValid
            ]],
            totalAnswer: [this.question.totalAnswer, [
                this.numberValidator.isValid
            ]],
            isActive: [this.question.isActive, [
                Validators.required
            ]],
            concurrencyStamp: [this.question.concurrencyStamp],
            modelTranslations: this.fb.array([])
        });
        this.model.valueChanges.subscribe(data => this.validateModel(false));
    }

    private resetForm() {
        this.id = null;
        this.listAnswer = [];
        this.type = QuestionType.singleChoice;
        this.model.patchValue({
            questionGroupId: null,
            questionType: this.type,
            score: 0,
            totalAnswer: 0,
            isActive: true
        });
        this.modelTranslations.controls.forEach((model: FormGroup) => {
            model.patchValue({
                name: '',
                content: '',
                explain: '',
            });
        });
        this.insertListAnswerDefault();
        this.clearFormError(this.formErrors);
        this.clearFormError(this.translationFormErrors);
    }

    private buildFormLanguage = (language: string) => {
        this.translationFormErrors[language] = this.utilService.renderFormError(
            ['name', 'content', 'explain']
        );
        this.translationValidationMessage[
            language
            ] = this.utilService.renderFormErrorMessage([
            {name: ['required', 'maxlength']},
            {content: ['maxlength']},
            {explain: ['maxlength']}
        ]);
        const translationModel = this.fb.group({
            languageId: [language],
            name: [
                this.modelTranslation.name,
                [Validators.required, Validators.maxLength(256)]
            ],
            content: [this.modelTranslation.content,
                [Validators.maxLength(4000)]],
            explain: [
                this.modelTranslation.explain,
                [Validators.maxLength(4000)]
            ]
        });
        translationModel.valueChanges.subscribe((data: any) =>
            this.validateTranslationModel(false)
        );
        return translationModel;
    }

    private insertListAnswerDefault() {
        if ((!this.listAnswer || this.listAnswer.length === 0) && this.languages) {
            const answerLength = this.type === QuestionType.singleChoice
            || this.type === QuestionType.multiChoice ? 4 : this.type === QuestionType.vote
            && this.model.value.score ? this.model.value.score : 1;

            for (let i = 1; i <= answerLength; i++) {
                const answer = new Answer();
                _.each(this.languages, (item, index) => {
                    const answerTranslation = new AnswerTranslation();
                    answerTranslation.languageId = item.id;
                    answerTranslation.name = '';
                    answer.answerTranslations.push(answerTranslation);
                });
                answer.order = i;
                this.listAnswer.push(answer);
            }
        }
    }
}
