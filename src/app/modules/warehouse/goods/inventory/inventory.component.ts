import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { UtilService } from '../../../../shareds/services/util.service';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { NhSuggestion } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { FilterLink } from '../../../../shareds/models/filter-link.model';
import { Location } from '@angular/common';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { InventorySearchViewModel } from './viewmodel/inventory-search.viewmodel';
import { BaseListComponent } from '../../../../base-list.component';
import { InventoryService } from './service/inventory.service';
import { InventoryFormComponent } from './inventory-form/inventory-form.component';
import { WarehouseSuggestionComponent } from '../../warehouse/warehouse-suggestion/warehouse-suggestion.component';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { InventoryStatus } from './model/inventory.model';

@Component({
    selector: 'app-inventory',
    templateUrl: './inventory.component.html'
})

export class InventoryComponent extends BaseListComponent<InventorySearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDelete') swalConfirmDelete: SwalComponent;
    @ViewChild(WarehouseSuggestionComponent) warehouseSuggestionComponent: WarehouseSuggestionComponent;
    @ViewChild(InventoryFormComponent) inventoryForm: InventoryFormComponent;
    warehouses;
    fromDate: string;
    toDate: string;
    warehouseId;
    warehouseName;
    listInventory: InventorySearchViewModel[];
    inventoryId;
    isResolve;
    inventoryStatus = InventoryStatus;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private toastr: ToastrService,
                private invertoryService: InventoryService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.INVENTORY, 'Kiểm kê', 'Quản lý kho');
        // this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<InventorySearchViewModel> }) => {
        //     const data = result.data;
        //     this.listInventory = this.rendResult( data.items);
        //     this.totalRows = data.totalRows;
        // });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.fromDate = params.keyword ? params.fromDate : '';
            this.toDate = params.toDate ? params.toDate : '';
            this.isResolve = params.isResolve !== null && params.isResolve !== '' && params.isResolve !== undefined
                ? parseInt(params.isResolve) : null;
            this.warehouseId = params.warehouseId ? params.warehouseId : null;
            this.warehouseName = params.warehouseName ? params.warehouseName : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });

        this.listItems$ = this.route.data.pipe(
            map((result: { data: SearchResultViewModel<InventorySearchViewModel> }) => {
                const data = result.data;
                this.totalRows = data.totalRows;
                return data.items;
            }));
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.inventoryId);
        });
    }

    add() {
        this.inventoryForm.add();
    }

    search(currentPage) {
        if (!this.warehouseId) {
            this.toastr.error('Please select warehouse');
            return;
        }
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.invertoryService.search(this.keyword, this.fromDate, this.toDate, this.isResolve,
            this.warehouseId, this.currentPage, this.pageSize)
            .pipe(
                finalize(() => {
                    this.isSearching = false;
                }),
                map((result: SearchResultViewModel<InventorySearchViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
        //     .subscribe(() => {
        //     // this.listInventory = this.rendResult(result.items);
        //     // this.totalRows = result.totalRows;
        // });
    }

    onPageClick(page: number) {
        this.currentPage = page;
        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.fromDate = '';
        this.toDate = '';
        this.warehouseSuggestionComponent.clear();
        this.search(1);
    }

    edit(inventory: InventorySearchViewModel) {
        // this.inventoryForm.edit(inventory.id);
        this.router.navigateByUrl(`/goods/inventories/edit/${inventory.id}`);
    }

    delete(id: string) {
        this.invertoryService.delete(id).subscribe(() => {
            this.search(1);
            // _.remove(this.listInventory, (item: InventorySearchViewModel) => {
            //     return item.id === id;
            // });
        });
    }

    detail(inventory: InventorySearchViewModel) {
        this.router.navigateByUrl(`/goods/inventories/${inventory.id}`);
        // this.goodsDeliveryNoteDetailComponent.show(goodsDeliveryNote.id);
    }

    confirm(value: InventorySearchViewModel) {
        this.swalConfirmDelete.show();
        this.inventoryId = value.id;
    }

    selectWarehouse(warehouse: NhSuggestion) {
        if (warehouse) {
            this.warehouseId = warehouse.id;
            this.warehouseName = warehouse.name;
        } else {
            this.warehouseId = null;
            this.warehouseName = '';
        }

        this.search(1);
    }

    selectResolve(value) {
        this.isResolve = value ? value.id : '';
    }

    // private rendResult(list: InventorySearchViewModel[]) {
    //     if (list != null && list.length > 0) {
    //         _.each(list, (item: InventorySearchViewModel) => {
    //             if (item.inventoryMemberFullNames && item.inventoryMemberFullNames.length > 0) {
    //                 item.members = _.join(item.inventoryMemberFullNames, ', ');
    //             }
    //         });
    //
    //         return list;
    //     }
    // }

    private renderFilterLink() {
        const path = '/goods/inventories';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('fromDate', this.fromDate),
            new FilterLink('toDate', this.toDate),
            new FilterLink('isResolve', this.isResolve),
            new FilterLink('warehouseId', this.warehouseId),
            new FilterLink('warehouseName', this.warehouseName),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
