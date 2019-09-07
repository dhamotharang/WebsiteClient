import {AfterViewInit, Component, enableProdMode, Inject, OnInit, ViewChild} from '@angular/core';
import {SupplierSearchViewModel} from './viewmodel/supplier-search.viewmodel';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {finalize} from 'rxjs/operators';
import {SupplierFormComponent} from './supplier-form/supplier-form.component';
import {SupplierService} from './service/supplier.service';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
import {SupplierDetailComponent} from './supplier-detail/supplier-detail.component';
import {HelperService} from '../../../shareds/services/helper.service';
import {BaseListComponent} from '../../../base-list.component';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {UtilService} from '../../../shareds/services/util.service';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {FilterLink} from '../../../shareds/models/filter-link.model';
if (!/localhost/.test(document.location.host)) {
    enableProdMode();
}
@Component({
    selector: 'app-product-supplier',
    templateUrl: './supplier.component.html',
    providers: [HelperService, SupplierService]
})

export class SupplierComponent extends BaseListComponent<SupplierSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(SupplierFormComponent ) supplierFormComponent: SupplierFormComponent;
    @ViewChild(SupplierDetailComponent) supplierDetailComponent: SupplierDetailComponent;
    @ViewChild('confirmDeleteSupplier') swalConfirmDelete: SwalComponent;
    isActive;
    address;
    listSupplier: SupplierSearchViewModel[];
    supplierId: string;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private supplierService: SupplierService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.PRODUCT, this.pageId.SUPPLIER, 'Quản lý nhà cung cấp', 'Quản lý sản phẩm');
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<SupplierSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listSupplier = data.items;
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.address = params.address ? params.address : '';
            this.isActive = params.isActive !== null && params.isActive !== '' && params.isActive !== undefined
                ? Boolean(params.isActive) : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.supplierId);
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
        this.supplierService.search(this.keyword, this.address, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<SupplierSearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listSupplier = data.items;
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
        this.address = '';
        this.isActive = null;
        this.search(1);
    }

    add() {
        this.supplierFormComponent.add();
    }

    edit(supplier: SupplierSearchViewModel) {
        this.supplierFormComponent.edit(supplier.id);
    }

    delete(id: string) {
        this.supplierService.delete(id)
            .subscribe(() => {
                this.search(1);
                // _.remove(this.listSupplier, (item: SupplierSearchViewModel) => {
                //     return item.id === id;
                // });
            });
    }

    detail(supplier: SupplierSearchViewModel) {
        this.supplierDetailComponent.show(supplier.id);
    }

    updateStatus(item: SupplierSearchViewModel) {
        this.supplierService.updateStatus(item.id, !item.isActive).subscribe((result: ActionResultViewModel) => {
            item.isActive = !item.isActive;
        });
    }

    confirm(value: SupplierSearchViewModel) {
        this.supplierId = value.id;
        this.swalConfirmDelete.show();
    }

    changePageSize(value) {
        this.pageSize = value;
        this.search(1);
    }

    rightClickContextMenu(e) {
        if (e.row.rowType === 'data' && (this.permission.delete || this.permission.edit)) {
            const data = e.row.data;
            e.items = [
                {
                    text: 'Xem',
                    icon: 'info',
                    disabled: !this.permission.view,
                    onItemClick: () => {
                        this.detail(data);
                    }
                },
                {
                    text: 'Sửa',
                    icon: 'edit',
                    disabled: !this.permission.edit,
                    onItemClick: () => {
                        this.edit(data);
                    }
                }, {
                    text: 'Xóa',
                    icon: 'remove',
                    disabled: !this.permission.delete,
                    onItemClick: () => {
                        this.confirm(data);
                    }
                }];
        }
    }

    private renderFilterLink() {
        const path = 'products/suppliers';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('address', this.address),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
