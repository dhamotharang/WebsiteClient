import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HelperService } from '../../../shareds/services/helper.service';
import { SurveyGroupService } from './services/survey-group.service';
import { UtilService } from '../../../shareds/services/util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { finalize, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { QuestionGroupSearchViewModel } from '../question-group/viewmodels/question-group-search-viewmodel';
import { BaseListComponent } from '../../../base-list.component';
import { SurveyGroupSearchViewModel } from './viewmodels/survey-group-search.viewmodel';
import { SurveyGroupFormComponent } from './survey-group-form/survey-group-form.component';

@Component({
    selector: 'app-survey-survey-group',
    templateUrl: './survey-group.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, SurveyGroupService
    ]
})

export class SurveyGroupComponent extends BaseListComponent<SurveyGroupSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(SurveyGroupFormComponent) surveyGroupFormComponent: SurveyGroupFormComponent;
    isActive;
    height;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private cdr: ChangeDetectorRef,
                private surveyGroupService: SurveyGroupService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.SURVEY, this.pageId.SURVEY_CATEGORY, 'Quản lý nhóm câu hỏi', 'Cấu hình nhóm câu hỏi');
        this.listItems$ = this.route.data.pipe(map((result: { data: ISearchResult<SurveyGroupSearchViewModel> }) => {
                const data = result.data;
                this.totalRows = data.totalRows;
                return data.items;
            })
        );
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.isActive = params.isActive !== null && params.isActive !== '' && params.isActive !== undefined
                ? Boolean(params.isActive) : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 270;
        this.cdr.detectChanges();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 270;
    }

    searchKeyUp(keyword) {
        this.keyword = keyword;
        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.surveyGroupService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((data: ISearchResult<SurveyGroupSearchViewModel>) => {
                    this.totalRows = data.totalRows;
                    return data.items;
                }));
    }

    onPageClick(page: number) {
        this.currentPage = page;
        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.isActive = null;
        this.search(1);
    }

    add() {
        this.surveyGroupFormComponent.add();
    }

    edit(questionGroup: QuestionGroupSearchViewModel) {
        this.surveyGroupFormComponent.edit(questionGroup.id);
    }

    delete(id: number) {
        this.surveyGroupService.delete(id)
            .subscribe(() => {
                this.search(1);
            });
    }

    private renderFilterLink() {
        const path = 'surveys/survey-group';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
