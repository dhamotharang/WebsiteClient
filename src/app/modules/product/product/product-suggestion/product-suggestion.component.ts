import {Component, enableProdMode, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ProductService } from '../service/product.service';
import {NhSuggestion, NhSuggestionComponent} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {BaseListComponent} from '../../../../base-list.component';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }
@Component({
    selector: 'app-product-suggestion',
    templateUrl: './product-suggestion.component.html'
})
export class ProductSuggestionComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild(NhSuggestionComponent, {static: true}) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() isReceipt = false;
    @Input() selectedItem;
    @Input() warehouseId: string;
    @Input() hasError = false;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private productService: ProductService) {
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
