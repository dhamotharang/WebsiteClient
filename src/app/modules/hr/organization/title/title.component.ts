import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Title } from './title.model';
import { TitleService } from './title.service';
import { TitleFormComponent } from './title-form/title-form.component';
import { TitleSearchViewModel } from './models/title-search.viewmodel';
import { BaseListComponent } from '../../../../base-list.component';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { UtilService } from '../../../../shareds/services/util.service';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { FilterLink } from '../../../../shareds/models/filter-link.model';

@Component({
    selector: 'app-title-component',
    templateUrl: './title.component.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class TitleComponent extends BaseListComponent<TitleSearchViewModel> implements OnInit {
    @ViewChild(TitleFormComponent) titleFormComponent: TitleFormComponent;
    isActive?: boolean;
    isManager?: boolean;
    isMultiple?: boolean;
    positionId?: number;
    title = new Title();
    titles: Title[];
    listActiveSearch: any = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private location: Location,
                private titleService: TitleService,
                private utilService: UtilService,
                private router: Router,
                private route: ActivatedRoute) {
        super();
        this.subscribers.getListActiveSearch = this.appService.getListActiveSearch()
            .subscribe(result => this.listActiveSearch = result);
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.HR, this.pageId.TITLE, 'Quản lý chức danh', 'Danh sách chức danh');
        this.listItems$ = this.route.data.pipe(map((result: { data: ISearchResult<TitleSearchViewModel> }) => {
                const data = result.data;
                this.totalRows = data.totalRows;
                return data.items;
            })
        );

        this.subscribers.queryParams = this.route.queryParams.subscribe(queryParam => {
                if (queryParam.isActive) {
                    this.isActive = !!queryParam.isActive;
                }
                if (queryParam.page) {
                    this.currentPage = parseInt(queryParam.page);
                }
                if (queryParam.pageSize) {
                    this.pageSize = parseInt(queryParam.pageSize);
                }
            }
        );
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.renderFilterLink();
        this.isSearching = true;
        this.listItems$ = this.titleService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((data: ISearchResult<TitleSearchViewModel>) => {
                    this.totalRows = data.totalRows;
                    return data.items;
                }));
    }

    refresh() {
        this.keyword = '';
        this.isActive = null;
        this.search(1);
    }

    add() {
        this.titleFormComponent.add();
    }

    edit(title: Title) {
        this.titleFormComponent.edit(title);
    }

    delete(id: string) {
        this.titleService.delete(id)
            .subscribe(() => {
                this.search(this.currentPage);
                return;
            });
    }

    private renderFilterLink() {
        const path = '/organization/titles';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('pageId', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
