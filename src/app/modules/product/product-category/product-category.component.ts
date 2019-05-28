import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {BaseFormComponent} from '../../../base-form.component';
import {Category} from '../../website/category/category.model';
import {IResponseResult} from '../../../interfaces/iresponse-result';
import {ToastrService} from 'ngx-toastr';
import {finalize, map} from 'rxjs/operators';
import {ProductCategory} from '../model/product-category.model';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {ActivatedRoute} from '@angular/router';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {CategoryService} from '../../website/category/category.service';
import {BaseListComponent} from '../../../base-list.component';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {ProductCategoryFormComponent} from './product-category-form/product-category-form.component';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent extends BaseListComponent<ProductCategory> implements OnInit {
  @ViewChild(ProductCategoryFormComponent) categoryFormComponent: ProductCategoryFormComponent;
  isActive: boolean;

  constructor(@Inject(PAGE_ID) public pageId: IPageId,
              private route: ActivatedRoute,
              private toastr: ToastrService,
              private spinnerService: SpinnerService,
              private categoryService: CategoryService) {
    super();
  }

  ngOnInit() {
    this.listItems$ = this.route.data
        .pipe(map((result: { data: SearchResultViewModel<Category> }) => {
          const data = result.data;
          this.totalRows = data.totalRows;
          return data.items;
        }));
    this.appService.setupPage(this.pageId.WEBSITE, this.pageId.NEWS_CATEGORY, 'Quản lý tin tức', 'Danh sách chuyên mục');
  }

  search(currentPage: number) {
    this.currentPage = currentPage;
    this.isSearching = true;
    this.listItems$ = this.categoryService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
        .pipe(finalize(() => this.isSearching = false),
            map((result: SearchResultViewModel<Category>) => {
              this.totalRows = result.totalRows;
              return result.items;
            }));
  }

  add() {
    this.categoryFormComponent.add();
  }

  edit(category: Category) {
    this.categoryFormComponent.edit(category);
  }

  delete(id: number) {
    this.spinnerService.show('Đang xóa chuyên mục. Vui lòng đợi...');
    this.categoryService.delete(id)
        .subscribe((result: IResponseResult) => {
          this.toastr.success(result.message);
          this.search(1);
        });

  }
}
