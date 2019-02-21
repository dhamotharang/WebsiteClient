import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ProductAttributeValueViewModel } from './product-attribute-value.viewmodel';
import { ProductAttributeService } from '../product-attribute.service';
import { finalize } from 'rxjs/operators';
import { ProductAttributeValueFormComponent } from './product-attribute-value-form/product-attribute-value-form.component';
import { ToastrService } from 'ngx-toastr';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {BaseListComponent} from '../../../../base-list.component';
import {ActionResultViewModel} from '../../../../shareds/view-models/action-result.viewmodel';
import {SearchResultViewModel} from '../../../../shareds/view-models/search-result.viewmodel';
import {NhSelect} from '../../../../shareds/components/nh-select/nh-select.component';

@Component({
    selector: 'app-product-attribute-value',
    templateUrl: './product-attribute-value.component.html'
})
export class ProductAttributeValueComponent extends BaseListComponent<ProductAttributeValueViewModel> implements OnInit {
    @ViewChild(ProductAttributeValueFormComponent) productAttributeValueFormComponent: ProductAttributeValueFormComponent;
    @Input() readOnly = false;
    @Input() attributeId: string;
    isActive?: boolean;

    constructor(
        @Inject(PAGE_ID) public pageId: IPageId,
        private toastr: ToastrService,
        private productAttributeService: ProductAttributeService) {
        super();
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.PRODUCT, this.pageId.PRODUCT_ATTRIBUTE, 'Quản lý sản phẩm', 'Thuộc tính sản phẩm');
    }

    onActiveStatusSelected(event: NhSelect) {
        if (event) {
            this.isActive = event.id;
        } else {
            this.isActive = null;
        }
        this.search(1);
    }

    onChangeActiveStatus(attributeValue: ProductAttributeValueViewModel) {
        attributeValue.isActive = !attributeValue.isActive;
        this.productAttributeService.updateValueActiveStatus(this.attributeId, attributeValue.id, attributeValue.isActive)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
            });
    }

    refresh() {
        this.keyword = '';
        this.isActive = null;
        this.search(1);
    }

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.subscribers.searchValues = this.productAttributeService.searchValues(this.attributeId, this.keyword, this.isActive,
            this.currentPage, this.pageSize)
            .pipe(finalize(() => this.isSearching = false))
            .subscribe((result: SearchResultViewModel<ProductAttributeValueViewModel>) => {
                if (result) {
                    this.totalRows = result.totalRows;
                    this.listItems = result.items;
                }
            });
    }

    delete(id: string) {
        this.subscribers.deleteValue = this.productAttributeService.deleteValue(this.attributeId, id)
            .subscribe((result: ActionResultViewModel) => {
                this.toastr.success(result.message);
                this.search(1);
            });
    }
}
