import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TreeData} from '../../../../../view-model/tree-data';
import {SearchResultViewModel} from '../../../../../shareds/view-models/search-result.viewmodel';
import {BaseListComponent} from '../../../../../base-list.component';
import {Products} from '../../../../product/model/products.model';
import * as _ from 'lodash';
import {ProductSearchForSelectViewModel} from '../../../../product/model/product-search-for-select.viewmodel';
import {ProductService} from '../../../../product/product/service/product.service';
import {ProductCategoryService} from '../../../../product/product-category/service/product-category-service';

@Component({
    selector: 'app-product-select',
    templateUrl: './product-select.component.html',
    styleUrls: ['./product-select.component.scss'],
    providers: [ProductService, ProductCategoryService]
})

export class ProductSelectComponent extends BaseListComponent<Products> implements OnInit, AfterViewInit {
    @Output() onCancel = new EventEmitter();
    @Output() onAccept = new EventEmitter();
    listSelectedProducts = [];
    categoryId;
    keyword = '';
    listNews = [];
    categoryTree = [];

    constructor(private toastr: ToastrService,
                private productService: ProductService,
                private categoryProductService: ProductCategoryService) {
        super();
    }

    ngOnInit() {
        this.categoryProductService.getTree().subscribe((result: TreeData[]) => this.categoryTree = result);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.search(1);
        }, 200);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.productService.searchForSelect(this.keyword, this.categoryId, this.currentPage, this.pageSize)
            .subscribe((result: SearchResultViewModel<ProductSearchForSelectViewModel>) => {
                this.isSearching = false;
                this.renderListNews(result.items);
                this.totalRows = result.totalRows;
            });
    }

    selectCategory(value: TreeData) {
        if (value) {
            this.categoryId = value.id;
        } else {
            this.categoryId = '';
        }
        this.search(1);
    }

    onSelectItem(item: ProductSearchForSelectViewModel) {
        item.selected = !item.selected;

        if (item.selected) {
            const existsItem = _.find(this.listSelectedProducts, (news) => {
                return item.id === news.id;
            });

            if (existsItem) {
                return;
            } else {
                this.listSelectedProducts.push({
                    id: item.id,
                    name: item.name,
                    image: item.image,
                });
            }
        } else {
            _.remove(this.listSelectedProducts, (news) => {
                return item.id === news.id;
            });
        }
    }

    accept() {
        if (this.listSelectedProducts.length === 0) {
            this.toastr.warning('Vui lòng chọn ít nhất 1 nhóm.');
            return;
        }
        this.onAccept.emit(_.map(this.listSelectedProducts, (news) => {
            return news;
        }));
        _.each(this.listNews, (item) => {
            item.selected = false;
        });
    }

    cancel() {
        this.onCancel.emit();
    }

    private renderListNews(listNews) {
        const newsItems = [];
        _.each(listNews, (item: any) => {
            item.selected = _.map(this.listSelectedProducts, news => {
                return news.id;
            }).indexOf(item.id) > -1;

            newsItems.push(item);
        });

        this.listNews = newsItems;
    }
}
