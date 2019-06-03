import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostListener,
    Inject,
    Input,
    OnInit,
    Output,
    Renderer,
    ViewChild
} from '@angular/core';
import {Subject} from 'rxjs';
import * as _ from 'lodash';
import {Tag} from './tag.model';
import {IMessage} from '../../../interfaces/imessage';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {ToastrService} from 'ngx-toastr';
import {debounceTime, distinctUntilChanged, finalize} from 'rxjs/internal/operators';
import {TagService} from './tag.service';
import {SearchResultViewModel} from '../../view-models/search-result.viewmodel';
import {environment} from '../../../../environments/environment';

@Component({
    selector: 'nh-tag',
    templateUrl: './nh-tag.component.html',
    styleUrls: ['./nh-tag.less']
})

export class NhTagComponent implements OnInit, AfterViewInit {
    @ViewChild('tagInput') tagInput: ElementRef;
    @Input() url = 'tag/search-tag';
    @Input() urlAbsolute = ``;
    @Input() placeholder = 'Nhập tag';
    @Input() value: string;
    @Input() languageId: string;
    @Input() tenantId: string;
    @Output() onSelectListItem = new EventEmitter();
    @Output() onTyping = new EventEmitter();
    @Output() onSelect = new EventEmitter();
    @Output() onRemove = new EventEmitter();
    @Input() clearAfterSelect = false;
    @Input() allowDelete = true;
    @Input() allowEdit = true;
    @Input() type = 0;
    @Input() objectId = 0;
    @Input() pageSize = 20;
    @Input() listTag: Tag[] = [];
    @Input() isAbsoluteUrl = false;
    isSearching = false;
    isShowMenu = false;
    listItems = [];
    isHasFocus = true;
    searchTerm = new Subject<string>();
    message: IMessage;
    private _text: string;
    propagateChange: any = () => {
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
        this.value = value;
    }

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                private el: ElementRef,
                private renderer: Renderer,
                private nhTagService: TagService,
                private toastr: ToastrService) {
        this.urlAbsolute = `${appConfig.CORE_API_URL}tags/`;
        this.searchTerm.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(term => {
            if (!term) {
                return;
            }
            this.isSearching = true;
            this.nhTagService.search(this.isAbsoluteUrl, this.tenantId, this.languageId, term, this.type, 1, this.appConfig.PAGE_SIZE)
                .pipe(finalize(() => {
                    this.isSearching = false;
                })).subscribe((result: SearchResultViewModel<Tag>) => {
                setTimeout(() => {
                    this.renderer.invokeElementMethod(this.tagInput.nativeElement, 'focus');
                }, 100);
                this.isSearching = false;
                if (result.totalRows <= 0) {
                    this.isShowMenu = false;
                } else {
                    this.isShowMenu = true;
                    this.listItems = result.items.map((item, index) => {
                        const obj: any = item;
                        obj.index = index;
                        obj.selected = false;
                        return obj;
                    });
                }
            });
        });
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        if (!this.listTag) {
            this.listTag = [];
        }
    }

    search(keyword: string) {
        this.isSearching = true;
        this.nhTagService.search(this.isAbsoluteUrl, this.tenantId, this.languageId, keyword, this.type, 1, this.pageSize)
            .subscribe((result: SearchResultViewModel<Tag>) => {
                this.isSearching = false;
                this.listItems = result.items;
            });
    }

    registerOnChange(fn) {
        this.propagateChange = fn;
    }

    writeValue(value) {
        if (!value) {
            this.text = '';
        } else {
            this.text = value;
        }
    }

    typing(e: any) {
        const keyCode = e.keyCode;
        const value = e.target.value;
        if (keyCode === 13) {
            if (!this.checkIsExistsTagName(value)) {
                const tag = new Tag('', this.tenantId, this.languageId, value, this.type, '');
                this.listTag.push(tag);
                this.onSelectListItem.emit(this.listTag);
                this.onSelect.emit(tag);
            }

            this.text = '';
            e.preventDefault();
        }

        if (keyCode === 50) {
            this.onTyping.emit({
                    id: -1,
                    name: value
                }
            );
            if (value !== '') {
                this.searchTerm.next(value);
            } else {
                this.text = '';
                this.listItems = [];
                this.isShowMenu = false;
            }
        }
        // Navigate
        if (keyCode === 27) {
            this.isShowMenu = false;
        }

        if (keyCode === 27 || keyCode === 17 || e.ctrlKey) {
            return;
        }

        if (keyCode === 37 || keyCode === 38 || keyCode === 39 || keyCode === 40 || keyCode === 13) {
            this.navigate(keyCode);
            e.preventDefault();
        } else {
            this.onTyping.emit({id: -1, name: value});
            if (value !== '') {
                this.searchTerm.next(value);
            } else {
                this.text = '';
                this.listItems = [];
                this.isShowMenu = false;
            }
        }
    }

    selectItem(item: Tag) {
        const listTag = this.listTag;
        if (this.checkIsExistsTagName(item.name)) {
            this.value = '';
            this.text = '';
            this.toastr.error(item.name + ' đã tồn tại.');
        } else {
            this.listTag.push(item);
            this.onSelectListItem.emit(this.listTag);
            this.onSelect.emit(item);
            this.text = '';
            this.value = '';
        }

        this.propagateChange(item.name);
        this.isShowMenu = false;
    }

    checkIsExistsTagName(tagName: string) {
        const listTag = _.filter(this.listTag, (item) => {
            return item.name === tagName;
        });

        return listTag.length > 0;
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(el) {
        if (!this.el.nativeElement.contains(el.target)) {
            this.isShowMenu = false;
        }
    }

    private navigate(key: number) {
        const selectedItem = this.listItems.find((item) => {
            return item.selected;
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
                }
                break;
        }
    }

    private next(selectedItem: any) {
        if (!selectedItem) {
            const firstItem = this.listItems[0];
            if (firstItem) {
                firstItem.selected = true;
            }
        } else {
            let index = selectedItem.index + 1;
            if (index > this.listItems.length - 1) {
                index = 0;
            }

            const currentItem = this.listItems[index];
            this.resetSelectedStatus();
            currentItem.selected = true;
        }
    }

    private back(selectedItem: any) {
        if (!selectedItem) {
            const lastItem = this.listItems[this.listItems.length - 1];
            if (lastItem) {
                lastItem.selected = true;
            }
        } else {
            let index = selectedItem.index - 1;
            if (index < 0) {
                index = this.listItems.length - 1;
            }

            const currentItem = this.listItems[index];
            this.resetSelectedStatus();
            currentItem.selected = true;
        }
    }

    private resetSelectedStatus() {
        this.listItems.forEach((item) => item.selected = false);
    }

    remove(item): void {
        if (_.filter(this.listTag, function (it) {
                return it.name === item.name;
            }).length > 0) {

            this.value = '';
            this.text = '';
            _.remove(this.listTag, function (its) {
                return its.name === item.name;
            });

            this.onSelectListItem.emit(this.listTag);

            this.onRemove.emit(item);
        }
    }
}
