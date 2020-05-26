import {Component, enableProdMode, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { finalize } from 'rxjs/operators';
import { NhSuggestion, NhSuggestionComponent } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { BaseListComponent } from '../../../../base-list.component';
import { UnitService } from '../service/unit.service';

// if (!/localhost/.test(document.location.host)) {
//     enableProdMode();
// }

@Component({
  selector: 'app-unit-suggestion',
  templateUrl: './unit-suggestion.component.html'
})
export class UnitSuggestionComponent extends BaseListComponent<NhSuggestion> implements OnInit {
    @ViewChild(NhSuggestionComponent, {static: true}) nhSuggestionComponent: NhSuggestionComponent;
    @Input() isReceipt = false;
    @Input() multiple = false;
    @Input() selectedItem;
    @Output() keyPressed = new EventEmitter();
    @Output() itemSelected = new EventEmitter();
    @Output() itemRemoved = new EventEmitter();

    constructor(private unitService: UnitService) {
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
        this.unitService.suggestions(this.keyword, this.currentPage, this.appConfig.PAGE_SIZE)
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
