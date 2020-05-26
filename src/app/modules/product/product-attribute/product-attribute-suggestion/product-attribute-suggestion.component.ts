import {Component, enableProdMode, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {NhSuggestion, NhSuggestionComponent} from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {BaseListComponent} from '../../../../base-list.component';
import {ProductAttributeService} from '../product-attribute.service';
import * as _ from 'lodash';
import {ProductAttribute} from '../../product/product-form/product-attribute/model/product-value.model';
// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }
@Component({
    selector: 'app-product-attribute-suggestion',
    templateUrl: './product-attribute-suggestion.component.html'
})
export class ProductAttributeSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent, {static: true}) nhSuggestionComponent: NhSuggestionComponent;
    @Input() multiple = false;
    @Input() selectedItem;
    @Input() listSelectedItem: ProductAttribute[];
    @Input() isReadOnly = false;
    @Input() allowAdd = false;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private productAttributeService: ProductAttributeService) {
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
                console.log(this.listSelectedItem);
                this.listItems = _.filter(result.items, (select: NhSuggestion) => {
                    return !(_.find(this.listSelectedItem, (selected: ProductAttribute) => {
                            return selected.attributeId === select.id;
                        }
                    ));
                });
            });
    }

    clear() {
        this.nhSuggestionComponent.clear();
    }

}
