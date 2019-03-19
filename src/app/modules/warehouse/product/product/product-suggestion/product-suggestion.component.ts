import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { BaseListComponent } from '../../../../../base-list.component';
import { NhSuggestion, NhSuggestionComponent } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { ProductService } from '../service/product.service';
import { WarehouseService } from '../../../warehouse/service/warehouse.service';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';

@Component({
    selector: 'app-product-suggestion',
    templateUrl: './product-suggestion.component.html'
})
export class ProductSuggestionComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() isReceipt = false;
    @Input() selectedItem;
    @Input() warehouseId: string;
    @Input() hasError = false;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private productService: ProductService, @Inject(PAGE_ID) public pageId: IPageId,
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
        this.keyPressed.emit(keyword);
        this.keyword = keyword;
        this.search(1);
    }

    search(currentPage: number) {
        this.isSearching = true;
        this.currentPage = currentPage;
        if (this.warehouseId) {
            this.warehouseService.productSuggestions(this.warehouseId, this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
                .pipe(finalize(() => this.isSearching = false))
                .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                    this.totalRows = result.totalRows;
                    this.listItems = result.items.map((product: any) => {
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.lotId,
                            image: product.image,
                            data: product
                        };
                    });
                });
        } else {
            this.productService.suggestions(this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
                .pipe(finalize(() => this.isSearching = false))
                .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                    this.totalRows = result.totalRows;
                    this.listItems = result.items.map((product: any) => {
                        return {
                            id: product.id,
                            name: product.name,
                            description: product.lotId,
                            image: product.image,
                            data: product
                        };
                    });
                });
        }

    }

    clear() {
        this.nhSuggestionComponent.clear();
    }

}
