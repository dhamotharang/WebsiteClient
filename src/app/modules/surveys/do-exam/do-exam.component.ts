import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { DoExamService } from './service/do-exam.service';
import { BaseListComponent } from '../../../base-list.component';
import { QuestionAnswerViewModel } from './viewmodels/question-answer-viewmodel';
import * as _ from 'lodash';
import { QuestionAnswerStatus, QuestionType } from '../question/models/question.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DoExamViewModel } from './viewmodels/do-exam.viewmodel';
import { AnswerViewModel } from '../question/viewmodels/answer.viewmodel';
import { SurveyUserAnswerModel } from './viewmodels/survey-user-answer.model';
import { timer } from 'rxjs';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { SurveyUserQuestionAnswerViewModel } from './viewmodels/survey-user-question-answer.viewmodel';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-survey-do-exam',
    templateUrl: './do-exam.component.html',
    styleUrls: ['../survey.component.scss'],
    providers: [DoExamService]
})
export class DoExamComponent extends BaseListComponent<DoExamViewModel> implements OnInit, AfterViewInit {
    listSurveyUserQuestionAnswers: SurveyUserQuestionAnswerViewModel[];
    listQuestion: QuestionAnswerViewModel[];
    listAllQuestion: QuestionAnswerViewModel[];
    questionType = QuestionType;
    totalQuestion = 0;
    totalQuestionHasAnswer = 0;
    totalQuestionNotAnswer = 0;
    listColTableScore: number[];
    listRowTableScore: number[];
    listQuestionIndexHasAnswer = [];
    colTableScore;
    rowTableScore;
    timeRemainTransform;
    timeRemain;
    isFinish;
    surveyUserInfo: DoExamViewModel;
    errorMessage = '';
    questionAnswerStatus = QuestionAnswerStatus;
    noTab;
    height;

    constructor(private route: ActivatedRoute,
                private cdr: ChangeDetectorRef,
                private toastr: ToastrService,
                private router: Router,
                private spinnerService: SpinnerService,
                private doExamService: DoExamService) {
        super();
        this.currentUser = this.appService.currentUser;
    }

    ngOnInit() {
        this.subscribers.routeParam = this.route.params.subscribe((params: any) => {
            if (params.id) {
                this.doExamService.start(params.id)
                    .subscribe((result: ActionResultViewModel<DoExamViewModel>) => {
                        this.surveyUserInfo = result.data;
                        if (this.surveyUserInfo) {
                            this.listSurveyUserQuestionAnswers = this.surveyUserInfo.surveyUserQuestionAnswers;
                            this.totalQuestion = this.listSurveyUserQuestionAnswers ? this.listSurveyUserQuestionAnswers.length : 0;
                            this.renderResult(this.listSurveyUserQuestionAnswers);
                            this.listAllQuestion = this.listQuestion;
                            this.getColAndRowTableScore();
                            this.getTotalAnswer();
                            if (this.surveyUserInfo.totalSeconds <= 0) {
                                this.isFinish = true;
                                this.finishExam();
                            }
                            this.startCountdownTimer();
                        }
                    }, (errorResponse: any) => {
                        const error = errorResponse.error;
                        this.errorMessage = error.message;
                    });
            }
        });
        this.noTab = QuestionAnswerStatus.all;
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 200;
        this.cdr.detectChanges();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 200;
    }

    startCountdownTimer() {
        const interval1 = 1000;
        if (!this.surveyUserInfo.totalSeconds || this.surveyUserInfo.totalSeconds <= 0 || this.isFinish) {
            return;
        }
        const stream$ = timer(0, interval1);
        stream$.subscribe(value => {
            this.timeRemain = this.surveyUserInfo.totalSeconds - value;
            if (this.timeRemain >= 0) {
                if (!this.isFinish) {
                    this.timeRemainTransform = this.transform(this.timeRemain);
                }
            } else {
                this.isFinish = true;
                this.finishExam();
                window.location.reload();
            }
        });
    }

    userAnswer(question: QuestionAnswerViewModel, answer: AnswerViewModel, index) {
        if (this.isFinish) {
            return;
        }
        answer.isSelected = !answer.isSelected;
        const surveyUserAnswer = new SurveyUserAnswerModel();
        surveyUserAnswer.value = answer.value ? answer.value.trim() : '';
        surveyUserAnswer.answerId = answer.answerId;
        surveyUserAnswer.questionVersionId = question.versionId;
        surveyUserAnswer.surveyUserAnswerId = answer.surveyUserAnswerId;
        surveyUserAnswer.surveyId = this.surveyUserInfo ? this.surveyUserInfo.surveyId : '';

        if (question.questionType === QuestionType.essay || question.questionType === QuestionType.selfResponded) {
            if (!answer.value) {
                this.toastr.error('Please enter anser');
                return;
            }
        }
        this.doExamService.answer(surveyUserAnswer).subscribe((result: ActionResultViewModel<string>) => {
            if (result.data) {
                answer.surveyUserAnswerId = result.data;
            }
            question.isAnswer = true;
            if (question.questionType === QuestionType.multiChoice) {
                const totalSelected = _.countBy(question.answers, (answerItem: AnswerViewModel) => {
                    return answerItem.isSelected;
                }).true;

                if (!totalSelected) {
                    _.remove(this.listQuestionIndexHasAnswer, item => {
                        return item === question.order;
                    });
                    question.isAnswer = false;
                    return;
                }
            }
            if (this.listQuestionIndexHasAnswer.indexOf(question.order) < 0) {
                this.listQuestionIndexHasAnswer.push(question.order);
            }
            if (question.questionType === QuestionType.vote) {
                question.orderAnswerSelect = answer.order;
            }

            this.getTotalAnswer();
        });
    }

    answerBlur(question: QuestionAnswerViewModel, answer: AnswerViewModel, index, event) {
        this.userAnswer(question, answer, index);
    }

    finishExam() {
        if (this.surveyUserInfo) {
            this.doExamService
                .finishExam(this.surveyUserInfo.surveyId, this.surveyUserInfo.surveyUserId, this.surveyUserInfo.surveyUserAnswerTimeId)
                .subscribe((result: any) => {
                    this.isFinish = true;
                    // this.router.navigate(['/surveys/finish-exam']);
                });
        }
    }

    getTotalAnswer() {
        const listQuestionHasAnswer = _.filter(this.listAllQuestion, (item: QuestionAnswerViewModel) => {
            return item.isAnswer;
        });
        this.totalQuestionHasAnswer = listQuestionHasAnswer ? listQuestionHasAnswer.length : 0;
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

    private renderResult(listQuestionAnswer: SurveyUserQuestionAnswerViewModel[]) {
        if (listQuestionAnswer && listQuestionAnswer.length > 0) {
            const groupByQuestionVersionIds = _.groupBy(listQuestionAnswer, (item: SurveyUserQuestionAnswerViewModel) => {
                return item.questionVersionId;
            });
            this.listQuestion = [];
            this.listQuestionIndexHasAnswer = [];
            let index = 0;
            _.each(groupByQuestionVersionIds, (items: SurveyUserQuestionAnswerViewModel) => {
                const key = items[0];
                const question = new QuestionAnswerViewModel();
                question.versionId = key.questionVersionId;
                question.questionType = key.questionType;
                question.name = key.questionName;
                question.content = key.questionContent;
                question.totalAnswer = key.totalAnswer;
                const listAnswer: AnswerViewModel[] = [];
                let isAnswer = false;
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
                    _.each(items, (item: SurveyUserQuestionAnswerViewModel) => {
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
                        isAnswer = answer.isSelected || isAnswer;
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

    private transform(value: number): string {
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
