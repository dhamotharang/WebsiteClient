import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NhSuggestion, NhSuggestionComponent } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { BaseListComponent } from '../../../../../base-list.component';
import { UnitService } from '../../unit/service/unit.service';
import { ProductAttributeService } from '../product-attribute.service';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';

@Component({
  selector: 'app-product-attribute-suggestion',
  templateUrl: './product-attribute-suggestion.component.html'
})
export class ProductAttributeSuggestionComponent  extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() selectedItem;

    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private productAttributeService: ProductAttributeService, @Inject(PAGE_ID) public pageId: IPageId,
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
        this.productAttributeService.suggestions(this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
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
