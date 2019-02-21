import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../shareds/services/util.service';
import { Page } from './models/page.model';
import { PageService } from './page.service';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { BaseListComponent } from '../../../base-list.component';
import { PageFormComponent } from './page-form.component';
import { FilterLink } from '../../../shareds/models/filter-link.model';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { IResponseResult } from '../../../interfaces/iresponse-result';
import { map } from 'rxjs/operators';
import { PageSearchViewModel } from './models/page-search.viewmodel';
import { finalize } from 'rxjs/internal/operators';

@Component({
    selector: 'app-page-component',
    templateUrl: './page.component.html',
    preserveWhitespaces: false
})

export class PageComponent extends BaseListComponent<PageSearchViewModel> implements OnInit {
    @ViewChild(PageFormComponent) pageFormComponent: PageFormComponent;
    isActive?: boolean;
    clientId?: string;
    page = new Page();

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private title: Title,
                private router: Router,
                private route: ActivatedRoute,
                private location: Location,
                private toastr: ToastrService,
                private utilService: UtilService,
                private spinnerService: SpinnerService,
                private pageService: PageService) {
        super();
        this.listItems$ = this.route.data.pipe(map((result: { data: PageSearchViewModel[] }) => {
            return result.data;
        }));

        this.subscribers.queryParams = this.route.queryParams.subscribe((params: any) => {
            this.keyword = params.keyword;
            this.isActive = params.isActive;
        });
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.CONFIG, this.pageId.CONFIG_PAGE, 'Cấu hình', 'Cấu hình trang');
    }

    search() {
        this.renderFilterLink();
        this.isSearching = true;
        this.listItems$ = this.pageService.search(this.keyword, this.isActive)
            .pipe(finalize(() => this.isSearching = false));
    }

    delete(id: number) {
        this.subscribers.deletePage = this.pageService.delete(id)
            .subscribe((result: IResponseResult) => {
                this.toastr.success(result.message);
                this.search();
            });
    }

    changeActiveStatus(page: Page) {
        page.isActive = !page.isActive;
    }

    add() {
        this.pageFormComponent.add();
    }

    edit(page: Page) {
        this.pageFormComponent.edit(page);
    }

    private renderFilterLink() {
        const path = '/config/pages';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('clientId', this.clientId),
            new FilterLink('isActive', this.isActive),
        ]);
        this.location.go(path, query);
    }
}
