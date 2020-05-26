import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { TreeData } from '../../../../view-model/tree-data';
import { CategoryService } from '../category.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { ActionResultViewModel } from '../../../../shareds/view-models/action-result.viewmodel';
import { SortEvent } from '../../../../shareds/directives/ghm-draggable/ghm-sortable-list.directive';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
    styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends BaseListComponent<TreeData> implements OnInit {
    @ViewChild(CategoryFormComponent, {static: true}) categoryFormComponent: CategoryFormComponent;
    isActive: boolean;

    constructor(
        @Inject(PAGE_ID) public pageId: IPageId,
        private route: ActivatedRoute,
        private categoryService: CategoryService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.NEWS, this.pageId.NEWS_CATEGORY, 'Danh sách chuyên mục.', 'Quản lý chuyên mục.');
        this.subscribers.getRouteData = this.route.data.subscribe((result: { data: TreeData[] }) => {
            this.listItems = result.data;
        });
    }

    onSorted(event: SortEvent) {
        console.log('sorted', event);
    }

    search() {
        this.isSearching = true;
        this.subscribers.search = this.categoryService.search(this.keyword, this.isActive)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: TreeData[]) => {
                console.log(result);
                this.listItems = result;
            });
    }

    refresh() {

    }

    add() {
        this.categoryFormComponent.add();
    }

    edit(id: number) {
        this.categoryFormComponent.edit(id);
    }

    delete(id: string) {
        this.categoryService.delete(id)
            .subscribe((result: ActionResultViewModel) => {
                this.search();
            });
    }
}
