import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { OfficeService } from '../services/office.service';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { OfficeDetailViewModel } from '../models/office-detail.viewmodel';
import { IActionResultResponse } from '../../../../../interfaces/iaction-result-response.result';
import { TreeData } from '../../../../../view-model/tree-data';
import { BaseListComponent } from '../../../../../base-list.component';
import { OfficePositionSearchViewModel } from '../models/office-position-search.viewmodel';
import { IPageId, PAGE_ID } from '../../../../../configs/page-id.config';
import { ISearchResult } from '../../../../../interfaces/isearch.result';
import { OfficePositionService } from '../services/office-position.service';
import { NhSuggestion } from '../../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { PositionService } from '../../position/position.service';
import { PermissionViewModel } from '../../../../../shareds/view-models/permission.viewmodel';
import { finalize } from 'rxjs/operators';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'app-office-detail',
    templateUrl: './office-detail.component.html',
    providers: [
        OfficePositionService,
        Location, {provide: LocationStrategy, useClass: PathLocationStrategy}
    ]
})

export class OfficeDetailComponent extends BaseListComponent<OfficePositionSearchViewModel> implements OnInit {
    @ViewChild('officeDetailModal') officeDetailModal: NhModalComponent;
    @ViewChild('addPositionModal') addPositionModal: NhModalComponent;
    @Output() officeDeleted = new EventEmitter();
    @Output() edited = new EventEmitter();
    officeDetail: OfficeDetailViewModel;
    officeTree: TreeData[] = [];
    subscribers: any = {};
    viewType = 0;
    selectedOfficeId: number;
    officePermission: PermissionViewModel;
    positions: NhSuggestion[] = [];
    selectedPositions: NhSuggestion[] = [];
    isSearchingPositions = false;

    constructor(@Inject(PAGE_ID) private pageId: IPageId,
                private location: Location,
                private router: Router,
                private positionService: PositionService,
                private officePositionService: OfficePositionService,
                private officeService: OfficeService) {
        super();
    }

    ngOnInit() {
        this.officePermission = this.appService.getPermissionByPageId(this.pageId.OFFICE);
    }

    onModalShown() {
        this.subscribers.getTree = this.officeService.getTree()
            .subscribe((result: TreeData[]) => this.officeTree = result);

        this.viewType = 0;
    }

    onModalHidden() {
        this.location.go('/organization/offices');
    }

    onNodeSelected(node: TreeData) {
        this.selectedOfficeId = node.id;
        this.getDataByViewType();
    }

    edit() {
        this.officeDetailModal.dismiss();
        this.edited.emit(this.officeDetail.id);
    }

    deleteOffice() {
        this.officeService.delete(this.officeDetail.id)
            .subscribe(() => {
                this.officeDeleted.emit();
            });
    }

    changeViewType(viewType: number) {
        if (this.viewType === viewType) {
            return;
        }
        if (viewType === 1) {
            this.keyword = '';
        }
        this.viewType = viewType;
        this.getDataByViewType();
    }

    showDetail(officeId: number) {
        this.selectedOfficeId = officeId;
        this.getDetail();
        this.officeDetailModal.open();
    }

    closeModal() {
        this.officeDetailModal.dismiss();
    }

    getDetail() {
        this.subscribers.getDetail = this.officeService.getDetail(this.selectedOfficeId)
            .subscribe((result: IActionResultResponse<OfficeDetailViewModel>) => {
                this.officeDetail = result.data;
            });
    }

    searchPosition(currentPage: number) {
        this.currentPage = currentPage;
        this.subscribers.searchPositions = this.officePositionService
            .search(this.keyword, this.selectedOfficeId, this.currentPage, this.pageSize)
            .subscribe((result: ISearchResult<OfficePositionSearchViewModel>) => {
                this.totalRows = result.totalRows;
                this.listItems = result.items;
            });
    }

    deletePosition(positionId: string) {
        this.subscribers.deletePosition = this.officePositionService.delete(positionId, this.officeDetail.id)
            .subscribe(() => this.searchPosition(this.currentPage));
    }

    searchPositionForSuggestion(keyword: string) {
        this.isSearchingPositions = true;
        this.subscribers.searchForSuggestion =
            this.positionService.searchForSuggestion(keyword)
                .pipe(finalize(() => this.isSearchingPositions = false))
                .subscribe((result: NhSuggestion[]) => this.positions = result);
    }

    showAddPositionModal() {
        this.addPositionModal.open();
    }

    acceptAddPosition() {
        this.officePositionService
            .insert(this.selectedOfficeId, this.selectedPositions.map((item: NhSuggestion) => {
                return item.id as string;
            }))
            .subscribe(() => {
                this.addPositionModal.dismiss();
                this.searchPosition(1);
            });
    }

    onAddPositionModalShown() {
        this.selectedPositions = [];
    }

    private getDataByViewType() {
        switch (this.viewType) {
            case 0:
                this.getDetail();
                break;
            case 1:
                this.searchPosition(1);
                break;
            default:
                this.getDetail();
                break;
        }
    }
}
