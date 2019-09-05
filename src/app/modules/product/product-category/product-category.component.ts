import {Component, EventEmitter, Inject, OnInit, Output, ViewChild} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {finalize, map} from 'rxjs/operators';
import {IPageId, PAGE_ID} from '../../../configs/page-id.config';
import {ActivatedRoute} from '@angular/router';
import {SpinnerService} from '../../../core/spinner/spinner.service';
import {BaseListComponent} from '../../../base-list.component';
import {ProductCategoryFormComponent} from './product-category-form/product-category-form.component';
import {CategoryProductService} from '../services/category-product.service';
import {SortEvent} from '../../../shareds/directives/ghm-draggable/ghm-sortable-list.directive';
import {TreeData} from '../../../view-model/tree-data';
import {ActionResultViewModel} from '../../../shareds/view-models/action-result.viewmodel';
import {MatDialog} from '@angular/material';

@Component({
    selector: 'app-product-category',
    templateUrl: './product-category.component.html',
    styleUrls: ['./product-category.component.css'],
    providers: [CategoryProductService]
})
export class ProductCategoryComponent extends BaseListComponent<TreeData> implements OnInit {
    isActive: boolean;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                private route: ActivatedRoute,
                private toastr: ToastrService,
                private spinnerService: SpinnerService,
                private dialog: MatDialog,
                private categoryService: CategoryProductService) {
        super();
    }

    ngOnInit() {
        this.subscribers.getRouteData = this.route.data.subscribe((result: { data: TreeData[] }) => {
            this.listItems = result.data;
        });
        this.appService.setupPage(this.pageId.PRODUCT_CATEGORY, this.pageId.PRODUCT_CATEGORY, 'Quản lý sản phẩm', 'Danh sách chuyên mục');
    }

    onSorted(event: SortEvent) {
        console.log('sorted', event);
    }

    search() {
        this.isSearching = true;
        this.subscribers.search = this.categoryService.search(this.keyword, this.isActive)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: TreeData[]) => {
                this.listItems = result;
            });
    }

    refresh() {

    }

    add() {
        const dialogRef = this.dialog.open(ProductCategoryFormComponent, {
            id: 'productcategoryAddDialog',
            disableClose: true
        });
        dialogRef.afterClosed()
            .subscribe((data) => {
                if (data.isModified) {
                    this.search();
                }
            });
    }

    edit(id: number) {
        const dialogRef = this.dialog.open(ProductCategoryFormComponent, {
           id: 'productcategoryEditDiaLog',
           data: {id: id},
           disableClose: true
        });
        dialogRef.afterClosed()
            .subscribe((data) => {
                if (data.isModified) {
                    this.search();
                }
            });
    }

    delete(id: number) {
        this.categoryService.delete(id)
            .subscribe((result: ActionResultViewModel) => {
                this.search();
            });
    }
}
