import {AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnInit} from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {HelperService} from '../../../shareds/services/helper.service';
import {APP_CONFIG, IAppConfig} from '../../../configs/app.config';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilService} from '../../../shareds/services/util.service';
import {finalize, map} from 'rxjs/operators';
import {SearchResultViewModel} from '../../../shareds/view-models/search-result.viewmodel';
import {IResponseResult} from '../../../interfaces/iresponse-result';
import {FilterLink} from '../../../shareds/models/filter-link.model';
import {BaseListComponent} from '../../../base-list.component';
import {MenuSearchViewModel} from './viewmodel/menu-search.viewmodel';
import {MenuService} from './menu.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    providers: [
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy},
        HelperService, MenuService]
})

export class MenuComponent extends BaseListComponent<MenuSearchViewModel> implements OnInit, AfterViewInit {
    isActive: boolean;
    height;

    constructor(@Inject(APP_CONFIG) public appConfig: IAppConfig,
                @Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private router: Router,
                private utilService: UtilService,
                private location: Location,
                private cdr: ChangeDetectorRef,
                private menuService: MenuService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.MENU, 'Quản lý Menu', 'Danh sách menu');
        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<MenuSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.isActive = params.isActive ? Boolean(params.isActive) : null;
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.height = window.innerHeight - 270;
        this.cdr.detectChanges();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.height = window.innerHeight - 270;
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderLink();
        this.listItems$ = this.menuService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<MenuSearchViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    resetFormSearch() {
        this.isActive = null;
        this.keyword = '';
        this.search(1);
    }

    edit(id: string) {
        this.router.navigate([`/config/menus/edit/${id}`]);
    }

    detail(id: string) {
    }

    delete(id: string) {
        this.menuService.delete(id)
            .subscribe((result: IResponseResult) => {
                this.search(this.currentPage);
            });
    }

    private renderLink() {
        const path = '/config/menus';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('isActive', this.isActive),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
