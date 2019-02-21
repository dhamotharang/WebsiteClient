import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ProductSearchViewModel} from './viewmodel/product-search.viewmodel';
import {finalize} from 'rxjs/operators';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {ProductService} from './service/product.service';
import {ProductCategoryService} from '../product-category/service/product-category-service';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {ProductResultViewModel} from './viewmodel/product-result.viewmodel';
import {HelperService} from '../../../shareds/services/helper.service';
import {BaseListComponent} from '../../../base-list.component';
import {NHDropdownTreeComponent} from '../../../shareds/components/nh-tree/nh-dropdown-tree.component';
import {TreeData} from '../../../view-model/tree-data';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {UtilService} from '../../../shareds/services/util.service';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {FilterLink} from '../../../shareds/models/filter-link.model';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.scss'],
    providers: [HelperService]
})
export class ProductComponent extends BaseListComponent<ProductSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDeleteProduct') swalConfirmDelete: SwalComponent;
    @ViewChild(NHDropdownTreeComponent) nHDropdownTreeComponent: NHDropdownTreeComponent;
    isActive;
    categoryId;
    isManagementByLot;
    categoryTree: TreeData[];
    listProduct: ProductResultViewModel[];
    productId: string;
    categorySelectText;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private productCategoryService: ProductCategoryService,
                private productService: ProductService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.PRODUCT_MANAGER, this.pageId.PRODUCT, 'Quản lý sản phẩm', 'Quản lý sản phẩm');
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<ProductSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            // this.listProduct = data.items;
            this.rendResult(data.items);
        });

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.categoryId = params.categoryId ? parseInt(params.categoryId) : '';
            this.isManagementByLot = params.isManagementByLot !== null && params.isManagementByLot !== ''
            && params.isManagementByLot !== undefined ? Boolean(params.isManagementByLot) : null;
            this.isActive = params.isActive !== null && params.isActive !== '' && params.isActive !== undefined
                ? Boolean(params.isActive) : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.getCategoryTrees();
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.productId);
        });
    }

    searchKeyUp(keyword) {
        this.keyword = keyword;
        this.search(1);
    }

    selectCategory(value: TreeData) {
        if (value) {
            this.categorySelectText = value.text;
            this.categoryId = value.id;
        } else {
            this.categoryId = null;
            this.categorySelectText = '';
        }

        this.search(1);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.productService.search(this.keyword, this.categoryId, this.isManagementByLot, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<ProductSearchViewModel>) => {
                this.totalRows = data.totalRows;
                // this.listProduct = data.items;
                this.rendResult(data.items);
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

    selectIsManagementByLot(value) {
        if (value) {
            this.isManagementByLot = value.id;
        } else {
            this.isManagementByLot = null;
        }

        this.search(1);
    }

    onPageClick(page: number) {
        this.currentPage = page;
        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.categoryId = null;
        this.isManagementByLot = null;
        this.isActive = null;
        this.categorySelectText = null;
        this.nHDropdownTreeComponent.selectDefaultNode();
        this.search(1);
    }

    edit(product: ProductResultViewModel) {
        this.router.navigate([`/products/edit/${product.id}`]);
    }

    delete(id: string) {
        this.productService.delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
                // _.remove(this.listProduct, (item: ProductResultViewModel) => {
                //     return item.id === id;
                // });
            });
    }

    updateStatus(item: ProductResultViewModel) {
        this.productService.updateStatus(item.id, !item.isActive).subscribe((result: ActionResultViewModel) => {
            item.isActive = !item.isActive;
        });
    }

    updateManagementByLot(product: ProductResultViewModel) {
        this.productService.updateManagementByLot(product.id, !product.isManagementByLot).subscribe(() => {
            product.isManagementByLot = !product.isManagementByLot;
        });
    }

    updateIsHot(product: ProductResultViewModel) {
        this.productService.updateIsHot(product.id, !product.isHot).subscribe(() => {
            product.isHot = !product.isHot;
        });
    }

    updateIsHomePage(product: ProductResultViewModel) {
        this.productService.updateIsHomePage(product.id, !product.isHomePage).subscribe(() => {
            product.isHomePage = !product.isHomePage;
        });
    }

    detail(product: ProductResultViewModel) {
        this.router.navigate([`/products/detail/${product.id}`]);
    }

    confirm(value: ProductResultViewModel) {
        this.productId = value.id;
        this.swalConfirmDelete.show();
    }

    private rendResult(list: ProductSearchViewModel[]) {
        this.listProduct = [];
        if (list && list.length > 0) {
            _.each(list, (item: ProductSearchViewModel) => {
                const productCategoryName = _.join(item.categoryNames, ', ');

                console.log(item);
                this.listProduct.push(new ProductResultViewModel(item.id, item.thumbnail, productCategoryName,
                    item.name, item.defaultUnit, item.isManagementByLot, item.isActive, item.isHot, item.isHomePage));
            });
        }
    }

    private getCategoryTrees() {
        this.subscribers.getTree = this.productCategoryService
            .getTree()
            .subscribe((result: TreeData[]) => {
                this.categoryTree = result;
            });
    }

    private renderFilterLink() {
        const path = 'products';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('categoryId', this.categoryId),
            new FilterLink('isManagementByLot', this.isManagementByLot),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
