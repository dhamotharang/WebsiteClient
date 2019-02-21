import { Component, OnInit, Inject, ViewChild, AfterContentInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { PositionFormComponent } from './position-form/position-form.component';
import { Position } from './position.model';
import { PositionService } from './position.service';
import { BaseListComponent } from '../../../../base-list.component';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { SpinnerService } from '../../../../core/spinner/spinner.service';
import { UtilService } from '../../../../shareds/services/util.service';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { FilterLink } from '../../../../shareds/models/filter-link.model';
import { map } from 'rxjs/operators';
import { PositionSearchViewModel } from './models/postion-search.viewmodel';

@Component({
    selector: 'app-position-component',
    templateUrl: './position.component.html',
    providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})

export class PositionComponent extends BaseListComponent<PositionSearchViewModel> implements OnInit, AfterContentInit {
    @ViewChild(PositionFormComponent) positionFormComponent: PositionFormComponent;
    isActive?: boolean;
    isManager?: boolean;
    isMultiple?: boolean;
    private searchTerm = new Subject<string>();

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private location: Location,
                private positionService: PositionService,
                private spinnerService: SpinnerService,
                private toastr: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private utilService: UtilService) {
        super();
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.HR, this.pageId.POSITION, 'Quản lý chức vụ', 'Danh sách chức vụ');
        this.searchTerm
            .pipe(debounceTime(500))
            .subscribe(term => {

            });

        this.listItems$ = this.route.data.pipe(map((result: { data: ISearchResult<PositionSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));
    }

    ngAfterContentInit() {
    }

    search(currentPage) {
        this.currentPage = currentPage;
        this.renderFilterLink();
        this.isSearching = true;
        this.listItems$ = this.positionService.search(this.keyword, this.isManager, this.isMultiple,
            this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false)
                , map((result: ISearchResult<PositionSearchViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    refresh() {
        this.isActive = null;
        this.isManager = null;
        this.isMultiple = null;
        this.keyword = '';
        this.search(1);
    }

    add() {
        this.positionFormComponent.add();
    }

    edit(position: Position) {
        this.positionFormComponent.edit(position);
    }

    delete(id: string) {
        this.positionService.delete(id)
            .subscribe(() => this.search(this.currentPage));
    }

    private renderFilterLink() {
        const path = '/organization/positions';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('pageId', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
