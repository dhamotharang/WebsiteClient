import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {ActivatedRoute} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {finalize, map} from 'rxjs/operators';
import {News} from '../../website/news/news.model';
import {BaseListComponent} from '../../../base-list.component';
import {Product} from '../model/product.model';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {ProductService} from '../services/product.service';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {AuthWebsiteService} from '../../../shareds/services/auth-website.service';

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

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private spinnerService: SpinnerService,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private productService: ProductService, private authWebsiteService: AuthWebsiteService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.NEWS, 'Quản lý tin tức', 'Danh sách tin tức');
        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<Product> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.productService.search(this.keyword, this.categoryId, this.isActive, this.isHot, this.isHomePage,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<News>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    delete(product: Product) {
        this.spinnerService.show('Đang xóa tin tức. Vui lòng đợi...');
        this.productService.delete(product)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
            });
    }

    edit(product: Product) {

    }

}
