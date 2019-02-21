import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { NewsService } from '../news.service';
import { INewsPickerViewModel } from '../inews-picker.viewmodel';
import { NhModalComponent } from '../../../../shareds/components/nh-modal/nh-modal.component';
import { finalize, map } from 'rxjs/operators';

@Component({
    selector: 'app-news-picker',
    templateUrl: './news-picker.component.html'
})

export class NewsPickerComponent extends BaseListComponent<INewsPickerViewModel> implements OnInit {
    @ViewChild('pickerModal') pickerModal: NhModalComponent;
    @Output() onAccept = new EventEmitter();
    listSelected: INewsPickerViewModel[] = [];

    constructor(private toastr: ToastrService,
                private newsService: NewsService) {
        super();
    }

    ngOnInit() {
    }

    show() {
        this.listSelected = [];
        this.search(1);
        this.pickerModal.open();
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.newsService.searchPicker(this.keyword, null, this.currentPage)
            .pipe(finalize(() => this.isSearching = false),
                map((result: ISearchResult<INewsPickerViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    selectItem(news: INewsPickerViewModel) {
        const newsInfo = _.find(this.listSelected, (item: INewsPickerViewModel) => {
            return item.id === news.id;
        });
        if (newsInfo) {
            this.toastr.warning(`Chuyên mục ${newsInfo.name} đã được chọn. Vui lòng kiểm tra lại.`);
            return;
        }
        this.listSelected.push(news);
    }

    removeItem(news: INewsPickerViewModel) {
        _.remove(this.listSelected, news);
    }

    accept() {
        this.onAccept.emit(this.listSelected);
        this.pickerModal.dismiss();
    }
}
