import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {BaseListComponent} from '../../../../base-list.component';
import {BranchSearchViewModel} from './viewmodel/branch-search.viewmodel';
import {BranchService} from './branch.service';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import * as  _ from 'lodash';
import {BranchFormComponent} from './branch-form/branch-form.component';

@Component({
    selector: 'app-config-website-branch',
    templateUrl: './branch.component.html',
    providers: [BranchService]
})

export class BranchComponent extends BaseListComponent<BranchSearchViewModel> {
    @ViewChild(BranchFormComponent, {static: false}) branchFormComponent: BranchFormComponent;
    listBranch;
    isShowForm;
    branchId;

    constructor(private  branchService: BranchService, private cdk: ChangeDetectorRef) {
        super();
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.branchService.search('', this.currentPage, this.pageSize)
            .subscribe((result: SearchResultViewModel<BranchSearchViewModel>) => {
                this.totalRows = result.totalRows;
                this.listBranch = result.items;
            });
    }

    add() {
        this.isShowForm = true;
        this.branchFormComponent.add();
    }

    edit(id: string) {
        this.branchId = id;
        this.isShowForm = true;
        this.cdk.detectChanges();
        setTimeout(() => {
            this.branchFormComponent.edit(id);
        }, 500);
    }

    delete(id: string) {
        this.branchService.delete(id).subscribe(() => {
            _.remove(this.listBranch, (item: BranchSearchViewModel) => {
               return item.id === id;
            });
        });
    }
}
