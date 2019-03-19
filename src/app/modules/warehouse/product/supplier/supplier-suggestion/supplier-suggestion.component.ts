import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import { BaseListComponent } from '../../../../../base-list.component';
import { SupplierService } from '../service/supplier.service';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { NhSuggestion, NhSuggestionComponent } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';

@Component({
    selector: 'app-supplier-suggestion',
    templateUrl: './supplier-suggestion.component.html',
    styleUrls: ['./supplier-suggestion.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SupplierSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() isReceipt = false;
    @Input() selectedItem;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private supplierService: SupplierService, @Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig) {
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
        this.supplierService.suggestions(this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
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
