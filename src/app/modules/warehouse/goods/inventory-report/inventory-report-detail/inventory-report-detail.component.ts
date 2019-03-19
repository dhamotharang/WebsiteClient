import {Component, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { BaseListComponent } from '../../../../../base-list.component';
import { GoodsReceiptNoteService } from '../../goods-receipt-note/goods-receipt-note.service';
import { InventoryReportService } from '../inventory-report.service';
import { WarehouseCardComponent } from '../warehouse-card/warehouse-card.component';
import { WarehouseCardDetailComponent } from '../warehouse-card-detail/warehouse-card-detail.component';
import { NhTabComponent } from '../../../../../shareds/components/nh-tab/nh-tab.component';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';

@Component({
    selector: 'app-inventory-report-detail',
    templateUrl: './inventory-report-detail.component.html'
})
export class InventoryReportDetailComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild('inventoryDetailModal') inventoryDetailModal: NhModalComponent;
    @ViewChild(WarehouseCardComponent) warehouseCardComponent: WarehouseCardComponent;
    @ViewChild(WarehouseCardDetailComponent) warehouseCardDetailComponent: WarehouseCardDetailComponent;
    @ViewChild('inventoryDailyReportDetailTab') inventoryDailyReportDetailTab: NhTabComponent;
    productId: string;
    fromDate: string;
    toDate: string;
    warehouseId: string;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig) {
        super();
    }

    ngOnInit() {
    }

    onModalHidden() {
        this.productId = null;
        this.warehouseId = null;
        this.fromDate = null;
        this.toDate = null;
        this.inventoryDailyReportDetailTab.setTabActiveById('warehouseCard');
    }

    onWarehouseDetailSelected() {
        this.warehouseCardDetailComponent.productId = this.productId;
        this.warehouseCardDetailComponent.warehouseId = this.warehouseId;
        this.warehouseCardDetailComponent.fromDate = this.fromDate;
        this.warehouseCardDetailComponent.toDate = this.toDate;
        this.warehouseCardDetailComponent.search();
    }

    show(productId: string, warehouseId, fromDate?: string, toDate?: string) {
        this.productId = productId;
        this.warehouseId = warehouseId;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.inventoryDetailModal.open();
        this.warehouseCardComponent.productId = productId;
        this.warehouseCardComponent.warehouseId = warehouseId;
        this.warehouseCardComponent.fromDate = fromDate;
        this.warehouseCardComponent.toDate = toDate;
        this.warehouseCardComponent.search(1);
    }
}
