import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {UtilService} from '../../../shareds/services/util.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {Location} from '@angular/common';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {HelperService} from '../../../shareds/services/helper.service';
import {FilterLink} from '../../../shareds/models/filter-link.model';
import {BaseListComponent} from '../../../base-list.component';
import {WarehouseSearchViewModel} from './viewmodel/warehouse-search.viewmodel';
import {WarehouseService} from './service/warehouse.service';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import * as _ from 'lodash';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    providers: [HelperService]
})

export class WarehouseComponent extends BaseListComponent<WarehouseSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDelete') swalConfirmDelete: SwalComponent;
    isActive;
    listWarehouse: WarehouseSearchViewModel[];
    warehouseId: string;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private warehouseService: WarehouseService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.WAREHOUSE_MANAGEMENT, 'Quản lý kho', 'Quản lý kho');
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<WarehouseSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listWarehouse = this.rendResult(data.items);
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
            this.delete(this.warehouseId);
        });
    }

    searchKeyUp(keyword) {
        this.keyword = keyword;
        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.warehouseService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<WarehouseSearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listWarehouse = this.rendResult(data.items);
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

    onPageClick(page: number) {
        this.currentPage = page;
        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.isActive = null;
        this.search(1);
    }

    edit(warehouse: WarehouseSearchViewModel) {
        this.router.navigate([`/warehouses/edit/${warehouse.id}`]);
    }

    delete(id: string) {
        this.warehouseService.delete(id)
            .subscribe(() => {
                _.remove(this.listWarehouse, (item: WarehouseSearchViewModel) => {
                    return item.id === id;
                });
            });
    }

    updateStatus(item: WarehouseSearchViewModel) {
        this.warehouseService.updateStatus(item.id, !item.isActive).subscribe((result: ActionResultViewModel) => {
            item.isActive = !item.isActive;
        });
    }

    confirm(value: WarehouseSearchViewModel) {
        this.swalConfirmDelete.show();
        this.warehouseId = value.id;
    }

    detail(warehouse: WarehouseSearchViewModel) {
        this.router.navigate([`/warehouses/detail/${warehouse.id}`]);
    }

    private rendResult(list: WarehouseSearchViewModel[]) {
        if (list && list.length > 0) {
            _.each(list, (item: WarehouseSearchViewModel) => {
                if (item.listManagerFullName && item.listManagerFullName.length > 0) {
                    item.managerWarehouses = _.join(item.listManagerFullName, ', ');
                }
            });

            return list;
        }
    }

    private renderFilterLink() {
        const path = 'warehouses';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
