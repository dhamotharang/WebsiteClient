import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { BaseListComponent } from '../../../../../base-list.component';
import { NhSuggestion, NhSuggestionComponent } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { GoodsReceiptNoteService } from '../goods-receipt-note.service';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';

@Component({
    selector: 'app-follow-suggestion',
    templateUrl: './follow-suggestion.component.html'
})

export class FollowSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() isReceipt = false;
    @Input() selectedItem;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    keyword$ = new Subject();

    constructor(private goodsReceiptNoteService: GoodsReceiptNoteService, @Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig) {
        super();
        this.keyword$.subscribe((term: string) => {
            this.keyword = term;
            this.search(1);
        });
    }

    ngOnInit() {
    }

    onItemSelected(item: any) {
        this.itemSelected.emit(item);
    }

    onSearchKeyPress(keyword: string) {
        this.keyword = keyword;
        this.keyPressed.emit(keyword);
        this.keyword$.next(keyword);
    }

    search(currentPage: number) {
        this.isSearching = true;
        this.currentPage = currentPage;
        this.goodsReceiptNoteService.followSuggestion(this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                this.totalRows = result.totalRows;
                this.listItems = result.items;
            });
    }

    clear() {
        this.nhSuggestionComponent.clear();
    }
}
