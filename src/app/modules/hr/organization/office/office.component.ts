import {
    Component,
    OnInit,
    Inject,
    ViewChild, AfterViewInit,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { finalize, map } from 'rxjs/operators';
import { OfficeService } from './services/office.service';
import { Office } from './models/office.model';
import { NhTabComponent } from '../../../../shareds/components/nh-tab/nh-tab.component';
import { BaseListComponent } from '../../../../base-list.component';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { OfficeSearchViewModel } from './models/office-search.viewmodel';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { OfficeFormComponent } from './office-form/office-form.component';
import { OfficeDetailComponent } from './office-detail/office-detail.component';
import { NhSuggestion } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { FilterLink } from '../../../../shareds/models/filter-link.model';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-office',
    templateUrl: './office.component.html',
    providers: [
        OfficeService,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
    ]
})

export class OfficeComponent extends BaseListComponent<OfficeSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild(NhTabComponent) tabComponent: NhTabComponent;
    @ViewChild(OfficeFormComponent) officeFormComponent: OfficeFormComponent;
    @ViewChild(OfficeDetailComponent) officeDetailComponent: OfficeDetailComponent;
    status?: number = null;
    isActive: boolean;
    listActiveSearch: any = [];

    // Test.
    data = [];

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private title: Title,
                private spinnerService: SpinnerService,
                private utilService: UtilService,
                private officeService: OfficeService) {
        super();
        this.subscribers.getListActiveSearch = this.appService.getListActiveSearch()
            .subscribe(result => this.listActiveSearch = result);
    }

    ngOnInit(): void {
        this.appService.setupPage(
            this.pageId.HR,
            this.pageId.OFFICE
        );
        this.listItems$ = this.route.data.pipe(
            map((result: { data: ISearchResult<OfficeSearchViewModel> }) => {
                const data = result.data;
                this.totalRows = data.totalRows;
                return data.items;
            })
        );
        this.officeService.searchForSuggestion('')
            .subscribe((result: NhSuggestion[]) => this.data = result);
    }

    ngAfterViewInit() {
        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            const url = this.router.url;
            const id = params.id;
            if (url.indexOf('detail') > -1 && id) {
                setTimeout(() => this.detail(id));
            }
            if (url.indexOf('edit') && id) {
                setTimeout(() => this.edit(id));
            }
        });
    }

    onSuggestionSearched(keyword: string) {
        this.officeService.searchForSuggestion(keyword)
            .subscribe((result: NhSuggestion[]) => this.data = result);
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.officeService
            .search(
                this.keyword,
                this.isActive,
                this.currentPage,
                this.pageSize
            )
            .pipe(
                finalize(() => (this.isSearching = false)),
                map((result: ISearchResult<OfficeSearchViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
    }

    refresh() {
        this.keyword = '';
        this.isActive = null;
    }

    add() {
        this.officeFormComponent.add();
    }

    edit(officeId: number) {
        this.location.go(`/organization/offices/edit?id=${officeId}`);
        this.officeFormComponent.edit(officeId);
    }

    detail(officeId: number) {
        this.location.go(`/organization/offices/detail?id=${officeId}`);
        this.officeDetailComponent.showDetail(officeId);
    }

    delete(officeId: number) {
        this.subscribers.deleteOffice = this.officeService.delete(officeId)
            .subscribe(() => this.search(1));
    }

    onChangeActiveStatus(office: Office) {
        office.isActive = !office.isActive;

        // this.officeService.updateIsActive(office).subscribe((result: IActionResultResponse) => {
        //     // if (result === -1) {
        //     //     this.toastr.error(this.formatString(this.message.notExists, 'Phòng ban'));
        //     //     return;
        //     // }
        //     //
        //     // if (result > 0) {
        //     //     this.toastr.success(`${office.isActive ? 'Kích hoạt' : 'Bỏ kích hoạt'} phòng ban "${office.name}" thành công.`);
        //     //     return;
        //     // }
        //     //
        //     // if (result === 0) {
        //     //     this.toastr.warning('Vui lòng thay đổi trạng thái của phòng ban');
        //     //     return;
        //     // }
        //
        //     this.toastr.warning(result.message, result.title);
        //     return;
        // });
    }

    onTabClosed(data: { id: string; active: boolean }) {
        if (data.active) {
            this.search(this.currentPage);
            this.tabComponent.setTabActiveById('tabListOffice');
        }
    }

    createRange(number) {
        const items = [];
        for (let i = 1; i <= number; i++) {
            items.push(i);
        }
        return items;
    }

    private renderFilterLink() {
        const path = '/organization/offices';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
