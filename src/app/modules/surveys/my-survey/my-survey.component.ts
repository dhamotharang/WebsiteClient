import { AfterContentInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { SurveyReportService } from '../survey-report/survey-report.service';
import { BaseListComponent } from '../../../base-list.component';
import { TreeData } from '../../../view-model/tree-data';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { SurveyGroupService } from '../survey-group/services/survey-group.service';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { finalize, map } from 'rxjs/operators';
import { SurveyUserReportVewModel } from './survey-user-report.vewmodel';
import { SurveyReportUserAnswerTimesComponent } from '../survey-report/survey-report-user-answer-times/survey-report-user-answer-times.component';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { UtilService } from '../../../shareds/services/util.service';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-survey-my-survey',
    templateUrl: './my-survey.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        SurveyGroupService, SurveyReportService]
})

export class MySurveyComponent extends BaseListComponent<SurveyUserReportVewModel> implements OnInit {
    @ViewChild(SurveyReportUserAnswerTimesComponent) surveyReportUserAnswerTimesComponent: SurveyReportUserAnswerTimesComponent;
    surveyGroupTree;
    startDate;
    endDate;
    surveyGroupId;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private utilService: UtilService,
                private surveyGroupService: SurveyGroupService,
                private surveyReportService: SurveyReportService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.SURVEY, this.pageId.SURVEY_MY_SURVEY, 'Quản lý khảo sát', 'Bài khảo sát của tôi');
        this.subscribers.searchGroupTree = this.surveyGroupService.getTree()
            .subscribe((result: TreeData[]) => this.surveyGroupTree = result);

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.surveyGroupId = params.surveyGroupId !== null && params.surveyGroupId !== '' && params.surveyGroupId !== undefined
                ? parseInt(params.surveyGroupId) : '';
            this.startDate = params.startDate ? params.startDate : '';
            this.endDate = params.endate ? params.endDate : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });

        this.listItems$ = this.surveyReportService.getSurveyByUserId(this.keyword, this.surveyGroupId, this.startDate,
            this.endDate, this.currentPage, this.pageSize).pipe(
            finalize(() => this.isSearching = false),
            map((result: SearchResultViewModel<SurveyUserReportVewModel>) => {
                this.totalRows = result.totalRows;
                return result.items;
            })
        );
    }

    onSurveyGroupSelected(surveyGroup: TreeData) {
        this.surveyGroupId = surveyGroup == null ? null : surveyGroup.id;
        this.search(1);
    }

    refresh() {
        this.keyword = '';
        this.surveyGroupId = null;
        this.startDate = '';
        this.endDate = '';
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.surveyReportService
            .getSurveyByUserId(this.keyword, this.surveyGroupId, this.startDate, this.endDate, this.currentPage, this.pageSize)
            .pipe(
                finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<SurveyUserReportVewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
    }

    showDetail(surveyId: string, surveyUserId: string) {
        this.surveyReportUserAnswerTimesComponent.show(surveyId, surveyUserId);
    }

    private renderFilterLink() {
        const path = 'surveys/my-survey';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('surveyGroupId', this.surveyGroupId),
            new FilterLink('startDate', this.startDate),
            new FilterLink('endDate', this.endDate),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
