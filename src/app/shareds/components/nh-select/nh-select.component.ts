import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    forwardRef,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
    ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as _ from 'lodash';
import { HttpClient, HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { SearchResultViewModel } from '../../view-models/search-result.viewmodel';
import { BehaviorSubject } from 'rxjs';

export class NhSelect {
    constructor(public id: any,
                public name: string,
                public icon?: string,
                public data?: any,
                public index?: number,
                public active?: boolean,
                public selected?: boolean) {
    }
}

export class NhSelectData {
    constructor(public id: any,
                public name: string,
                public icon?: string,
                public data?: any,
                public index?: number,
                public active?: boolean,
                public selected?: boolean) {
    }
}

@Component({
    selector: 'nh-select',
    templateUrl: './nh-select.component.html',
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => NhSelectComponent), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => NhSelectComponent), multi: true}
    ],
    styleUrls: ['./nh-select.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class NhSelectComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
    private _data: NhSelect[] = [];
    private _selectedItem = null;
    // @ViewChild('searchBox') searchBox: ElementRef<any>;
    @ViewChild('dropdownTemplate') dropdownTemplate: TemplateRef<any>;
    @Input() multiple = false;
    @Input() liveSearch = false;
    @Input() title: string;
    @Input() isEnable = true;
    @Input() width = 250;
    @Input() isInsertValue = false;
    @Input() url: string;
    @Input() loading: boolean;
    @Input() pageSize = 10;
    @Input() selectedItems = [];

    /**
     * @deprecated use itemSelected instead
     */
    @Output() onSelectItem = new EventEmitter();

    @Output() itemSelected = new EventEmitter();

    @Output() valueChange = new EventEmitter();

    @Output() shown = new EventEmitter();

    @Output() hidden = new EventEmitter();

    /**
     * @deprecated use valueInserted instead.
     */
    @Output() onInsertValue = new EventEmitter();
    @Output() valueInserted = new EventEmitter();

    @Output() keywordPressed = new EventEmitter();

    isSearching = false;
    source = [];
    label;
    inputId;
    currentPage = 1;
    totalRows = 0;
    totalPages = 0;
    private _value: any;
    private overlayRef: OverlayRef;
    private positionStrategy = new GlobalPositionStrategy();

    searchTerm$ = new BehaviorSubject<string>('');

    propagateChange: any = () => {
    };

    get value() {
        return this._value;
    }

    get data() {
        return this._data;
    }

    @Input()
    set data(values: NhSelect[]) {
        setTimeout(() => {
            if (values) {
                this._data = values;
                this.source = values.map((item, index) => {
                    const obj = item;
                    obj.index = index;
                    obj.active = false;

                    if (this.value && this.value instanceof Array) {
                        item.selected = this.value.indexOf(item.id) > -1;
                    } else {
                        item.selected = item.id === this.value;
                    }
                    return obj;
                });

                const labelName = this.source.filter((item: any) => {
                    return item.selected;
                }).map(item => item.name).join(',');

                if (labelName) {
                    this.label = labelName;
                }
            }
        });
    }

    @Input()
    set value(val) {
        if (val != null) {
            if (val instanceof Array) {
                this._value = val;
                const selectedItem = _.filter(this.source, (item) => {
                    return val.indexOf(item.id) > -1;
                });

                if (selectedItem && selectedItem.length > 0) {
                    _.each(selectedItem, (item) => {
                        item.selected = true;
                    });
                    this.label = this.getSelectedName(selectedItem);
                } else {
                    this.label = this.title;
                }
            } else {
                this.getSelectedItem(val);
            }
        } else {
            if (this.multiple) {
                this.getSelectedItem(val);
            } else {
                this.label = this.title;
            }
        }
    }

    @Input()
    set selectedItem(value) {
        this._selectedItem = value;
        if (value) {
            this.label = value.name ? value.name : this.title;
        }
    }

    get selectedItem() {
        return this._selectedItem;
    }

    constructor(private overlay: Overlay,
                private viewContainerRef: ViewContainerRef,
                private http: HttpClient,
                private el: ElementRef, private renderer: Renderer2) {
        this.inputId = `nh-select-${new Date().getTime() + Math.floor((Math.random() * 10) + 1)}`;
        this.searchTerm$
            .pipe(
                debounceTime(500),
                distinctUntilChanged(),
                // switchMap((term: string) => this.search(term))
            )
            .subscribe((term: string) => {
                if (this.liveSearch && this.url) {
                    this.search(term);
                }
            });
    }

    ngOnInit() {
        if (this.url) {
            this.search();
        }
    }

    ngAfterViewInit() {
        this.overlayRef = this.overlay.create({
            positionStrategy: this.positionStrategy
        });
    }

    ngOnDestroy() {
        this.dismissMenu();
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    searchKeyUp(e, term) {
        const keyCode = e.keyCode;
        // Navigate
        if (keyCode === 27) {
            // Check
        }

        if (keyCode === 27 || keyCode === 17 || e.ctrlKey) {
            return;
        }

        if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40 || keyCode === 13) {
            this.navigate(keyCode);
            e.preventDefault();
        } else {
            if (!term) {
                this.source = this.data.map((item, index) => {
                    const obj = item;
                    obj.index = index;
                    obj.active = false;
                    obj.selected = false;
                    return obj;
                });
                return;
            }
            if (this.url) {
                // this.search(term);
                this.searchTerm$.next(term);
            } else {
                const searchResult = _.filter(this.data, (item) => {
                    return this.stripToVietnameChar(item.name).indexOf(this.stripToVietnameChar(term)) > -1;
                });
                this.source = searchResult.map((item, index) => {
                    const obj = item;
                    obj.index = index;
                    obj.active = false;
                    obj.selected = false;
                    return obj;
                });
            }
        }
    }

    buttonClick() {
        this.initDropdownMenu();
    }

    selectItem(item: NhSelect) {
        if (!this.multiple) {
            this.label = item.name;
            _.each(this.source, (data) => {
                data.selected = false;
            });
            item.selected = true;
            this.value = item.id;
            this.propagateChange(item.id);
            this.onSelectItem.emit(item);
            this.itemSelected.emit(item);
            this.dismissMenu();
        } else {
            item.selected = !item.selected;
            const selectedItem = _.filter(this.source, (source: any) => {
                return source.selected;
            });
            this.label = selectedItem && selectedItem.length > 0 ? this.getSelectedName(selectedItem) : this.title;

            if (this.value instanceof Array) {
                const selectedIds = selectedItem.map((selected) => {
                    return selected.id;
                });
                this.onSelectItem.emit(selectedItem);
                this.itemSelected.emit(selectedItem);
                this.propagateChange(selectedIds);
            } else {
                this.onSelectItem.emit(selectedItem);
                this.itemSelected.emit(selectedItem);
                this.propagateChange(item.id);
            }
        }
    }

    @HostListener('document:click', ['$event'])
    onClick(event) {
        const menuElement = this.overlayRef.overlayElement.getElementsByClassName('nh-select-menu')[0];
        if (menuElement && !menuElement.contains(event.target)
            && !this.el.nativeElement.contains(event.target)) {
            this.dismissMenu();
        }
    }

    // @HostListener('scroll', ['$event'])
    // onWindowScroll() {
    //     console.log('window scroll');
    // }

    stripToVietnameChar(str): string {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        return str;
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value) {
        if (value != null && value !== undefined && value !== '') {
            this.value = value;
        } else {
            this.label = this.title;
        }
    }

    registerOnTouched() {
    }

    validate(c: FormControl) {
        this.value = c.value;
    }

    resetSelectedList() {
        _.each(this.source, (item) => {
            item.selected = false;
        });
        this.label = this.title;
    }

    insertValue() {
        this.label = this.searchTerm$.value;
        this.onInsertValue.emit(this.searchTerm$.value);
        this.valueInserted.emit(this.searchTerm$.value);
    }

    clear() {
        this.selectedItems = [];
        this.label = this.title;
    }

    private getSelectedItem(val) {
        _.each(this.source, (item) => {
            if (item.id === val) {
                this.label = item.name;
                item.selected = true;
            } else {
                item.selected = false;
            }
        });

        this._value = val;
        this.valueChange.emit(this._value);
    }

    private getSelectedName(listItem): string {
        return listItem.map((item) => {
            return item.name;
        }).join(', ');
    }

    private navigate(key: number) {
        const selectedItem = this.source.find((item) => {
            return item.active;
        });

        switch (key) {
            case 37:
                this.back(selectedItem);
                break;
            case 38:
                this.back(selectedItem);
                break;
            case 39:
                this.next(selectedItem);
                break;
            case 40:
                this.next(selectedItem);
                break;
            case 13:
                if (selectedItem) {
                    this.selectItem(selectedItem);
                }
                break;
        }
    }

    private next(selectedItem: any) {
        if (!selectedItem) {
            const firstItem = this.source[0];
            if (firstItem) {
                firstItem.active = true;
            }
        } else {
            let index = selectedItem.index + 1;
            if (index > this.source.length - 1) {
                index = 0;
            }

            const currentItem = this.source[index];
            this.resetActiveStatus();
            currentItem.active = true;
        }
    }

    private back(selectedItem: any) {
        if (!selectedItem) {
            const lastItem = this.source[this.source.length - 1];
            if (lastItem) {
                lastItem.active = true;
            }
        } else {
            let index = selectedItem.index - 1;
            if (index < 0) {
                index = this.source.length - 1;
            }

            const currentItem = this.source[index];
            this.resetActiveStatus();
            currentItem.active = true;
        }
    }

    private resetActiveStatus() {
        this.source.forEach((item) => item.active = false);
    }

    private initDropdownMenu() {
        if (this.overlayRef) {
            if (!this.overlayRef.hasAttached()) {
                this.overlayRef.attach(new TemplatePortal(this.dropdownTemplate, this.viewContainerRef));
                const clientRect = this.el.nativeElement.getBoundingClientRect();
                const menuElement = this.overlayRef.overlayElement.getElementsByClassName('nh-select-menu')[0];
                const menuHeight = this.overlayRef.overlayElement.getElementsByClassName('nh-select-menu')[0].clientHeight;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                const isLeft = windowWidth - (clientRect.left + 350) > 0;
                const isTop = windowHeight - (clientRect.top + clientRect.height + menuHeight + 10) < 0;
                const left = isLeft ? clientRect.left : clientRect.left - (250 - clientRect.width);
                const top = isTop ? clientRect.top - menuHeight - 10 : clientRect.top + clientRect.height;
                this.positionStrategy.left(`${left}px`);
                this.positionStrategy.top(`${top}px`);
                this.renderer.addClass(menuElement, isTop ? 'nh-menu-top' : 'nh-menu-bottom');
                this.renderer.addClass(menuElement, isLeft ? 'nh-menu-left' : 'nh-menu-right');
                this.positionStrategy.apply();
                if (this.liveSearch && document.getElementById(this.inputId)) {
                    document.getElementById(this.inputId).focus();
                }
                this.shown.emit();
            } else {
                this.overlayRef.detach();
            }
        }
    }

    private dismissMenu() {
        if (this.overlayRef && this.overlayRef.hasAttached()) {
            this.overlayRef.detach();
            this.hidden.emit();
        }
    }

    private search(searchTerm?: string) {
        this.source = [];
        this.isSearching = true;
        if (!this.url) {
            this.isSearching = false;
            return;
        }
        this.http
            .get<any>(this.url, {
                params: new HttpParams()
                    .set('keyword', searchTerm ? searchTerm : '')
                    .set('pageSize', this.pageSize ? this.pageSize.toString() : '10')
            })
            .pipe(
                finalize(() => this.isSearching = false)
            )
            .subscribe((result: SearchResultViewModel<any>) => {
                const items = result.items;
                this.totalRows = result.totalRows;
                this.paging();
                this.source = items.map((item, index) => {
                    const obj = item;
                    obj.index = index;
                    obj.active = false;
                    obj.selected = false;
                    return obj;
                });
            });
    }

    private paging() {
        const pageSize = this.pageSize ? this.pageSize : 10;
        this.totalPages = Math.ceil(this.totalRows / pageSize);
    }
}
