import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { JobSearchViewModel } from './models/job-search.viewmodel';
import { JobService } from './service/job.service';
import { HelperService } from '../../../../shareds/services/helper.service';
import { BaseListComponent } from '../../../../base-list.component';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { UtilService } from '../../../../shareds/services/util.service';
import { FilterLink } from '../../../../shareds/models/filter-link.model';
import { JobFormComponent } from './job-form/job-form.component';
import { TreeNode } from 'primeng/api';

@Component({
    selector: 'app-job',
    templateUrl: './job.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, JobService
    ]
})

export class JobComponent extends BaseListComponent<JobSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(JobFormComponent) jobFormComponent: JobFormComponent;
    isActive;
    jobs: TreeNode[] = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private jobService: JobService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.PATIENT, this.pageId.CONFIG_JOB, 'Quản lý khách hàng', 'Cấu hình nghề nghiệp');
        this.subscribers.routeDataJobTree = this.route.data.subscribe((result: { data: TreeNode[] }) => {
            // const data = result.data;
            // this.totalRows = data.totalRows;
            // return data.items;
            console.log(result.data);
            this.jobs = result.data;
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.isActive = params.isActive !== null && params.isActive !== '' && params.isActive !== undefined
                ? Boolean(params.isActive) : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
    }

    searchKeyUp(keyword) {
        this.keyword = keyword;
        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        // this.listItems$ = this.jobService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
        //     .pipe(finalize(() => this.isSearching = false),
        //         map((data: ISearchResult<JobSearchViewModel>) => {
        //             this.totalRows = data.totalRows;
        //             return data.items;
        //         }));

        this.subscribers.searchJobTree = this.jobService.search(this.keyword, this.isActive)
            .subscribe((result: TreeNode[]) => {
                this.jobs = result;
            });
        // .pipe(finalize(() => this.isSearching = false),
        //     map((data: ISearchResult<JobSearchViewModel>) => {
        //         this.totalRows = data.totalRows;
        //         return data.items;
        //     }));
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
        this.jobFormComponent.add();
    }

    edit(job: JobSearchViewModel) {
        this.jobFormComponent.edit(job.id);
    }

    delete(id: number) {
        this.jobService.delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
                return;
            });
    }

    private renderFilterLink() {
        const path = 'config-customer/jobs';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
