import {Component, OnInit, Inject, AfterContentInit, ViewChild, AfterViewInit} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {finalize, map} from 'rxjs/operators';
import * as _ from 'lodash';
import {ToastrService} from 'ngx-toastr';
import {HelperService} from '../../../../shareds/services/helper.service';
import {DestroySubscribers} from '../../../../shareds/decorator/destroy-subscribes.decorator';
import {CheckPermission} from '../../../../shareds/decorator/check-permission.decorator';
import {BaseListComponent} from '../../../../base-list.component';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {UtilService} from '../../../../shareds/services/util.service';
import {FilterLink} from '../../../../shareds/models/filter-link.model';
import {PatientResourceSearchViewModel} from './models/patient-resource-search.viewmodel';
import {PatientResourceService} from './service/patient-resource.service';
import {PatientResourceFormComponent} from './patient-resource-form/patient-resource-form.component';
import {ISearchResult} from '../../../../interfaces/isearch.result';

@Component({
    selector: 'app-patient-source',
    templateUrl: './patient-resource.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, PatientResourceService
    ]
})

export class PatientResourceComponent extends BaseListComponent<PatientResourceSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(PatientResourceFormComponent, {static: true}) patientSourceForm: PatientResourceFormComponent;
    isActive;
    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private patientResourceService: PatientResourceService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.PATIENT, this.pageId.CONFIG_PATIENT_SOURCE, 'Quản lý khách hàng', 'Cấu hình nguồn khách');
        this.listItems$ = this.route.data.pipe(map((result: { data: ISearchResult<PatientResourceSearchViewModel> }) => {
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
    }

    searchKeyUp(keyword) {
        this.keyword = keyword;
        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.patientResourceService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((data: ISearchResult<PatientResourceSearchViewModel>) => {
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
        this.patientSourceForm.add();
    }

    edit(patientResource: PatientResourceSearchViewModel) {
        this.patientSourceForm.edit(patientResource.id);
    }

    delete(id: string) {
        this.patientResourceService.delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
                return;
            });
    }

    private renderFilterLink() {
        const path = 'config-customer/patient-source';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
