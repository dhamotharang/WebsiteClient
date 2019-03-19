import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { NhSuggestion, NhSuggestionComponent } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { finalize } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { WarehouseService } from '../../warehouse/service/warehouse.service';
import { ToastrService } from 'ngx-toastr';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';

@Component({
    selector: 'app-warehouse-manager-suggestion',
    templateUrl: './warehouse-manager-suggestion.component.html'
})
export class WarehouseManagerSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() isReceipt = false;
    @Input() warehouseId;
    @Input() selectedItem;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(
        private toastr: ToastrService, @Inject(PAGE_ID) public pageId: IPageId,
        @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private warehouseService: WarehouseService) {
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
        if (!this.warehouseId) {
            this.toastr.warning('Vui lòng chọn kho nhập.');
            return;
        }
        this.isSearching = true;
        this.currentPage = currentPage;
        this.warehouseService.managerSuggestion(this.warehouseId, this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
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
