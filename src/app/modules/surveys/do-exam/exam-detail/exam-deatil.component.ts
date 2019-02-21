import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DoExamService } from '../service/do-exam.service';
import { BaseListComponent } from '../../../../base-list.component';
import { QuestionAnswerViewModel } from '../viewmodels/question-answer-viewmodel';
import { QuestionAnswerStatus, QuestionType } from '../../question/models/question.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { AnswerViewModel } from '../../question/viewmodels/answer.viewmodel';
import { ExamDetailViewModel } from '../viewmodels/exam-detail.viewmodel';
import { SurveyUserQuestionAnswerDetailViewModel } from '../viewmodels/survey-user-question-answer-detail.viewmodel';

@Component({
    selector: 'app-survey-exam-detail',
    templateUrl: './exam-detail.component.html',
    styleUrls: ['../../survey.component.scss'],
    providers: [DoExamService]
})
export class ExamDetailComponent extends BaseListComponent<ExamDetailViewModel> implements AfterViewInit, AfterContentInit {
    listSurveyUserQuestionAnswerDetails: SurveyUserQuestionAnswerDetailViewModel[];
    listQuestion: QuestionAnswerViewModel[];
    listAllQuestion: QuestionAnswerViewModel[];
    questionType = QuestionType;
    totalQuestion = 0;
    totalQuestionHasAnswer = 0;
    totalQuestionNotAnswer = 0;
    listColTableScore: number[];
    listRowTableScore: number[];
    listQuestionIndexHasAnswer = [];
    listQuestionIndexCorrect = [];
    listQuestionIndexInCorrect = [];
    colTableScore;
    rowTableScore;
    examUserDetail: ExamDetailViewModel;
    height;
    noTab;
    questionAnswerStatus = QuestionAnswerStatus;
    isManager = true;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private cdr: ChangeDetectorRef,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private doExamService: DoExamService) {
        super();
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 360;
        this.cdr.detectChanges();
    }

    ngAfterContentInit() {
        setTimeout(() => {
            const url = this.router.url;
            if (url.indexOf('surveys/my-survey') > -1) {
                this.isManager = false;
            }
        }, 100);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 360;
    }

    showExamDetail(surveyId: string, surveyUserId: string, surveyUserAnswerTimesId: string) {
        this.noTab = QuestionAnswerStatus.all;
        this.doExamService.getDetailExam(surveyId, surveyUserId, surveyUserAnswerTimesId, this.isManager)
            .subscribe((result: ActionResultViewModel<ExamDetailViewModel>) => {
                this.examUserDetail = result.data;
                if (this.examUserDetail) {
                    this.listSurveyUserQuestionAnswerDetails = this.examUserDetail.surveyUserQuestionAnswerDetails;
                    this.totalQuestion = this.listSurveyUserQuestionAnswerDetails
                        ? this.listSurveyUserQuestionAnswerDetails.length : 0;
                    this.renderResult(this.listSurveyUserQuestionAnswerDetails);
                    this.listAllQuestion = this.listQuestion;
                    this.getColAndRowTableScore();
                    this.getTotalAnswer();
                }
            });
    }

    getTotalAnswer() {
        const totalQuestionAnswer = _.countBy(this.listAllQuestion, (item: QuestionAnswerViewModel) => {
            return item.isAnswer;
        }).true;

        this.totalQuestionHasAnswer = totalQuestionAnswer ? totalQuestionAnswer : 0;
        this.totalQuestionNotAnswer = this.totalQuestion - this.totalQuestionHasAnswer;
    }

    showAllQuestion() {
        this.noTab = QuestionAnswerStatus.all;
        this.listQuestion = this.listAllQuestion;
    }

    showQuestionNoAnswer() {
        this.noTab = QuestionAnswerStatus.noAnswer;
        this.listQuestion = _.filter(this.listAllQuestion, (item: QuestionAnswerViewModel) => {
            return !item.isAnswer;
        });
    }

    showQuestionHasAnswer() {
        this.noTab = QuestionAnswerStatus.hasAnswer;
        this.listQuestion = _.filter(this.listAllQuestion, (item: QuestionAnswerViewModel) => {
            return item.isAnswer;
        });
    }

    showQuestionCorrect() {
        this.noTab = QuestionAnswerStatus.correct;
        this.listQuestion = _.filter(this.listAllQuestion, (item: QuestionAnswerViewModel) => {
            return this.listQuestionIndexCorrect.indexOf(item.order) >= 0;
        });
    }

    showQuestionInCorrect() {
        this.noTab = QuestionAnswerStatus.inCorrect;
        this.listQuestion = _.filter(this.listAllQuestion, (item: QuestionAnswerViewModel) => {
            return this.listQuestionIndexInCorrect.indexOf(item.order) >= 0;
        });
    }

    private renderResult(listQuestionAnswer: SurveyUserQuestionAnswerDetailViewModel[]) {
        if (listQuestionAnswer && listQuestionAnswer.length > 0) {
            const groupByQuestionVersionIds = _.groupBy(listQuestionAnswer, (item: SurveyUserQuestionAnswerDetailViewModel) => {
                return item.questionVersionId;
            });
            this.listQuestion = [];
            this.listQuestionIndexHasAnswer = [];
            this.listQuestionIndexCorrect = [];
            this.listQuestionIndexInCorrect = [];
            let index = 0;
            _.each(groupByQuestionVersionIds, (items: SurveyUserQuestionAnswerDetailViewModel) => {
                const key = items[0];
                const question = new QuestionAnswerViewModel();
                question.versionId = key.questionVersionId;
                question.questionType = key.questionType;
                question.name = key.questionName;
                question.content = key.questionContent;
                question.totalAnswer = key.totalAnswer;
                const listAnswer: AnswerViewModel[] = [];
                let isAnswer = false;
                let isCorrect;
                if (key.questionType === QuestionType.essay) {
                    const answer: AnswerViewModel = new AnswerViewModel();
                    answer.answerId = key.answerId;
                    answer.questionVersionId = key.versionId;
                    answer.value = key.answerValue;
                    answer.isSelected = key.surveyUserAnswerId ? true : false;
                    answer.surveyUserAnswerId = key.surveyUserAnswerId;
                    isAnswer = answer.isSelected || isAnswer;
                    listAnswer.push(answer);
                }
                if (key.questionType === QuestionType.singleChoice || key.questionType === QuestionType.multiChoice
                    || key.questionType === QuestionType.vote
                    || (key.questionType === QuestionType.selfResponded)) {
                    _.each(items, (item: SurveyUserQuestionAnswerDetailViewModel) => {
                        const answer: AnswerViewModel = new AnswerViewModel();
                        answer.answerId = item.answerId;
                        answer.questionVersionId = key.questionVersionId;
                        answer.name = item.answerName;
                        answer.value = item.answerValue;
                        answer.orderSelect = key.questionType === QuestionType.vote && item.surveyUserAnswerId ? item.answerOrder : 0;
                        answer.order = item.answerOrder;
                        answer.isSelected = item.isSelected
                            || (key.questionType === QuestionType.selfResponded && item.surveyUserAnswerId != null);
                        answer.surveyUserAnswerId = item.surveyUserAnswerId;
                        answer.isCorrect = item.isCorrect;
                        answer.answerIsCorrect = item.answerIsCorrect;
                        isAnswer = answer.isSelected || isAnswer;
                        isCorrect = key.questionType === QuestionType.singleChoice ? isCorrect || item.isCorrect :
                            key.questionType === QuestionType.multiChoice ? !(answer.isSelected && !answer.isCorrect) : isCorrect;
                        listAnswer.push(answer);
                    });

                    if (key.questionType === QuestionType.selfResponded && key.totalAnswer) {
                        const listHasAnswer = _.filter(listAnswer, (answer: AnswerViewModel) => {
                            return answer.surveyUserAnswerId;
                        });
                        const totalAnswerSelfResponded = !listHasAnswer || listHasAnswer.length === 0 ? key.totalAnswer
                            : key.totalAnswer - listHasAnswer.length;
                        if (totalAnswerSelfResponded > 0) {
                            for (let i = 1; i < totalAnswerSelfResponded; i++) {
                                const answer: AnswerViewModel = new AnswerViewModel();
                                answer.answerId = '';
                                answer.questionVersionId = key.versionId;
                                answer.value = '';
                                answer.surveyUserAnswerId = '';
                                isAnswer = answer.isSelected || isAnswer;
                                listAnswer.push(answer);
                            }
                        }
                    }
                }

                if (key.questionType === QuestionType.multiChoice) {
                    isCorrect = (_.countBy(listAnswer, (item: AnswerViewModel) => {
                        return item.isCorrect;
                    }).true === _.countBy(listAnswer, (item: AnswerViewModel) => {
                        return item.answerIsCorrect;
                    }).true) && isCorrect;
                }

                if (key.questionType === QuestionType.vote) {
                    const answerSelect = _.first(_.filter(listAnswer, (item: AnswerViewModel) => {
                        return item.surveyUserAnswerId;
                    }));
                    question.orderAnswerSelect = answerSelect ? answerSelect.orderSelect : 0;
                }

                question.isAnswer = isAnswer;
                index = index + 1;
                question.order = index;
                if (isAnswer) {
                    this.listQuestionIndexHasAnswer.push(index);
                }

                if (this.isManager || (!this.isManager && this.examUserDetail.isViewResult)) {
                    if (isCorrect && isAnswer) {
                        this.listQuestionIndexCorrect.push(index);
                    } else if (!isCorrect && isAnswer) {
                        this.listQuestionIndexInCorrect.push(index);
                    }
                }

                question.isCorrect = isCorrect;
                question.answers = _.orderBy(listAnswer, (item: AnswerViewModel) => {
                    return item.order;
                });
                this.listQuestion.push(question);
                this.totalQuestion = index;
            });
        } else {
            this.listQuestion = [];
        }
    }

    transform(value: number): string {
        if (value >= 0) {
            const hours: number = Math.floor(value / 3600);
            const minutes: number = Math.floor((value % 3600) / 60);
            return ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(value - minutes * 60)).slice(-2);
        } else {
            return '00:00:00';
        }
    }

    private getColAndRowTableScore() {
        if (this.totalQuestion > 0) {
            this.colTableScore = Math.ceil(Math.sqrt(this.totalQuestion));
            this.rowTableScore = Math.ceil(this.totalQuestion / this.colTableScore);
        } else {
            this.colTableScore = 1;
            this.rowTableScore = 1;
        }
        this.listColTableScore = _.range(1, this.colTableScore + 1);
        this.listRowTableScore = _.range(1, this.rowTableScore + 1);
    }
}

