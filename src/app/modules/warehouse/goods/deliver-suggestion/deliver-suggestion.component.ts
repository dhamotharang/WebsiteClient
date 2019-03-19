import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { NhSuggestion, NhSuggestionComponent } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { BaseListComponent } from '../../../../base-list.component';
import { Subject } from 'rxjs';
import { GoodsReceiptNoteService } from '../goods-receipt-note/goods-receipt-note.service';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';

@Component({
    selector: 'app-deliver-suggestion',
    templateUrl: './deliver-suggestion.component.html'
})

export class DeliverSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() isReceipt = false;
    @Input() supplierId: string;
    @Input() selectedItem;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private goodsReceiptNoteService: GoodsReceiptNoteService,
                @Inject(PAGE_ID) private pageId: IPageId,
                @Inject(APP_CONFIG) private appConfig: IAppConfig
                ) {
        super();
    }

    ngOnInit() {
    }

    onItemSelected(item: any) {
        this.itemSelected.emit(item);
    }

    onSearchKeyPress(keyword: string) {
        this.keyword = keyword;
        this.keyPressed.emit(keyword);
        this.search(1);
    }

    search(currentPage: number, isLoadMore = false) {
        this.isSearching = true;
        this.currentPage = currentPage;
        this.goodsReceiptNoteService.deliverSuggestion(this.supplierId, this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                this.totalRows = result.totalRows;
                const items: any = result.items.map((item: any) => {
                    return {
                        id: item.id,
                        name: item.name,
                        description: item.phoneNumber,
                        data: item
                    };
                });
                if (isLoadMore) {
                    this.listItems = this.listItems.concat(items);
                } else {
                    this.listItems = items;
                }

            });
    }

    clear() {
        this.nhSuggestionComponent.clear();
    }

    onNextPage(event: any) {
        this.keyword = event.keyword;
        this.pageSize = event.pageSize;
        this.search(event.page, true);
    }
}
