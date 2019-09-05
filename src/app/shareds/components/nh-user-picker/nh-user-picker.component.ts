import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { NhUserPicker } from './nh-user-picker.model';
import { NhUserPickerService } from './nh-user-picker.service';
import { SearchResultViewModel } from '../../view-models/search-result.viewmodel';
import { SuggestionViewModel } from '../../view-models/SuggestionViewModel';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'nh-user-picker',
    templateUrl: './nh-user-picker.component.html',
    styleUrls: ['./nh-user-picker.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NhUserPickerComponent implements OnInit, OnChanges {
    @Input() isShow = false;
    @Input() allTitle = '';
    @Input() selectedTitle = '';
    @Input() source: NhUserPicker[] = [];
    @Input() totalRows = 0;
    @Input() pageSize = 0;
    @Input() title = '';

    @Output() selectedItem = new EventEmitter();
    @Output() selectedPage = new EventEmitter();
    @Output() removedItem = new EventEmitter();
    @Output() accepted = new EventEmitter();

    errorMessage = '';
    currentPage = 1;
    keyword: string;
    isSearching = false;
    // officeId: number;
    // officeTree: TreeData[] = [];

    private _selectedItems = [];

    @Input()
    set selectedItems(value: NhUserPicker[]) {
        this._selectedItems = _.cloneDeep(value);
    }

    get selectedItems(): NhUserPicker[] {
        return this._selectedItems;
    }

    constructor(private userPickerService: NhUserPickerService) {
    }

    ngOnInit() {
        this.search(1);
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    // onSelectOffice(officeTree: TreeData) {
    //     this.officeId = officeTree ? officeTree.id : null;
    //     this.search(1);
    // }

    show() {
        // this.officeId = null;
        this.isShow = true;
        _.each(this.source, (item: SuggestionViewModel<string>) => {
            const selectedItemInfo = _.find(this.selectedItems, (selectedItem: NhUserPicker) => {
                return selectedItem.id === item.id;
            });
            item.isSelected = selectedItemInfo != null && selectedItemInfo !== undefined;
        });
    }

    deleteAllSelected() {
        this.selectedItems = [];
        _.each(this.source, (item: NhUserPicker) => {
            item.isSelected = false;
        });
    }

    removeSelectedUser(user: NhUserPicker) {
        _.remove(this.selectedItems, (item: any) => {
            return item.id === user.id;
        });

        const userInfo = _.find(this.source, (item: any) => {
            return item.id === user.id;
        });

        if (userInfo) {
            userInfo.isSelected = false;
        }
    }

    dismiss() {
        this.isShow = false;
    }

    selectItem(item: NhUserPicker) {
        this.errorMessage = '';
        this.selectedItem.emit(item);
        const existingItem = _.find(this.selectedItems, (selectedItem: NhUserPicker) => {
            return selectedItem.id === item.id;
        });
        if (existingItem) {
            return;
        }

        item.isSelected = true;
        this.selectedItems.push(item);
    }

    removeItem(id: any) {
        _.remove(this.selectedItems, (selectedItem: NhUserPicker) => {
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

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.userPickerService.search(this.keyword, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<NhUserPicker>) => {
                this.totalRows = result.totalRows;
                _.each(result.items, (item: SuggestionViewModel<string>) => {
                    const selectedItemInfo = _.find(this.selectedItems, (selectedItem: NhUserPicker) => {
                        return selectedItem.id === item.id;
                    });
                    item.isSelected = selectedItemInfo != null && selectedItemInfo !== undefined;
                });
                this.source = result.items;
            });
    }
}
