import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { ExamOverviewViewModel } from '../viewmodels/exam-overview.viewmodel';
import { ActivatedRoute, Router } from '@angular/router';
import { DoExamService } from '../service/do-exam.service';
import { finalize } from 'rxjs/internal/operators';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-survey-info',
    templateUrl: './exam-overview.component.html',
    styleUrls: ['../../survey.component.scss'],
    providers: [DoExamService]
})

export class ExamOverviewComponent extends BaseListComponent<ExamOverviewViewModel> implements OnInit {
    surveyId: string;
    examOverviewInfo: ExamOverviewViewModel;
    errorMessage = '';

    constructor(private route: ActivatedRoute,
                private router: Router,
                private spinnerService: SpinnerService,
                private doExamService: DoExamService) {
        super();
        this.examOverviewInfo = new ExamOverviewViewModel();
    }

    ngOnInit() {
        this.subscribers.routeData = this.route.data.subscribe((data: { data: any }) => {
            this.surveyId = data.data;
        });
        this.getOverview();
    }

    getOverview() {
        this.spinnerService.show();
        this.doExamService.getOverviews(this.surveyId)
            .pipe(finalize(() => this.spinnerService.hide()))
            .subscribe((data: ActionResultViewModel<ExamOverviewViewModel>) => {
                this.examOverviewInfo = data.data;
            }, (errorResponse: any) => {
                const error = errorResponse.error;
                this.errorMessage = error.message;
            });
    }

    transform(time: number): string {
        if (time >= 0) {
            const hours: number = Math.floor(time / 3600);
            const minutes: number = Math.floor((time % 3600) / 60);
            return ('00' + hours).slice(-2) + ':' + ('00' + minutes).slice(-2) + ':' + ('00' + Math.floor(time - minutes * 60)).slice(-2);
        } else {
            return '00:00:00';
        }
    }

    doExam() {
        console.log(this.examOverviewInfo, this.examOverviewInfo.surveyUserId);
        this.router.navigate([`/surveys/exam/${this.examOverviewInfo.surveyId}`]);
    }
}
