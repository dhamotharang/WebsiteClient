import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../../base-list.component';
import {AgencyViewModel} from '../model/agency.viewmodel';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {HelperService} from '../../../../shareds/services/helper.service';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from '../../../../shareds/services/util.service';
import {AgencyService} from '../agency-service';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {finalize} from 'rxjs/operators';
import {FilterLink} from '../../../../shareds/models/filter-link.model';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-agency-list',
    templateUrl: './agency-list.component.html',
    styleUrls: ['./agency-list.component.css'],
    providers: [HelperService]
})
export class AgencyListComponent extends BaseListComponent<AgencyViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDeleteBrand') swalConfirmDelete: SwalComponent;
    isActive: boolean;
    agencyId: string;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private agencyService: AgencyService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.AGENCY, this.pageId.AGENCY, 'Quản lý đại lý', 'Quản lý đại lý');
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<AgencyViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listItems = data.items;
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.isActive = params.isActive !== null && params.isActive !== '' && params.isActive !== undefined
                ? Boolean(params.isActive) : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.agencyId);
        });
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.agencyService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<AgencyViewModel>) => {
                this.totalRows = data.totalRows;
                this.listItems = data.items;
            });
    }

    selectIsActive(value) {
        if (value) {
            this.isActive = value.id;
        } else {
            this.isActive = null;
        }

        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.isActive = null;
        this.search(1);
    }

    add() {
        // this.brandFormComponent.add();
    }

    edit(agency: AgencyViewModel) {
        // this.brandFormComponent.edit(brand.id);
    }

    delete(id: string) {
        this.agencyService.delete(id)
            .subscribe(() => {
                this.search(1);
            });
    }

    updateStatus(item: AgencyViewModel) {
        this.agencyService.updateStatus(item.id, !item.isActive).subscribe((result: ActionResultViewModel) => {
            item.isActive = !item.isActive;
        });
    }

    confirm(value: AgencyViewModel) {
        this.agencyId = value.id;
        this.swalConfirmDelete.show();
    }

    private renderFilterLink() {
        const path = 'products/brands';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }

}
