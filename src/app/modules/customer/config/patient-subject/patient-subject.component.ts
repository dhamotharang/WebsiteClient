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
import {ISearchResult} from '../../../../interfaces/isearch.result';
import {PatientSubjectSearchViewModel} from './models/patient-subject-search.viewmodel';
import {PatientSubjectService} from './service/patient-subject.service';
import {PatientSubjectFormComponent} from './patient-subject-form/patient-subject-form.component';

@Component({
    selector: 'app-patient-subject',
    templateUrl: './patient-subject.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, PatientSubjectService
    ]
})

export class PatientSubjectComponent extends BaseListComponent<PatientSubjectSearchViewModel> implements OnInit, AfterViewInit {
     @ViewChild(PatientSubjectFormComponent) patientSubjectForm: PatientSubjectFormComponent;
    isActive;
    totalReduction;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private patientSubjectService: PatientSubjectService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.PATIENT, this.pageId.CONFIG_PATIENT_SUBJECT,
            'Quản lý khách hàng', 'Cấu hình đối tượng khách hàng');
        this.listItems$ = this.route.data.pipe(map((result: { data: ISearchResult<PatientSubjectSearchViewModel> }) => {
                const data = result.data;
                this.totalRows = data.totalRows;
                return data.items;
            })
        );
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.totalReduction = params.totalReduction !== null && params.totalReduction !== ''
                && params.totalReduction !== undefined ? parseFloat(params.totalReduction) : '';
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
        this.listItems$ = this.patientSubjectService.search(this.keyword, this.totalReduction, this.isActive,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((data: ISearchResult<PatientSubjectSearchViewModel>) => {
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
        this.totalReduction = '';
        this.isActive = null;
        this.search(1);
    }

    add() {
         this.patientSubjectForm.add();
    }

    edit(patientSubject: PatientSubjectSearchViewModel) {
         this.patientSubjectForm.edit(patientSubject.id);
    }

    delete(id: string) {
        this.patientSubjectService.delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
                return;
            });
    }

    private renderFilterLink() {
        const path = 'config-customer/patient-subject';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('totalReduction', this.totalReduction),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
