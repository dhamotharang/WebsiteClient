import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {BaseListComponent} from '../../../../base-list.component';
import {Category} from '../models/category.model';
import {CategoryService} from '../category.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-category-select',
    templateUrl: './select-category.component.html',
    styleUrls: ['../category.scss']
    // providers: [CategoryService]
})

export class SelectCategoryComponent extends BaseListComponent<Category> implements OnInit, AfterViewInit {
    @Output() onCancel = new EventEmitter();
    @Output() onAccept = new EventEmitter();
    type = 0;
    keyword = '';
    listGroup = [];

    constructor(private toastr: ToastrService,
                private categoryService: CategoryService) {
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
        this.categoryService.searchForSelect(this.keyword, this.currentPage, this.pageSize)
            .subscribe((result: any) => {
                this.isSearching = false;
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
