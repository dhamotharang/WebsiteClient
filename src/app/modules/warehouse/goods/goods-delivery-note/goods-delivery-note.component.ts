import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { GoodsDeliveryNoteSearchViewModel } from './viewmodel/goods-delivery-note.search.viewmodel';
import { GoodsDeliveryNoteService } from './goods-delivery-note.service';
import { FilterLink } from '../../../../shareds/models/filter-link.model';
import { UtilService } from '../../../../shareds/services/util.service';
import { APP_CONFIG, IAppConfig } from '../../../../configs/app.config';
import { IPageId, PAGE_ID } from '../../../../configs/page-id.config';
import { ActivatedRoute, Router } from '@angular/router';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Location } from '@angular/common';
import { GoodsDeliveryNoteFormComponent } from './goods-delivery-note-form/goods-delivery-note-form.component';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { finalize, map } from 'rxjs/operators';
import { NhSuggestion } from '../../../../shareds/components/nh-suggestion/nh-suggestion.component';
import { GoodsDeliveryNoteDetailComponent } from './goods-delivery-note-detail/goods-delivery-note-detail.component';
import * as FileSaver from 'file-saver';
import { DeliveryType, DeliveryTypes } from '../../../../shareds/constants/deliveryType.const';
import { GoodsDeliveryNoteDetail } from './model/goods-delivery-note-details.model';
import { GoodsDeliveryNoteType } from './goods-delivery-note-type.const';
import {environment} from '../../../../../environments/environment';

@Component({
    selector: 'app-goods-delivery-note',
    templateUrl: './goods-delivery-note.component.html',
    providers: [GoodsDeliveryNoteService]
})
export class GoodsDeliveryNoteComponent extends BaseListComponent<GoodsDeliveryNoteSearchViewModel> implements OnInit, AfterViewInit {
    @ViewChild('confirmDelete') swalConfirmDelete: SwalComponent;
    @ViewChild(GoodsDeliveryNoteFormComponent) goodsDeliveryNoteFormComponent: GoodsDeliveryNoteFormComponent;
    @ViewChild(GoodsDeliveryNoteDetailComponent) goodsDeliveryNoteDetailComponent: GoodsDeliveryNoteDetailComponent;
    warehouses;
    fromDate: string;
    toDate: string;
    type;
    warehouseId;
    listDeliveryType = DeliveryTypes;
    deliveryType = DeliveryType;
    urlSearchWarehouse;
    goodsDeliveryNoteId;
    goodsDeliveryNoteType = GoodsDeliveryNoteType;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
                private location: Location,
                private route: ActivatedRoute,
                private router: Router,
                private goodsDeliveryNoteService: GoodsDeliveryNoteService,
                private utilService: UtilService) {
        super();
        this.urlSearchWarehouse = `${environment.apiGatewayUrl}api/v1/warehouse/warehouses/suggestions`;
        this.listItems$ = this.route.data.pipe(map((result: { data: SearchResultViewModel<GoodsDeliveryNoteSearchViewModel> }) => {
            const data = result.data;
            this.totalRows = data.totalRows;
            return data.items;
        }));
    }

    ngOnInit(): void {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.GOODS_DELIVERY_NOTE, 'Quản lý xuất kho', 'Quản lý kho');

        this.subscribers.queryParams = this.route.queryParams.subscribe(params => {
            this.keyword = params.keyword ? params.keyword : '';
            this.fromDate = params.keyword ? params.fromDate : '';
            this.toDate = params.toDate ? params.toDate : '';
            this.type = params.type ? parseInt(params.type) : '';
            this.warehouseId = params.warehouseId ? params.warehouseId : '';
            this.currentPage = params.page ? parseInt(params.page) : 1;
            this.pageSize = params.pageSize ? parseInt(params.pageSize) : this.appConfig.PAGE_SIZE;
        });
    }

    ngAfterViewInit() {
        this.swalConfirmDelete.confirm.subscribe(result => {
            this.delete(this.goodsDeliveryNoteId);
        });
        // this.goodsDeliveryNoteFormComponent.add();
    }

    onWarehouseRemoved() {
        this.warehouseId = null;
        this.search();
    }

    add() {
        this.goodsDeliveryNoteFormComponent.add();
    }

    search(currentPage = 1) {
        this.currentPage = currentPage;
        this.isSearching = true;
        this.renderFilterLink();
        this.listItems$ = this.goodsDeliveryNoteService.search(this.keyword, this.fromDate, this.toDate,
            this.type, this.warehouseId, this.currentPage, this.pageSize)
            .pipe(finalize(() => {
                    this.isSearching = false;
                }),
                map((result: SearchResultViewModel<GoodsDeliveryNoteSearchViewModel>) => {
                    this.totalRows = result.totalRows;
                    return result.items;
                }));
    }

    onPageClick(page: number) {
        this.currentPage = page;
        this.search(1);
    }

    resetFormSearch() {
        this.keyword = '';
        this.search(1);
    }

    edit(goodsDeliveryNote: GoodsDeliveryNoteSearchViewModel) {
        this.goodsDeliveryNoteFormComponent.edit(goodsDeliveryNote.id);
    }

    delete(id: string) {
        this.goodsDeliveryNoteService.delete(id).subscribe(() => {
            // _.remove(this.listGoodsDeliveryNote, (item: GoodsDeliveryNoteSearchViewModel) => {
            //     return item.id === id;
            // });
            this.search(1);
        });
    }

    detail(goodsDeliveryNote: GoodsDeliveryNoteSearchViewModel) {
        this.goodsDeliveryNoteDetailComponent.show(goodsDeliveryNote.id);
    }

    confirm(value: GoodsDeliveryNoteSearchViewModel) {
        this.swalConfirmDelete.show();
        this.goodsDeliveryNoteId = value.id;
    }

    selectWarehouse(value: NhSuggestion) {
        if (value) {
            this.warehouseId = value.id;
        } else {
            this.warehouseId = '';
        }

        this.search(1);
    }

    selectDeliveryType(value: NhSuggestion) {
        if (value) {
            this.type = value.id;
        } else {
            this.type = '';
        }
        this.search(1);
    }

    exportExcel(item: GoodsDeliveryNoteSearchViewModel) {
        this.goodsDeliveryNoteService.exportGoodsDeliveryDeltail(item.id)
            .subscribe(result => {
                FileSaver.saveAs(result, 'Phieu_xuat_kho.xlsx');
                const fileURL = URL.createObjectURL(result);
                window.open(fileURL);
            });
    }

    export() {
    }

    print(goodsDeliveryNoteDetail: GoodsDeliveryNoteDetail) {
        // console.log(goodsDeliveryNoteDetail);
    }

    private renderFilterLink() {
        const path = '/goods/goods-delivery-notes';
        const query = this.utilService.renderLocationFilter([
            new FilterLink('keyword', this.keyword),
            new FilterLink('fromDate', this.fromDate),
            new FilterLink('toDate', this.toDate),
            new FilterLink('type', this.type),
            new FilterLink('warehouseId', this.warehouseId),
            new FilterLink('page', this.currentPage),
            new FilterLink('pageSize', this.pageSize)
        ]);
        this.location.go(path, query);
    }
}
