import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { SuggestionViewModel } from '../../../../shareds/view-models/SuggestionViewModel';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { WarehouseService } from '../service/warehouse.service';
import { NhSuggestion, NhSuggestionComponent } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';

@Component({
    selector: 'app-warehouse-suggestion',
    templateUrl: './warehouse-suggestion.component.html',
})
export class WarehouseSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() isReceipt = false;
    @Input() multiple = false;
    @Input() selectedItem;

    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private warehouseService: WarehouseService, @Inject(PAGE_ID) private pageId: IPageId,
                @Inject(APP_CONFIG) private appConfig: IAppConfig) {
        super();
    }

    ngOnInit() {
    }

    onItemSelected(item: any) {
        this.itemSelected.emit(item);
    }

    onSearchKeyPress(keyword: string) {
        this.keyPressed.emit(keyword);
        this.keyword = keyword;
        this.search(1);
    }

    search(currentPage: number) {
        this.isSearching = true;
        this.currentPage = currentPage;
        this.warehouseService.suggestions(this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
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
