import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { QuestionService } from '../service/question.service';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import { QuestionDetailViewModel } from '../viewmodels/question-detail.viewmodel';
import { Answer } from '../models/answer.model';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { BaseFormComponent } from '../../../../base-form.component';
import { QuestionStatus, QuestionType } from '../models/question.model';
import { QuestionTranslationViewModel } from '../viewmodels/question-translation.viewmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionExplainDeclineReasonComponent } from '../question-approve/question-explain-decline-reason.component';
import * as _ from 'lodash';

@Component({
    selector: 'app-survey-question-detail',
    templateUrl: './question-detail.component.html'
})
export class QuestionDetailComponent extends BaseFormComponent implements OnInit {
    @ViewChild('questionDetailModal') questionDetailModal: NhModalComponent;
    @ViewChild(QuestionExplainDeclineReasonComponent) questionExplainDeclineReasonComponent: QuestionExplainDeclineReasonComponent;
    @Input() isShowFromNotify = false;
    @Output() onUpdateStatusSuccess = new EventEmitter();
    @Output() onDeleteSuccess = new EventEmitter();
    questionType = QuestionType;
    questionStatus = QuestionStatus;
    questionDetail: QuestionDetailViewModel;
    listAnswer: Answer[];
    listQuestionTranslation: QuestionTranslationViewModel[];
    isDetail;
    listAnswerSelfResponded;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private questionService: QuestionService) {
        super();
    }

    ngOnInit() {
        this.questionDetail = new QuestionDetailViewModel();
    }

    selectLanguage(value: any) {
        if (value) {
            this.currentLanguage = value.id;
        }
    }

    hideModal() {
        if (this.isShowFromNotify) {
            this.router.navigate(['/surveys/question']);
        }
    }

    delete(versionId: string) {
        this.questionService.delete(versionId).subscribe(() => {
            this.onDeleteSuccess.emit();
            this.questionDetailModal.dismiss();
        });
    }

    getDetail(versionId: string) {
        this.isDetail = true;
        this.questionService
            .getDetail(versionId)
            .subscribe(
                (result: IActionResultResponse<QuestionDetailViewModel>) => {
                    const questionDetail = result.data;
                    if (questionDetail) {
                        this.questionDetail = questionDetail;
                        this.listQuestionTranslation = questionDetail.questionTranslations;
                        if (questionDetail.answers) {
                            this.listAnswer = questionDetail.answers;
                        }
                        if (this.questionDetail.questionType === QuestionType.selfResponded && this.questionDetail.totalAnswer > 0) {
                            this.renderListQuestionSelfResponed(this.questionDetail.totalAnswer);
                        } else {
                            this.listAnswerSelfResponded = [];
                        }
                    }
                    this.questionDetailModal.open();
                }
            );
    }

    renderAnswerVote(count: number) {
        if (count > 0) {
            let stars = '';
            for (let i = 0; i < count; i++) {
                stars += '<i class="fa fa-star-o fontSize24 color-orange cm-mgr-5"></i>';
            }
            return stars;
        }
    }

    renderListQuestionSelfResponed(totalAnswer: number) {
        if (totalAnswer && totalAnswer > 0) {
            this.listAnswerSelfResponded = _.range(1, totalAnswer + 1);
        } else {
            this.listAnswerSelfResponded = [];
        }
    }

    updateStatus(status: number) {
        if (status === QuestionStatus.decline) {
            this.questionExplainDeclineReasonComponent.show();
            return;
        }
        this.questionService.updateStatus(this.questionDetail.versionId, status, '').subscribe(() => {
            this.onUpdateStatusSuccess.emit();
            this.questionDetailModal.dismiss();
        });
    }

    updateStatusSuccess() {
        this.onUpdateStatusSuccess.emit();
    }
}
