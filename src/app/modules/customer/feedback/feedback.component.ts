import {AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {FeedbackSearchViewModel} from './viewmodel/feedback-search.viewmodel';
import {FeedbackService} from './feedback.service';
import {ISearchResult} from '../../../interfaces/isearch.result';
import {map} from 'rxjs/operators';
import {finalize} from 'rxjs/internal/operators';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {UtilService} from '../../../shareds/services/util.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HelperService} from '../../../shareds/services/helper.service';
import {FeedbackDetailComponent} from './feedback-detail/feedback-detail.component';
import {FilterLink} from '../../../shareds/models/filter-link.model';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {FeedbackDetailViewModel} from './viewmodel/feedback-detail.viewmodel';
import * as _ from 'lodash';

@Component({
    selector: 'app-customer-feedback',
    templateUrl: './feedback.component.html',
    providers: [ Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, FeedbackService]
})

export class FeedbackComponent extends BaseListComponent<FeedbackSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(FeedbackDetailComponent) feedbackDetailComponent: FeedbackDetailComponent;
    fromDate;
    toDate;
    isResolve;
    height;
    listFeedback: FeedbackSearchViewModel[];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private cdr: ChangeDetectorRef,
                private helperService: HelperService,
                private utilService: UtilService,
                private feedbackService: FeedbackService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.PATIENT, this.pageId.FEEDBACK,
            'Quản lý khách hàng', 'Thông tin phản hồi');

        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<FeedbackSearchViewModel> }) => {
            this.listFeedback = result.data.items;
            this.totalRows = result.data.totalRows;
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.fromDate = params.fromDatre ? params.fromDate : '';
            this.toDate = params.toDate ? params.toDate : '';
            this.isResolve = params.isResolve ? Boolean(params.isResolve) : '';
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

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderLink();
        this.feedbackService.search(this.keyword, this.fromDate, this.toDate, this.isResolve, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: ISearchResult<FeedbackSearchViewModel>) => {
                this.listFeedback = data.items;
                this.totalRows = data.totalRows;
            });
    }

    resetFormSearch() {
        this.isResolve = '';
        this.fromDate = '';
        this.toDate = '';
        this.isResolve = '';
    }

    updateResolve(feedback: FeedbackSearchViewModel) {
        this.feedbackService.updateResolve(feedback.id, feedback);
    }

    updateSuccess(item: FeedbackDetailViewModel) {
        console.log(item);
        const index = _.findIndex(this.listFeedback, (items: FeedbackDetailViewModel) => {
            return items.id === item.id;
        });
        this.listFeedback[index] = item;
    }

    detail(feedback: FeedbackSearchViewModel) {
        this.feedbackDetailComponent.getDetail(feedback.id);
    }

    private renderLink() {
        const path = '/customers/feedback';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('fromDate', this.fromDate),
            new FilterLink('toDate', this.toDate),
            new FilterLink('isResolve', this.isResolve),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
