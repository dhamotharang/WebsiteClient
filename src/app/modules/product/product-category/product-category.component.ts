import {ProductCategorySearchViewModel} from './viewmodel/product-category-search.viewmodel';
import {AfterViewInit, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {finalize} from 'rxjs/operators';
import {ProductCategoryFormComponent} from './product-category-form/product-category-form.component';
import {ProductCategoryService} from './service/product-category-service';
import * as _ from 'lodash';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {HelperService} from '../../../shareds/services/helper.service';
import {BaseListComponent} from '../../../base-list.component';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {UtilService} from '../../../shareds/services/util.service';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {QuestionGroupSearchViewModel} from '../../surveys/question-group/viewmodels/question-group-search-viewmodel';
import {FilterLink} from '../../../shareds/models/filter-link.model';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';

@Component({
    selector: 'app-product-category',
    templateUrl: './product-category.component.html',
    providers: [HelperService, Location]
})

export class ProductCategoryComponent extends BaseListComponent<ProductCategorySearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(ProductCategoryFormComponent) productCategoryFormComponent: ProductCategoryFormComponent;
    @ViewChild('confirmDeleteProductCategory') swalConfirmDelete: SwalComponent;
    isActive;
    listProductCategory: ProductCategorySearchViewModel[];
    productCategoryId;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private productCategoryService: ProductCategoryService,
                private helperService: HelperService,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.PRODUCT, this.pageId.PRODUCT_CATEGORY, 'Quản lý loại sản phẩm', 'Quản lý phân loại sản phẩm');
        this.subscribers.data = this.route.data.subscribe((result: { data: SearchResultViewModel<ProductCategorySearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listProductCategory = data.items;
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
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.productCategoryId);
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
        this.productCategoryService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((data: SearchResultViewModel<ProductCategorySearchViewModel>) => {
                this.totalRows = data.totalRows;
                this.listProductCategory = data.items;
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

    add() {
        this.productCategoryFormComponent.add();
    }

    edit(questionGroup: QuestionGroupSearchViewModel) {
        this.productCategoryFormComponent.edit(questionGroup.id);
    }

    delete(id: number) {
        this.productCategoryService.delete(id)
            .subscribe(() => {
                this.search(1);
                // _.remove(this.listProductCategory, (item: ProductCategorySearchViewModel) => {
                //     return item.id === id;
                // });
            });
    }

    updateStatus(item: ProductCategorySearchViewModel) {
        this.productCategoryService.updateStatus(item.id, !item.isActive).subscribe((result: ActionResultViewModel) => {
            item.isActive = !item.isActive;


            if (!item.isActive) {
                const listChildren = _.filter(this.listProductCategory, (child: ProductCategorySearchViewModel) => {
                    return child.idPath.indexOf(item.idPath + '.') > -1;
                });
                if (listChildren && listChildren.length > 0) {
                    _.each(listChildren, (childItem: ProductCategorySearchViewModel) => {
                        childItem.isActive = item.isActive;
                    });
                }
            } else {
                const listParent = _.filter(this.listProductCategory, (parent: ProductCategorySearchViewModel) => {
                    return item.idPath.indexOf(parent.idPath + '.') > -1;
                });
                if (listParent && listParent.length > 0) {
                    _.each(listParent, (parentItem: ProductCategorySearchViewModel) => {
                        parentItem.isActive = item.isActive;
                    });
                }
            }
        });
    }

    confirm(value: ProductCategorySearchViewModel) {
        this.swalConfirmDelete.show();
        this.productCategoryId = value.id;
    }

    private renderFilterLink() {
        const path = 'products/categories';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
