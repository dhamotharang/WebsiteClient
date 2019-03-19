import {AfterViewInit, Component, ComponentFactoryResolver, Inject, OnInit, ViewChild} from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { GoodsReceiptNoteViewModel } from './goods-receipt-note.viewmodel';
import { GoodsReceiptNoteService } from './goods-receipt-note.service';
import { SuggestionViewModel } from '../../../../shareds/view-models/SuggestionViewModel';
import { GoodsReceiptNoteFormComponent } from './goods-receipt-note-form/goods-receipt-note-form.component';
import { ActivatedRoute } from '@angular/router';
import { finalize, map } from 'rxjs/operators';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { GoodsReceiptNoteDetailComponent } from './goods-receipt-note-detail/goods-receipt-note-detail.component';
import { DynamicComponentHostDirective } from '../../../../core/directives/dynamic-component-host.directive';
import { GoodsReceiptNotePrintComponent } from './goods-receipt-note-print/goods-receipt-note-print.component';
import { GoodsReceiptNotePrintBarcodeComponent } from './goods-receipt-note-print-barcode/goods-receipt-note-print-barcode.component';
import { ISearchResult } from '../../../../interfaces/isearch.result';
import { GoodsReceiptNoteType } from './goods-receipt-note-type.const';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';

@Component({
    selector: 'app-goods-receipt-note',
    templateUrl: './goods-receipt-note.component.html'
})
export class GoodsReceiptNoteComponent extends BaseListComponent<GoodsReceiptNoteViewModel> implements OnInit, AfterViewInit {
    @ViewChild(GoodsReceiptNoteFormComponent) goodsReceiptNoteFormComponent: GoodsReceiptNoteFormComponent;
    @ViewChild(DynamicComponentHostDirective) dynamicComponentHostDirective: DynamicComponentHostDirective;
    @ViewChild(GoodsReceiptNotePrintComponent) goodsReceiptNotePrintComponent: GoodsReceiptNotePrintComponent;
    @ViewChild(GoodsReceiptNotePrintBarcodeComponent) goodsReceiptNotePrintBarcodeComponent: GoodsReceiptNotePrintBarcodeComponent;
    fromDate: string;
    toDate: string;
    supplierId: string;
    warehouseId: string;
    deliverId: string;
    goodsReceiptNoteType = GoodsReceiptNoteType;

    warehouses: SuggestionViewModel<string>[] = [];
    suppliers: SuggestionViewModel<string>[] = [];

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private route: ActivatedRoute, @Inject(PAGE_ID) public pageId: IPageId,
        @Inject(APP_CONFIG) public appConfig: IAppConfig,
        private goodsReceiptNoteService: GoodsReceiptNoteService) {
        super();
        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<GoodsReceiptNoteViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.GOODS_RECEIPT_NOTE, 'Quản lý hàng hóa', 'Danh sách phiếu nhập');
    }

    ngAfterViewInit() {
        // this.goodsReceiptNoteFormComponent.add();
    }

    onWarehouseSelected(warehouse: any) {
        this.warehouseId = warehouse.id;
        this.search();
    }

    onWarehouseRemoved() {
        this.warehouseId = null;
        this.search();
    }

    onSupplierSelected(supplier: any) {
        this.supplierId = supplier.id;
        this.search();
    }

    onSupplierRemoved() {
        this.supplierId = null;
        this.search();
    }

    onSaveSuccess(event: any) {
        if (event.isPrint) {
            this.goodsReceiptNotePrintComponent.print(event.id);
        }
        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.fromDate = '';
        this.toDate = '';
        this.supplierId = '';
        this.warehouseId = '';
        this.deliverId = '';
        this.search(1);
    }

    search(currentPage: number = 1) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.listItems$ = this.goodsReceiptNoteService
            .search(this.keyword, this.supplierId, this.warehouseId, this.deliverId, this.fromDate, this.toDate, this.currentPage)
            .pipe(
                finalize(() => this.isSearching = false),
                map((result: SearchResultViewModel<GoodsReceiptNoteViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                })
            );
    }

    add() {
        this.goodsReceiptNoteFormComponent.add();
    }

    edit(id: string) {
        this.goodsReceiptNoteFormComponent.edit(id);
    }

    confirm() {
    }

    detail(id: string) {
        this.loadDetailComponent(id);
    }

    print(id: string) {
        this.goodsReceiptNotePrintComponent.print(id);
    }

    printBarcode(id: string) {
        this.goodsReceiptNotePrintBarcodeComponent.print(id);
    }

    private loadDetailComponent(id: string) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GoodsReceiptNoteDetailComponent);
        const viewContainerRef = this.dynamicComponentHostDirective.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<GoodsReceiptNoteDetailComponent>componentRef.instance).getDetail(id);
    }
}
