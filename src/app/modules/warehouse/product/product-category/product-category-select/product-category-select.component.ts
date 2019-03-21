import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {CategoryService} from '../../../../news/category/category.service';
import {BaseListComponent} from '../../../../../base-list.component';
import {ProductCategory} from '../model/product-category.model';
import * as _ from 'lodash';
import {ProductCategoryService} from '../service/product-category-service';

@Component({
  selector: 'app-product-category-select',
  templateUrl: './product-category-select.component.html',
  styleUrls: ['./product-category-select.component.scss']
})
export class ProductCategorySelectComponent extends BaseListComponent<ProductCategory> implements OnInit, AfterViewInit {

  @Output() onCancel = new EventEmitter();
  @Output() onAccept = new EventEmitter();
  type = 0;
  keyword = '';
  listGroup = [];

  constructor(private toastr: ToastrService,
              private productCategoryService: ProductCategoryService) {
    super();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.search(1);
  }

  search(currentPage) {
    this.currentPage = currentPage;
    this.isSearching = true;
    this.productCategoryService.search(this.keyword, true , this.currentPage, this.pageSize)
        .subscribe((result: any) => {
          this.isSearching = true;
          this.listGroup = _.map(result.items, (item: any) => {
            item.selected = false;
            return item;
          });
          this.totalRows = result.totalRows;
        });
  }

  onTabSelect(index) {
    this.type = index;
    this.search(1);
  }

  onSelectItem(groupItem) {
    groupItem.selected = !groupItem.selected;
  }

  accept() {
    const listSelectedItem = _.filter(this.listGroup, (item) => {
      return item.selected;
    });

    if (listSelectedItem.length === 0) {
      this.toastr.warning('Vui lòng chọn ít nhất 1 nhóm.');
      return;
    }
    this.onAccept.emit(_.map(listSelectedItem, (item, index) => {
      return {
        id: item.id,
        name: item.name,
        order: index
      };
    }));
  }

  cancel() {
    this.onCancel.emit();
  }

}
