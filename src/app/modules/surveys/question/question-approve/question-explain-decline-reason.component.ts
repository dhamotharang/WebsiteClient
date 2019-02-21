import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { UtilService } from '../../../../shareds/services/util.service';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { QuestionService } from '../service/question.service';
import { finalize } from 'rxjs/internal/operators';
import { QuestionStatus } from '../models/question.model';
import { ChangeListQuestionStatusModel } from '../models/change-list-question-status.model';
import { IActionResultResponse } from '../../../../interfaces/iaction-result-response.result';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-survey-question-explain-decline-reason',
    templateUrl: './question-explain-decline-reason.component.html'
})
export class QuestionExplainDeclineReasonComponent {
    @ViewChild('explainDeclineReasonModal') explainDeclineReasonModal: NhModalComponent;
    @Input() questionVersionId: string;
    @Input() listQuestionVersionIds: string[];
    @Output() onUpdateSuccess = new EventEmitter();
    explain: string;
    errorMessage: string;
    isSaving = false;
    isUpdateMultiStatus;

    constructor(private utilService: UtilService,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private questionService: QuestionService) {
    }

    showModal() {
        this.explain = '';
    }
    show() {
        this.explainDeclineReasonModal.open();
    }

    save() {
        if (!this.explain) {
            this.errorMessage = 'Please enter decline reason.';
            return;
        }

        if (!this.isUpdateMultiStatus) {
            this.spinnerService.show();
            this.questionService.updateStatus(this.questionVersionId, QuestionStatus.decline, this.explain.trim())
                .pipe(finalize(() => this.spinnerService.hide()))
                .subscribe(() => {
                    this.explainDeclineReasonModal.dismiss();
                    this.onUpdateSuccess.emit(this.explain);
                    this.explain = '';
                    return;
                });
        } else {
            const listQuestionStatus: ChangeListQuestionStatusModel = {
                questionVersionIds: this.listQuestionVersionIds,
                questionStatus: QuestionStatus.decline,
                reason: this.explain.trim(),
            };
            this.spinnerService.show();
            this.questionService.updateMultiStatus(listQuestionStatus).pipe(finalize(() => this.spinnerService.hide()))
                .subscribe((result: any) => {
                    const listResult = _.filter(result, (item: IActionResultResponse) => {
                        return item.code > 0;
                    });
                    if (listResult && result && listResult.length === result.length) {
                        this.toastr.success('Update success');
                    } else {
                        this.toastr.error('Have question update error');
                    }
                    this.explainDeclineReasonModal.dismiss();
                    this.onUpdateSuccess.emit(this.explain);
                    this.explain = '';
                    return;
                });
        }
    }
}
