import {Component, ViewChild} from '@angular/core';
import {BranchSearchViewModel} from '../branch/viewmodel/branch-search.viewmodel';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {CoreValuesSearchViewModel} from './viewmodel/core-values-search.viewmodel';
import {BaseListComponent} from '../../../../base-list.component';
import {CoreValuesService} from './core-values.service';
import {CoreValuesFormComponent} from './core-values-form/core-values-form.component';
import * as _ from 'lodash';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {environment} from '../../../../../environments/environment';
import {ExplorerItem} from '../../../../shareds/components/ghm-file-explorer/explorer-item.model';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-config-website-core-values',
    templateUrl: './core-values.component.html',
    providers: [CoreValuesService]
})

export class CoreValuesComponent extends BaseListComponent<CoreValuesSearchViewModel> {
    @ViewChild(CoreValuesFormComponent, {static: true}) coreValueFormComponent: CoreValuesFormComponent;
    listCoreValue: CoreValuesSearchViewModel[];
    isShowForm;
    branchId;
    urlFile = `${environment.fileUrl}`;

    constructor(
        private toastr: ToastrService,
        private  coreValueService: CoreValuesService) {
        super();
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.coreValueService.search('', this.currentPage, this.pageSize)
            .subscribe((result: SearchResultViewModel<CoreValuesSearchViewModel>) => {
                this.totalRows = result.totalRows;
                this.listCoreValue = result.items;
            });
    }

    add() {
        this.isShowForm = true;
        this.coreValueFormComponent.add();
    }

    edit(id: string) {
        this.branchId = id;
        this.isShowForm = true;
        setTimeout(() => {
            this.coreValueFormComponent.edit(id);
        }, 100);
    }

    delete(id: string) {
        this.coreValueService.delete(id).subscribe(() => {
            _.remove(this.listCoreValue, (item: BranchSearchViewModel) => {
                return item.id === id;
            });
        });
    }

    drop(event: CdkDragDrop<CoreValuesSearchViewModel[]>) {
        moveItemInArray(this.listCoreValue, event.previousIndex, event.currentIndex);
        console.log(this.listCoreValue[event.currentIndex]);
    }
}
