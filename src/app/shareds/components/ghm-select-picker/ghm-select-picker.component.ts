import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { GhmSelectPickerModel } from './ghm-select-picker.model';
import * as _ from 'lodash';

@Component({
    selector: 'ghm-select-picker',
    templateUrl: 'ghm-select-picker.component.html',
    styleUrls: ['./ghm-select-picker.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class GhmSelectPickerComponent implements OnInit, OnChanges {
    @Input() isShow = false;
    @Input() allTitle = '';
    @Input() selectedTitle = '';
    @Input() source: GhmSelectPickerModel[] = [];
    @Input() selectedItems: GhmSelectPickerModel[] = [];
    @Input() paging = false;
    @Input() totalRows = 0;
    @Input() pageSize = 0;
    @Input() title = '';

    @Output() selectedItem = new EventEmitter();
    @Output() selectedPage = new EventEmitter();
    @Output() removedItem = new EventEmitter();
    @Output() accepted = new EventEmitter();

    errorMessage = '';
    listPages = [];
    currentPage = 1;

    constructor() {
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.hasOwnProperty('totalRows') && changes['totalRows'].currentValue !== 0) {
            this.renderPaging();
        }
    }

    show() {
        this.isShow = true;
    }

    dismiss() {
        this.isShow = false;
    }

    pageClick(pageNumber: number) {
        if (this.paging) {
            this.currentPage = pageNumber;
            this.selectedPage.emit();
        }
    }

    selectItem(item: GhmSelectPickerModel) {
        this.errorMessage = '';
        this.selectedItem.emit(item);
        const existingItem = _.find(this.selectedItems, (selectedItem: GhmSelectPickerModel) => {
            return selectedItem.id === item.id;
        });
        if (existingItem) {
            return;
        }
        this.selectedItems.push(item);
    }

    removeItem(id: any) {
        _.remove(this.selectedItems, (selectedItem: GhmSelectPickerModel) => {
            return selectedItem.id === id;
        });
        this.removedItem.emit(id);
    }

    accept() {
        if (!this.selectedItems || this.selectedItems.length === 0) {
            this.errorMessage = 'required';
            return;
        }
        this.accepted.emit(this.selectedItems);
        this.isShow = false;
        this.selectedItems = [];
    }

    private renderPaging() {
        if (this.paging) {
            const totalPage = Math.ceil(this.totalRows / this.pageSize);
            for (let i = 1; i <= totalPage; i++) {
                this.listPages.push(i);
            }
        }
    }
}
