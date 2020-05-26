import {Component, OnInit, Inject, AfterContentInit, ViewChild, AfterViewInit} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {finalize, map} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {BaseListComponent} from '../../base-list.component';
import {HelperService} from '../../shareds/services/helper.service';
import * as moment from 'moment';
import {IPageId, PAGE_ID} from '../../configs/page-id.config';
import {UtilService} from '../../shareds/services/util.service';
import {CustomerSearchViewModel} from './model/customer-search.viewmodel';
import {ISearchResult} from '../../interfaces/isearch.result';
import {CustomerService} from './service/customer.service';
import {FilterLink} from '../../shareds/models/filter-link.model';
import {CustomerFormComponent} from './customer-form/customer-form.component';
import {CustomerDetailComponent} from './customer-detail/customer-detail.component';
import {APP_CONFIG, IAppConfig} from '../../configs/app.config';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, CustomerService
    ]
})

export class CustomerComponent extends BaseListComponent<CustomerSearchViewModel> implements OnInit {
    @ViewChild(CustomerFormComponent, {static: true}) customerForm: CustomerFormComponent;
    @ViewChild(CustomerDetailComponent, {static: true}) customerDetail: CustomerDetailComponent;
    createDate;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private customerService: CustomerService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.PATIENT, this.pageId.LIST_PATIENT,
            'Quản lý khách hàng', 'Danh sách khách hàng');

        this.listItems$ = this.route.data.pipe(map((result: { data: ISearchResult<CustomerSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.customerService.search(this.keyword, this.createDate, 1, this.pageSize)
            .pipe(finalize(() => {
                    this.isSearching = false;
                }),
                map((data: ISearchResult<CustomerSearchViewModel>) => {
                    this.totalRows = data.totalRows;
                    return data.items;
                }));
    }

    resetFormSearch() {
        this.keyword = '';
        this.createDate = moment().format('DD/MM/YYYY');
        this.search(1);
    }

    add() {
        this.customerForm.add();
    }

    edit(id: string) {
        this.customerForm.edit(id);
    }

    detail(id: string) {
        this.customerDetail.getDetail(id);
    }

    delete(id: string) {
        this.customerService.delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
                return;
            });
    }

    private renderFilterLink() {
        const path = 'customers';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
