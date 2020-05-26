import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {BannerHistoryViewModel} from '../viewmodel/banner-history.viewmodel';
import {finalize, map} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {ActivatedRoute} from '@angular/router';
import {UtilService} from '../../../shareds/services/util.service';
import {Location} from '@angular/common';
import {BannerService} from '../service/banner.service';
import {NhModalComponent} from '../../../shareds/components/nh-modal/nh-modal.component';
import {FilterLink} from '../../../shareds/models/filter-link.model';

@Component({
    selector: 'app-banner-history',
    templateUrl: './banner-history.component.html'
})

export class BannerHistoryComponent extends BaseListComponent<BannerHistoryViewModel> implements OnInit {
    @ViewChild('bannerHistoryFormModal', {static: true}) bannerHistoryFormModal: NhModalComponent;

    fromDate;
    toDate;
    browser;
    language;
    listBrowser = [];
    listLanguage = [];
    bannerId;
    height;
    bannerTitle;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private location: Location,
                private cdr: ChangeDetectorRef,
                private bannerService: BannerService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.BANNER, 'Quản lý Banner', 'Lịch sử xem banner');
        this.route.params.subscribe((params: any) => {
            const id = params['id'];
            if (id) {
                this.bannerId = id;
            }
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.fromDate = params.fromDate ? params.fromDate : '';
            this.toDate = params.toDate ? params.toDate : '';
            this.browser = params.broswer ? params.browser : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });

        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.renderFilterLink();
        this.isSearching = true;
        this.listItems$ = this.bannerService.searchHistory(this.bannerId, this.fromDate, this.toDate, this.browser, this.language,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<BannerHistoryViewModel>) => {
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
    }

    private renderFilterLink() {
        const path = `news/view-history/${this.bannerId}`;
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('fromDate', this.fromDate),
            new FilterLink('toDate', this.toDate),
            new FilterLink('browser', this.browser),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
