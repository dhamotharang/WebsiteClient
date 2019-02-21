import { Component, OnInit } from '@angular/core';
import { ApproverService } from './approver.service';
import { ActionResultViewModel } from '../../../shareds/view-models/action-result.viewmodel';
import { ToastrService } from 'ngx-toastr';
import { BaseListComponent } from '../../../base-list.component';
import { finalize, map } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../shareds/view-models/search-result.viewmodel';
import { ApproverViewModel } from './view-models/approver.viewmodel';
import { ActivatedRoute } from '@angular/router';
import { SuggestionViewModel } from '../../../shareds/view-models/SuggestionViewModel';

@Component({
    selector: 'app-approver',
    templateUrl: './approver.component.html',
    styleUrls: ['./approver.component.css']
})
export class ApproverComponent extends BaseListComponent<ApproverViewModel> implements OnInit {
    approverConfigTypes: SuggestionViewModel<number>[] = [];
    hasError = false;
    userId: string;
    type: number;
    typeSearch: number;

    constructor(
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private approverService: ApproverService) {
        super();
    }

    ngOnInit() {
        this.subscribers.getTypes = this.approverService.getTypes()
            .subscribe((result: SuggestionViewModel<number>[]) => this.approverConfigTypes = result);
        this.listItems$ = this.route.data.pipe(
            map((result: { data: SearchResultViewModel<ApproverViewModel> }) => {
                const data = result.data;
                if (data) {
                    this.totalRows = data.totalRows;
                    return data.items;
                }
            })
        );
    }

    onSelectApproverConfigType(item: SuggestionViewModel<number>, isSearch = false) {
        if (isSearch) {
            this.typeSearch = item.id;
            this.search(1);
        } else {
            this.type = item.id;
        }
    }

    onUserSelected(user: any) {
        this.userId = user.id;
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.approverService.search(this.keyword, this.typeSearch, this.currentPage, this.pageSize)
            .pipe(
                finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<ApproverViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    resetFormSearch() {
        this.keyword = '';
        this.search(1);
    }

    save() {
        if (!this.userId || this.type == null || this.type === undefined) {
            this.hasError = true;
        } else {
            this.hasError = false;
            this.approverService.insert(this.userId, this.type)
                .subscribe((result: ActionResultViewModel) => {
                    this.toastr.show(result.message);
                    this.search(1);
                });
        }
    }

    delete(userId: string, type: number) {
        this.approverService.delete(userId, type)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
            });
    }
}
