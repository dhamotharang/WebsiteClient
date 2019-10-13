import {Component, enableProdMode, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {ProductAttributeService} from '../product-attribute.service';
import {ToastrService} from 'ngx-toastr';
import {BaseListComponent} from '../../../../base-list.component';
import {NhSuggestion, NhSuggestionComponent} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {ProductAttributeValue, ProductAttributeValueTranslation} from '../product-attribute-value/models/product-attribute-value.model';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }

import * as _ from 'lodash';

@Component({
    selector: 'app-product-attribute-value-suggestion',
    templateUrl: './product-attribute-value-suggestion.component.html'
})
export class ProductAttributeValueSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() selectedItem;
    @Input() attributeId;
    @Input() allowAdd = false;
    @Input() languageId = 'vi-VN';

    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();
    @Output() addItem = new EventEmitter();

    constructor(
        private toastr: ToastrService,
        private productAttributeService: ProductAttributeService) {
        super();
    }

    ngOnInit() {
    }

    onItemSelected(item: any) {
        if (this.allowAdd && item.id === null) {
            const attributeValue = new ProductAttributeValue();
            attributeValue.isActive = true;
            const attributeValueTransactions: ProductAttributeValueTranslation[] = [];
            const attributeValueTransaction = new ProductAttributeValueTranslation();
            attributeValueTransaction.languageId = this.languageId;
            attributeValueTransaction.name = item.name;

            attributeValueTransactions.push(attributeValueTransaction);
            attributeValue.translations = attributeValueTransactions;
            this.productAttributeService.insertValue(this.attributeId, attributeValue).subscribe((result: ActionResultViewModel) => {
                item.id = result.data;
                this.addItem.emit(item);
            });
        } else {
            this.itemSelected.emit(item);
        }
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
    }

    clear() {
        this.nhSuggestionComponent.clear();
    }
}
