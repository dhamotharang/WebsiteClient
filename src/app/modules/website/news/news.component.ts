import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NewsFormComponent } from './news-form/news-form.component';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { NewsService } from './news.service';
import { ActivatedRoute } from '@angular/router';
import { BaseListComponent } from '../../../base-list.component';
import { APP_CONFIG, IAppConfig } from '../../../configs/app.config';
import { News } from './news.model';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { finalize, map } from 'rxjs/operators';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-news',
    templateUrl: './news.component.html',
})

export class NewsComponent extends BaseListComponent<News> implements OnInit {
    @ViewChild(NewsFormComponent) newsFormComponent: NewsFormComponent;
    categoryId: number;
    isActive: boolean;
    isHot: boolean;
    isHomePage: boolean;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private spinnerService: SpinnerService,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private newsService: NewsService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.NEWS, 'Quản lý tin tức', 'Danh sách tin tức');
        this.listItems$ = this.route.data.pipe(map((result: { data: ISearchResult<News> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.newsService.search(this.keyword, this.categoryId, this.isActive, this.isHot, this.isHomePage,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: ISearchResult<News>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    delete(id: number) {
        this.spinnerService.show('Đang xóa tin tức. Vui lòng đợi...');
        this.newsService.delete(id)
            .subscribe((result: IResponseResult) => {
                this.toastr.success(result.message);
            });
    }
}
