import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {TreeData} from '../../../../view-model/tree-data';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {NewSearchForSelectViewModel} from '../../../news/new/viewmodel/new-search-for-select.viewmodel';
import {BaseListComponent} from '../../../../base-list.component';
import {Products} from '../../model/products.model';
import * as _ from 'lodash';
import {ProductService} from '../../services/product.service';
import {ProductSearchForSelectViewModel} from '../../model/product-search-for-select.viewmodel';
import {CategoryProductService} from '../../services/category-product.service';
@Component({
  selector: 'app-product-select',
  templateUrl: './product-select.component.html',
  styleUrls: ['./product-select.component.scss'],
  providers: [ProductService, CategoryProductService]
})
export class ProductSelectComponent extends BaseListComponent<Products> implements OnInit, AfterViewInit {

  @Output() onCancel = new EventEmitter();
  @Output() onAccept = new EventEmitter();
  listSelectedNews = [];
  categoryId;
  keyword = '';
  listNews = [];
  categoryTree = [];

  constructor(private toastr: ToastrService,
              private productService: ProductService,
              private categoryProductService: CategoryProductService) {
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

  onSelectItem(item: NewSearchForSelectViewModel) {
    item.selected = !item.selected;

    if (item.selected) {
      const existsItem = _.find(this.listSelectedNews, (news) => {
        return item.id === news.id;
      });

      if (existsItem) {
        return;
      } else {
        this.listSelectedNews.push({
          id: item.id,
          name: item.title,
          image: item.featureImage,
        });
      }
    } else {
      _.remove(this.listSelectedNews, (news) => {
        return item.id === news.id;
      });
    }
  }

  accept() {
    if (this.listSelectedNews.length === 0) {
      this.toastr.warning('Vui lòng chọn ít nhất 1 nhóm.');
      return;
    }
    this.onAccept.emit(_.map(this.listSelectedNews, (news) => {
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
      item.selected = _.map(this.listSelectedNews, news => {
        return news.id;
      }).indexOf(item.id) > -1;

      newsItems.push(item);
    });

    this.listNews = newsItems;
  }

  // private reRenderSelectedNews() {
  //     _.each(this.listNews, (news) => {
  //         news.selected = _.map(this.listSelectedNews, (item) => {
  //             return item.id;
  //         }).indexOf(news.id) > -1;
  //     });
  // }
}
