import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { CategoryService } from '../category.service';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { ICategoryPickerViewmodel } from '../icategory-picker.viewmodel';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { finalize, map } from 'rxjs/operators';

@Component({
    selector: 'app-category-picker',
    templateUrl: './category-picker.component.html'
})

export class CategoryPickerComponent extends BaseListComponent<ICategoryPickerViewmodel> implements OnInit {
    @ViewChild('pickerModal') pickerModal: NhModalComponent;
    @Output() onAccept = new EventEmitter();
    listSelected: ICategoryPickerViewmodel[] = [];

    constructor(private toastr: ToastrService,
                private categoryService: CategoryService) {
        super();
    }

    ngOnInit() {
    }

    show() {
        this.search(1);
        this.pickerModal.open();
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.categoryService.searchPicker(this.keyword, this.currentPage)
            .pipe(finalize(() => this.isSearching = false),
                map((result: ISearchResult<ICategoryPickerViewmodel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    selectItem(category: ICategoryPickerViewmodel) {
        const categoryInfo = _.find(this.listSelected, (item: ICategoryPickerViewmodel) => {
            return item.id === category.id;
        });

        if (categoryInfo) {
            this.toastr.warning(`Chuyên mục ${categoryInfo.name} đã được chọn. Vui lòng kiểm tra lại.`);
            return;
        }

        this.listSelected.push(category);
    }

    removeItem(category: ICategoryPickerViewmodel) {
        _.remove(this.listSelected, category);
    }

    accept() {
        this.onAccept.emit(this.listSelected);
        this.pickerModal.dismiss();
    }
}
