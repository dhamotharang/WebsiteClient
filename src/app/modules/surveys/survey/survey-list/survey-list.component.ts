import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { SurveyViewModel } from './survey.viewmodel';
import { SurveyService } from '../survey.service';
import { finalize, map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { Survey } from '../survey.model';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { SurveyFormComponent } from '../survey-form/survey-form.component';
import { SurveyGroupService } from '../../survey-group/services/survey-group.service';
import { TreeData } from '../../../../view-model/tree-data';

@Component({
    selector: 'app-survey',
    templateUrl: './survey-list.component.html'
})

export class SurveyListComponent extends BaseListComponent<SurveyViewModel> implements OnInit {
    @ViewChild(SurveyFormComponent) surveyFormComponent: SurveyFormComponent;
    surveyGroupId: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    surveyGroupTree = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private surveyService: SurveyService,
                private surveyGroupService: SurveyGroupService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.SURVEY, this.pageId.SURVEY_LIST, 'Quản lý khảo sát', 'Danh sách khảo sát');
        this.subscribers.searchGroupTree = this.surveyGroupService.getTree()
            .subscribe((result: TreeData[]) => this.surveyGroupTree = result);

        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<SurveyViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));
    }

    onSurveyGroupSelected(surveyGroup: TreeData) {
        this.surveyGroupId = surveyGroup == null ? null : surveyGroup.id;
        this.search(1);
    }

    add() {
        this.surveyFormComponent.add();
    }

    addGroup() {

    }

    edit(id: string) {
        this.surveyFormComponent.edit(id);
    }

    delete(id: string) {
        this.subscribers.delete = this.surveyService
            .delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
            });
    }

    detail(id: string) {

    }

    report(id: string) {

    }

    refresh() {
        this.keyword = '';
        this.isActive = null;
        this.surveyGroupId = null;
        this.startDate = '';
        this.endDate = '';
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.surveyService
            .search(this.keyword, this.surveyGroupId, this.isActive, this.startDate, this.endDate, this.currentPage, this.pageSize)
            .pipe(
                finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<SurveyViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
    }
}
