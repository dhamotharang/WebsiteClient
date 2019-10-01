import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BaseListComponent} from '../../../../base-list.component';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {NewsService} from '../service/news.service';
import {NewViewHistoryViewModel} from '../viewmodel/new-view-history.viewmodel';
import {finalize, map} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {FilterLink} from '../../../../shareds/models/filter-link.model';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {HelperService} from '../../../../shareds/services/helper.service';
import {UtilService} from '../../../../shareds/services/util.service';
import {NewsFormComponent} from '../news-form/news-form.component';

@Component({
    selector: 'app-news-view-history',
    templateUrl: './new-view-history.component.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        NewsService, HelperService, UtilService]
})

export class NewViewHistoryComponent extends BaseListComponent<NewViewHistoryViewModel> implements OnInit {
    @ViewChild(NewsFormComponent) newsFormComponent: NewsFormComponent;
    fromDate;
    toDate;
    browser;
    language;
    isLike;
    newTitle;
    newId;
    listBrowser = [];
    listLanguage = [];

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private location: Location,
                private utilService: UtilService,
                private newsService: NewsService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.NEWS, this.pageId.NEWS_LIST, 'Quản lý tin tức', 'Lịch sử truy cập bài viết');

        this.route.params.subscribe((params: any) => {
            const id = params['id'];
            if (id) {
                this.newId = id;
            }
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.fromDate = params.fromDate ? params.fromDate : '';
            this.toDate = params.toDate ? params.toDate : '';
            this.browser = params.broswer ? params.browser : '';
            this.isLike = params.isLike ? Boolean(params.isLike) : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });

        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.newsService.viewHistory(this.newId, this.fromDate, this.toDate, this.browser, this.language, this.isLike,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<NewViewHistoryViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    resetFormSearch() {
        this.keyword = '';
        this.fromDate = '';
        this.toDate = '';
        this.browser = '';
        this.language = '';
        this.isLike = '';
    }

    private renderFilterLink() {
        const path = `news/view-history${this.newId}`;
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('fromDate', this.fromDate),
            new FilterLink('toDate', this.toDate),
            new FilterLink('browser', this.browser),
            new FilterLink('isLike', this.isLike),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
