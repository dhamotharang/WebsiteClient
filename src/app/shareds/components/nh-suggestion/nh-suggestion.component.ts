import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output, ViewChild,
    ViewEncapsulation
} from '@angular/core';
import * as _ from 'lodash';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { NhSuggestionService } from './nh-suggestion.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class NhSuggestion<T = any> {
    id: string | number;
    icon: string;
    name: string;
    isSelected: boolean;
    isActive: boolean;
    data: T;
    description: string;
    image: string;

    constructor(id?: string | number, name?: string, icon?: string, isSelected?: boolean, isActive?: boolean, data?: any) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.isSelected = isSelected !== undefined && isSelected != null ? isSelected : false;
        this.isActive = isActive !== undefined && isActive != null ? isActive : false;
        this.data = data;
        this.description = '';
        this.image = null;
    }
}

@Component({
    selector: 'nh-suggestion',
    templateUrl: './nh-suggestion.component.html',
    styleUrls: ['./nh-suggestion.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NhSuggestionComponent),
            multi: true
        }
    ]
})

export class NhSuggestionComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @ViewChild('searchResultContainer') private searchResultContainer: ElementRef;
    @Input() multiple = false;
    @Input() isShowSelected = true;
    @Input() placeholder = '';
    @Input() loading = false;
    @Input() pageSize: number;
    @Input() allowAdd = false;
    @Input() readonly = false;
    @Input() isShowImage = false;

    @Input()
    set totalRows(value: number) {
        this._totalRows = value;
        this.renderPaging();
    }

    @Input()
    set sources(values: NhSuggestion[]) {
        this._sources = values;
        this.updateSelectedStatus();
    }

    @Input()
    set value(value: string | number) {
        this.value = value;
    }

    @Input()
    set selectedItems(values: NhSuggestion[]) {
        this._selectedItems = values ? values : [];
        this.updateSelectedStatus();
    }

    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();
    @Output() keyUpPressed = new EventEmitter();
    @Output() searched = new EventEmitter();
    @Output() nextPage = new EventEmitter();

    private _sources: NhSuggestion[];
    private _value: string | number;
    private _isShowSuggestionList: boolean;
    private _subscribers: any = {};
    private _selectedItems: NhSuggestion[] = [];
    private _isShowSearchBox = true;
    private _selectedItem: any = null;
    private _totalRows: number;

    id: string;
    isLoading = false;
    isActive = false;
    keyword: string;
    showLoadMore = false;
    currentPage = 1;
    totalPages = 0;
    searchTerm$ = new Subject<string>();
    lastScrollHeight;

    constructor(private el: ElementRef,
                private ref: ChangeDetectorRef,
                private nhSuggestionService: NhSuggestionService) {
        this.id = Math.floor(Math.random() * 1000).toString();
        this.searchTerm$.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe((term: string) => {
            this.searched.emit(term);
        });
    }

    @Input()
    set selectedItem(value: NhSuggestion | NhSuggestion[]) {
        if (value instanceof Array) {
            this._selectedItems = value;
            this.isShowSearchBox = !value || value.length === 0;
        } else {
            this._selectedItem = value;
            this.isShowSearchBox = value ? false : true;
        }
    }

    get selectedItem() {
        return this._selectedItem;
    }

    get selectedItems() {
        return this._selectedItems;
    }

    propagateChange: any = () => {
    }

    get isShowSearchBox() {
        return this._isShowSearchBox;
    }

    set isShowSearchBox(value: boolean) {
        this._isShowSearchBox = value;
        if (value) {
            this.focusSearchInputElement();
        }
    }

    get value() {
        return this._value;
    }

    get isShowListSuggestion() {
        return this._isShowSuggestionList;
    }

    get sources() {
        return this._sources ? this._sources : [];
    }

    get totalRows() {
        return this._totalRows;
    }

    ngOnInit() {
        this.nhSuggestionService.add(this);
    }

    ngOnDestroy() {
        // this._subscribers.searchTermChange.unsubscribe();
        this.selectedItems = [];
        this.sources = [];
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent) {
        if (event.code === 'Tab' || event.code === 'tab') {
            this.isActive = false;
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(targetElement) {
        if (this.el.nativeElement && !this.el.nativeElement.contains(targetElement.target)) {
            // this.nhSuggestionService.setActive(this, false);
            this.isActive = false;
            if (this.selectedItem || (this.selectedItems && this.selectedItems.length > 0)) {
                this.isShowSearchBox = false;
            }
        }
    }

    @HostListener('document:contextmenu', ['$event'])
    documentRightClick(event) {
        this.isActive = false;
    }

    showSearchBox(e) {
        e.preventDefault();
        e.stopPropagation();
        this.isShowSearchBox = true;
        this.nhSuggestionService.setActive(this, true);
    }

    activeSuggestion(e) {
        e.stopPropagation();
        e.preventDefault();
        this.nhSuggestionService.setActive(this, true);
        this.isActive = true;
        this.searched.emit(this.keyword);
        this.isShowSearchBox = true;
    }

    inputKeyUp(event) {
        const isNavigation = this.navigate(event);
        if (!isNavigation) {
            // this.searchTerms$.next(this.keyword);
            this.searchTerm$.next(this.keyword);
            this.keyUpPressed.emit({
                keyword: this.keyword,
                events: event
            });
        }
    }

    add() {
        this.selectedItem = new NhSuggestion(null, _.cloneDeep(this.keyword));
        this.itemSelected.emit(this.selectedItem);
        this.isActive = false;
        this.isShowSearchBox = false;
    }

    selectItem(item: NhSuggestion) {
        if (!this.multiple) {
            this.isShowSearchBox = false;
            this.isActive = false;
            this.keyword = '';
            this.selectedItem = item;
            this.propagateChange(item.id);
            this.itemSelected.emit(item);
        } else {
            item.isSelected = !item.isSelected;
            // const listSelectedItems = _.filter(this.sources, (sourceItem: NhSuggestion) => sourceItem.isSelected);
            // this.selectedItems = listSelectedItems;

            if (item.isSelected) {
                const existingItem = _.find(this.selectedItems, (selectedItem: NhSuggestion) => {
                    return selectedItem.id === item.id;
                });

                if (!existingItem) {
                    this.selectedItems.push(item);
                    this.itemSelected.emit(this.selectedItems);
                    this.keyword = '';
                    // this.itemSelected.emit(this.selectedItems);
                } else if (existingItem && !item.isSelected) {
                    this.removeSelectedItem(item);
                    this.itemSelected.emit(this.selectedItems);
                    // this.removeSelectedItem(item);
                }
            } else {
                this.removeSelectedItem(item);
            }
        }
    }

    removeSelectedItem(item?: NhSuggestion) {
        this.isShowSearchBox = true;
        if (item) {
            if (this.multiple && this.selectedItems instanceof Array) {
                _.remove(this.selectedItems, (selectedItem: NhSuggestion) => selectedItem.id === item.id);
            } else {
                this.selectedItems = null;
                this.selectedItem = null;
            }
            this.resetActiveStatus();
            this.itemRemoved.emit(item);
        } else {
            this.selectedItem = new NhSuggestion();
            this.propagateChange(null);
            this.itemSelected.emit(null);
        }
    }

    writeValue(value) {
        this.value = value;
    }

    clear() {
        this.keyword = '';
        this.selectedItem = null;
        this.selectedItems = [];
    }

    loadMore(event) {
        event.preventDefault();
        event.stopPropagation();
        if (this.searchResultContainer) {
            this.lastScrollHeight = this.searchResultContainer.nativeElement.scrollTop;
        }
        this.currentPage += 1;
        this.nextPage.emit({
            keyword: this.keyword,
            page: this.currentPage,
            pageSize: this.pageSize
        });
    }

    updateScrollPosition() {
        if (this.searchResultContainer) {
            setTimeout(() => {
                this.searchResultContainer.nativeElement.scrollTop = this.lastScrollHeight;
            });
        }
    }

    private navigate(key) {
        const keyCode = key.keyCode;
        // Escape
        if (keyCode === 27) {
            this.isActive = false;
            return true;
        }

        if (keyCode === 27 || keyCode === 17 || key.ctrlKey) {
            return true;
        }

        // 37: Left arrow
        // 38: Up arrow
        // 39: Right arrow
        // 40: Down arrow
        // 13: Enter
        if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40 || keyCode === 13) {
            switch (keyCode) {
                case 37:
                case 38:
                    this.back();
                    break;
                case 39:
                case 40:
                    this.next();
                    break;
                case 13:
                    const selectedItems = this.sources.find((item: NhSuggestion) => {
                        return item.isActive;
                    });
                    this.selectItem(selectedItems);
                    break;
            }
            key.preventDefault();
            return true;
        }

        return false;
    }

    private next() {
        let index = this.getActiveItemIndex();
        if (index === -1) {
            const firstItem = this.sources[0];
            if (firstItem) {
                firstItem.isActive = true;
            }
        } else {
            index = index < this.sources.length - 1 ? index + 1 : 0;
            this.setItemActiveStatus(index);
        }
    }

    private back() {
        let index = this.getActiveItemIndex();
        if (index === -1) {
            const lastItem = this.sources[this.sources.length - 1];
            if (lastItem) {
                lastItem.isActive = true;
            }
        } else {
            index = index > 0 ? index - 1 : this.sources.length - 1;
            this.setItemActiveStatus(index);
        }
    }

    private resetActiveStatus() {
        this.sources.forEach((item: NhSuggestion) => item.isActive = false);
    }

    private getActiveItemIndex() {
        return _.findIndex(this.sources, (item: NhSuggestion) => {
            return item.isActive;
        });
    }

    private setItemActiveStatus(index: number) {
        this.sources.forEach((item: NhSuggestion) => item.isActive = false);
        const sourceItem = this.sources[index];
        if (sourceItem) {
            sourceItem.isActive = true;
        }
    }

    private updateSelectedStatus() {
        if (this.sources && this.selectedItems) {
            const intersections = _.intersectionBy(this.sources, this.selectedItems, 'id');
            const differences = _.differenceBy(this.sources, this.selectedItems, 'id');
            if (intersections && intersections.length > 0) {
                _.each(intersections, (item: NhSuggestion) => {
                    item.isSelected = true;
                });
            }
            if (differences && differences.length > 0) {
                _.each(differences, (item: NhSuggestion) => {
                    item.isSelected = false;
                });
            }
        }
    }

    private focusSearchInputElement() {
        setTimeout(() => {
            const element: any = document.getElementById(this.id);
            if (element) {
                element.focus();
            }
        }, 100);
    }

    private renderPaging() {
        this.totalPages = Math.ceil(this.totalRows / (this.pageSize ? this.pageSize : 10));
        this.showLoadMore = this.totalPages > 0 && this.currentPage < this.totalPages;
    }
}
