import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { SurveyUsersReportViewModel } from './survey-users-report.viewmodel';
import { SurveyReportService } from '../survey-report.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { SurveyReportByUserDetailComponent } from '../survey-report-by-user-detail/survey-report-by-user-detail.component';
import { SurveyReportUserAnswerTimesComponent } from '../survey-report-user-answer-times/survey-report-user-answer-times.component';

@Component({
    selector: 'app-survey-report-by-user',
    templateUrl: './survey-user-report.component.html'
})

export class SurveyUserReportComponent extends BaseListComponent<SurveyUsersReportViewModel> implements OnInit {
    // @ViewChild('surveyReportByUserDetail') surveyReportByUserDetail: SurveyReportByUserDetailComponent;
    @ViewChild('surveyReportUserAnswerTimesComponent') surveyReportUserAnswerTimesComponent: SurveyReportUserAnswerTimesComponent;
    surveyId: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private surveyReportService: SurveyReportService) {
        super();

        this.subscribers.params = this.route.params.subscribe((params: any) => {
            this.surveyId = params.id;
            this.search(1);
        });
    }

    ngOnInit() {
    }

    refresh() {
        this.keyword = '';
        this.search(1);
    }

    search(currentPage: number) {
        this.isSearching = true;
        this.currentPage = currentPage;
        this.listItems$ = this.surveyReportService
            .getUserReport(this.surveyId, this.keyword, this.currentPage, this.pageSize)
            .pipe(
                finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<SurveyUsersReportViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
    }

    showDetail(surveyId: string, surveyUserId: string) {
        this.surveyReportUserAnswerTimesComponent.show(surveyId, surveyUserId);
    }
}
