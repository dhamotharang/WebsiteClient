import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../base-list.component';
import { GhmMultiSelect } from './ghm-multi-select.model';
import { NhModalComponent } from '../nh-modal/nh-modal.component';
import { INewsPickerViewModel } from '../../../modules/website/news/inews-picker.viewmodel';
import * as _ from 'lodash';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { GhmMultiSelectService } from './ghm-multi-select.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, map } from 'rxjs/operators';

@Component({
    selector: 'ghm-multi-select',
    templateUrl: './ghm-multi-select.component.html'
})

export class GhmMultiSelectComponent extends BaseListComponent<GhmMultiSelect> implements OnInit {
    @ViewChild('pickerModal') pickerModal: NhModalComponent;
    @Input() data: GhmMultiSelect[] = [];
    @Input() listSelected: GhmMultiSelect[] = [];
    @Input() title: string;
    @Input() url: string;
    @Input() titleIcon: string;

    @Output() onSearchSubmit = new EventEmitter();
    @Output() onAccept = new EventEmitter();
    @Output() onRemoveItem = new EventEmitter();
    @Output() onAddItem = new EventEmitter();

    constructor(private toastr: ToastrService,
                private ghmMultiSelectService: GhmMultiSelectService) {
        super();
    }

    ngOnInit() {
    }

    show() {
        this.search(1);
        this.pickerModal.open();
    }

    search(currentPage: number) {
        console.log(this.url);
        if (this.url) {
            this.currentPage = currentPage;
            this.isSearching = true;
            this.listItems$ = this.ghmMultiSelectService.search(this.url, this.keyword, this.currentPage)
                .pipe(finalize(() => this.isSearching = false),
                    map((result: ISearchResult<INewsPickerViewModel>) => {
                        this.totalRows = result.totalRows;
                        return result.items;
                    }));
        } else {
            this.onSearchSubmit.emit(this.keyword);
        }
    }

    selectItem(item: GhmMultiSelect) {
        this.onAddItem.emit(item);
        const info = _.find(this.listSelected, (selected: GhmMultiSelect) => {
            return selected.id === item.id;
        });
        if (info) {
            this.toastr.warning(`Danh mục ${info.name} đã được chọn. Vui lòng kiểm tra lại.`);
            return;
        }
        this.listSelected.push(item);
    }

    removeItem(item: GhmMultiSelect) {
        this.onRemoveItem.emit(item);
        _.remove(this.listSelected, item);
    }

    accept() {
        this.onAccept.emit(this.listSelected);
        this.pickerModal.dismiss();
    }
}
