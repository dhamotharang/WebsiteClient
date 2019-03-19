import {Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import { BaseListComponent } from '../../../../../base-list.component';
import { NhSuggestion, NhSuggestionComponent } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { finalize } from 'rxjs/operators';
import { ProductAttributeService } from '../product-attribute.service';
import { ToastrService } from 'ngx-toastr';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';

@Component({
    selector: 'app-product-attribute-value-suggestion',
    templateUrl: './product-attribute-value-suggestion.component.html'
})
export class ProductAttributeValueSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() selectedItem;
    @Input() attributeId;

    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(
        private toastr: ToastrService,
        private productAttributeService: ProductAttributeService, @Inject(PAGE_ID) public pageId: IPageId,
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
        if (!this.attributeId) {
            this.toastr.warning('Vui lòng chọn thuộc tính');
            return;
        }
        this.isSearching = true;
        this.currentPage = currentPage;
        this.productAttributeService.suggestionValue(this.attributeId, this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
                this.totalRows = result.totalRows;
                this.listItems = result.items;
            });
        // this.productAttributeService.suggestions(this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
        //     .pipe(finalize(() => this.isSearching = false))
        //     .subscribe((result: SearchResultViewModel<NhSuggestion>) => {
        //         this.totalRows = result.totalRows;
        //         this.listItems = result.items;
        //     });
    }

    clear() {
        this.nhSuggestionComponent.clear();
    }
}
