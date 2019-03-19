import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { NhSuggestion, NhSuggestionComponent } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { finalize } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { BaseListComponent } from '../../../../base-list.component';
import { GoodsDeliveryNoteService } from '../goods-delivery-note/goods-delivery-note.service';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';

@Component({
    selector: 'app-receiver-suggestion',
    templateUrl: './receiver-suggestion.component.html'
})
export class ReceiverSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {

    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() isReceipt = false;
    @Input() selectedItem;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private goodsDeliveryNoteService: GoodsDeliveryNoteService, @Inject(PAGE_ID) private pageId: IPageId,
                @Inject(APP_CONFIG) private appConfig: IAppConfig) {
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
        this.goodsDeliveryNoteService.receiverSuggestion(this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                this.totalRows = result.totalRows;
                if (isLoadMore) {
                    this.listItems = this.listItems.concat(result.items);
                } else {
                    this.listItems = result.items;
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
