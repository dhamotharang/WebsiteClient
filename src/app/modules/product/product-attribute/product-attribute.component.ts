import {AfterViewInit, Component, enableProdMode, Inject, OnInit, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../base-list.component';
import {ProductAttributeViewModel} from './product-attribute.viewmodel';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {ProductAttributeService} from './product-attribute.service';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {NhSelect} from '../../../shareds/components/nh-select/nh-select.component';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {ToastrService} from 'ngx-toastr';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {SwalComponent} from '@sweetalert2/ngx-sweetalert2';
// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }
@Component({
    selector: 'app-product-attribute',
    templateUrl: './product-attribute.component.html'
})
export class ProductAttributeComponent extends BaseListComponent<ProductAttributeViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDelete') swalConfirmDelete: SwalComponent;
    isSelfContent: boolean;
    isRequire: boolean;
    isActive: boolean;
    productAttributeValue: string;

    constructor(
        @Inject(PAGE_ID) public pageId: IPageId,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private productAttributeService: ProductAttributeService) {
        super();

        this.subscribers.routeData = this.route.data.subscribe((result: { data: SearchResultViewModel<ProductAttributeViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listItems = data.items;
        });
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.PRODUCT_ATTRIBUTE, 'Quản lý sản phẩm', 'Thuộc tính sản phẩm');
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.productAttributeValue);
        });
    }

    onActiveStatusSelected(event: NhSelect) {
        if (event) {
            this.isActive = event.id;
        } else {
            this.isActive = null;
        }
        this.search(1);
    }

    refresh() {
        this.keyword = '';
        this.isSelfContent = null;
        this.isActive = null;
        this.isRequire = null;
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.subscribers.searchProductAttributes = this.productAttributeService
            .search(this.keyword, this.isSelfContent, this.isRequire, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<ProductAttributeViewModel>) => {
                this.totalRows = result.totalRows;
                this.listItems = result.items;
            });
    }

    detail(productAttribute: ProductAttributeViewModel) {
        this.router.navigateByUrl(`/products/attributes/${productAttribute.id}`);
    }

    edit(productAttribute: ProductAttributeViewModel) {
        this.router.navigateByUrl(`/products/attributes/edit/${productAttribute.id}`);
    }

    confirm(productAttribute: ProductAttributeViewModel) {
        this.productAttributeValue = productAttribute.id;
        this.swalConfirmDelete.show();
    }

    delete(id: string) {
        this.subscribers.delete = this.productAttributeService.delete(id)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                this.search(this.currentPage);
            });
    }

    changeSelfContent(attribute: ProductAttributeViewModel) {
        this.subscribers.changeSelfContent = this.productAttributeService.updateSelfContent(attribute.id, !attribute.isSelfContent)
            .subscribe((result: ActionResultViewModel) => this.toastr.success(result.message));
    }

    changeMultiple(attribute: ProductAttributeViewModel) {
        this.subscribers.changeMultiple = this.productAttributeService.updateMultiple(attribute.id, !attribute.isMultiple)
            .subscribe((result: ActionResultViewModel) => this.toastr.success(result.message));
    }

    changeRequire(attribute: ProductAttributeViewModel) {
        this.subscribers.changeRequire = this.productAttributeService.updateRequire(attribute.id, !attribute.isRequire)
            .subscribe((result: ActionResultViewModel) => this.toastr.success(result.message));
    }

    changeActive(attribute: ProductAttributeViewModel) {
        this.subscribers.changeActive = this.productAttributeService.updateActive(attribute.id, !attribute.isActive)
            .subscribe((result: ActionResultViewModel) => this.toastr.success(result.message));
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
}
