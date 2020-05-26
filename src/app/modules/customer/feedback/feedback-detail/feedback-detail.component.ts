import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {FeedbackService} from '../feedback.service';
import {FeedbackDetailViewModel} from '../viewmodel/feedback-detail.viewmodel';
import {NhModalComponent} from '../../../../shareds/components/nh-modal/nh-modal.component';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-customer-feedback-detail',
    templateUrl: './feedback-detail.component.html'
})
export class FeedbackDetailComponent {
    @ViewChild('feedbackDetailModal', {static: true}) feedbackDetailModal: NhModalComponent;
    feedbackDetail: FeedbackDetailViewModel;
    @Output() saveSuccessfully = new EventEmitter();
    constructor(private feedbackService: FeedbackService) {
    }

    getDetail(id: string) {
        this.feedbackService
            .getDetail(id)
            .subscribe((result: ActionResultViewModel<FeedbackDetailViewModel>) => {
                    if (result.data) {
                        this.feedbackDetail = result.data;
                    }
                    this.feedbackDetailModal.open();
                }
            );
    }

    closeModal() {
        this.feedbackDetailModal.dismiss();
    }

    updateView() {
        this.feedbackService.updateResolve(this.feedbackDetail.id, this.feedbackDetail).subscribe((result: any) => {
            this.saveSuccessfully.emit(this.feedbackDetail);
        });
    }
}
