import {Component, Inject, OnInit} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {BaseListComponent} from '../../../base-list.component';
import {Product} from '../model/product.model';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {ProductService} from '../services/product.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {AuthWebsiteService} from '../../../shareds/services/auth-website.service';
import * as _ from 'lodash';
import {MatDialog} from '@angular/material';
import {ProductFormComponent} from './product-form/product-form.component';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseListComponent<Product> implements OnInit {
    categoryId: number;
    isActive: boolean;
    isHot: boolean;
    isHomePage: boolean;
    websiteId: string;
    productName: string;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private spinnerService: SpinnerService,
                private route: ActivatedRoute,
                private dialog: MatDialog,
                private toastr: ToastrService,
                private productService: ProductService, private authWebsiteService: AuthWebsiteService) {
        super();
        this.websiteId = this.appService.currentUser.tenantId;
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.PRODUCT_MANAGER, this.pageId.PRODUCT, 'Quản lý sản phẩm', 'Danh sách sản phẩm');
        this.route.data.subscribe((result: { data: SearchResultViewModel<Product> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            this.listItems = data.items;
            this.rendResult();
        });
    }


    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.productService.search(this.appService.currentUser.tenantId, this.productName, this.categoryId,
            this.isActive, this.isHot, this.isHomePage,
            this.currentPage, this.pageSize)
            .subscribe((result: SearchResultViewModel<Product>) => {
                this.totalRows = result.totalRows;
                this.listItems = result.items;
                this.rendResult();
                this.isSearching = false;
            });

    }

    delete(product: Product) {
        this.spinnerService.show('Đang xóa tin tức. Vui lòng đợi...');
        this.productService.delete(product)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
            });
    }

    detail(id: string) {
    }

    edit(id: string) {
        const productDiaLog = this.dialog.open(ProductFormComponent, {
            id: `productEditDiaLog-${id}`,
            data: {id: id}
        });

        productDiaLog.afterClosed().subscribe((data) => {
            if (data) {
                if (data.isModified) {
                    this.search(1);
                }
            }
        });
    }

    private rendResult() {
        _.each(this.listItems, (item: Product) => {
            item.categoryViewModel = _.join(item.categoriesName, ', ');
        });
    }

    updateHot(id: string, isHot: boolean) {
        this.productService.updateHot(id, isHot).subscribe(() => {
           const product = _.find(this.listItems, (item: Product) => {
               return item.productId === id;
           });
            product.isHot = isHot;
        });
    }


    updateHomePage(id: string, isHomePage: boolean) {
        this.productService.updateHomePage(id, isHomePage).subscribe(() => {
            const product = _.find(this.listItems, (item: Product) => {
                return item.productId === id;
            });
            product.isHomePage = isHomePage;
        });
    }
}
