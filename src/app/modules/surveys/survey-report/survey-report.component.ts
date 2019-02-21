import { Component, Inject, OnInit } from '@angular/core';
import { finalize, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../base-list.component';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { SurveyReportViewModel } from './view-models/survey-report.viewmodel';
import { SurveyReportService } from './survey-report.service';
import { SurveyGroupService } from '../survey-group/services/survey-group.service';
import { TreeData } from '../../../view-model/tree-data';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';

@Component({
    selector: 'app-survey-report',
    templateUrl: './survey-report.component.html',
    providers: [SurveyReportService]
})

export class SurveyReportComponent extends BaseListComponent<SurveyReportViewModel> implements OnInit {
    surveyGroupId: number;
    startDate: string;
    endDate: string;
    surveyGroupTree = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private surveyGroupService: SurveyGroupService,
                private surveyReportService: SurveyReportService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.SURVEY, this.pageId.SURVEY_REPORT, 'Quản lý khảo sát', 'Danh sách khảo sát');
        this.subscribers.searchGroupTree = this.surveyGroupService.getTree()
            .subscribe((result: TreeData[]) => this.surveyGroupTree = result);

        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<SurveyReportViewModel> }) => {
            const data = result.data;
            if (data) {
                this.totalRows = data.totalRows;
                return data.items;
            }
        }));
    }

    onSurveyGroupSelected(surveyGroup: TreeData) {
        this.surveyGroupId = surveyGroup == null ? null : surveyGroup.id;
        this.search(1);
    }

    detail(surveyId: string) {
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
        this.listItems$ = this.surveyReportService
            .search(this.keyword, this.surveyGroupId, this.startDate, this.endDate, this.currentPage, this.pageSize)
            .pipe(
                finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<SurveyReportViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
    }
}
