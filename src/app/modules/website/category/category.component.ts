import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { IPageId, PAGE_ID } from '../../../configs/page-id.config';
import { Category } from './category.model';
import { BaseListComponent } from '../../../base-list.component';
import { CategoryService } from './category.service';
import { map, finalize } from 'rxjs/operators';
import { ISearchResult } from '../../../interfaces/isearch.result';
import { CategoryFormComponent } from './category-form/category-form.component';
import { SpinnerService } from '../../../core/spinner/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { IResponseResult } from '../../../interfaces/iresponse-result';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    providers: [CategoryService]
})

export class CategoryComponent extends BaseListComponent<Category> implements OnInit {
    @ViewChild(CategoryFormComponent) categoryFormComponent: CategoryFormComponent;
    isActive: boolean;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private categoryService: CategoryService) {
        super();
    }

    ngOnInit() {
        this.listItems$ = this.route.data
            .pipe(map((result: { data: ISearchResult<Category> }) => {
                const data = result.data;
                this.totalRows = data.totalRows;
                return data.items;
            }));
        this.appService.setupPage(this.pageId.WEBSITE, this.pageId.NEWS_CATEGORY, 'Quản lý tin tức', 'Danh sách chuyên mục');
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.categoryService.search(this.keyword, this.isActive, this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false),
                map((result: ISearchResult<Category>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    add() {
        this.categoryFormComponent.add();
    }

    edit(category: Category) {
        this.categoryFormComponent.edit(category);
    }

    delete(id: number) {
        this.spinnerService.show('Đang xóa chuyên mục. Vui lòng đợi...');
        this.categoryService.delete(id)
            .subscribe((result: IResponseResult) => {
                this.toastr.success(result.message);
                this.search(1);
            });

    }
}
