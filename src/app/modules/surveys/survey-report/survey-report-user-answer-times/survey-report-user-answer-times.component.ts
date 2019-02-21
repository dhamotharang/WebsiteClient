import { Component, OnInit, ViewChild } from '@angular/core';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { SurveyReportDetailViewModel } from '../survey-report-by-user-detail/view-models/survey-report-detail.viewmodel';
import { SurveyReportService } from '../survey-report.service';
import { SurveyReportByUserDetailComponent } from '../survey-report-by-user-detail/survey-report-by-user-detail.component';

@Component({
    selector: 'app-survey-report-user-answer-times',
    templateUrl: './survey-report-user-answer-times.component.html'
})

export class SurveyReportUserAnswerTimesComponent implements OnInit {
    @ViewChild('surveyUserAnswerTimesModal') surveyUserAnswerTimesModal: NhModalComponent;
    @ViewChild('surveyReportByUserDetail') surveyReportByUserDetailComponent: SurveyReportByUserDetailComponent;
    reportDetail: SurveyReportDetailViewModel;

    constructor(private surveyReportService: SurveyReportService) {
    }

    ngOnInit() {
    }

    show(surveyId: string, surveyUserId: string) {
        this.surveyUserAnswerTimesModal.open();
        this.surveyReportService.getSurveyUserReportDetail(surveyId, surveyUserId)
            .subscribe((result: SurveyReportDetailViewModel) => {
                this.reportDetail = result;
            });
    }

    detail(userAnswerTimesId: string) {
        this.surveyReportByUserDetailComponent.show(this.reportDetail.surveyId, this.reportDetail.surveyUserId, userAnswerTimesId);
    }
}
