import {Component, ComponentFactoryResolver, Inject, OnInit, ViewChild} from '@angular/core';
import { BaseListComponent } from '../../../../base-list.component';
import { InventoryReportViewModel } from './inventory-report.viewmodel';
import { InventoryReportService } from './inventory-report.service';
import { SearchResultViewModel } from '../../../../shareds/view-models/search-result.viewmodel';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { InventoryReportDetailComponent } from './inventory-report-detail/inventory-report-detail.component';
import * as moment from 'moment';
import {IPageId, PAGE_ID} from '../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../configs/app.config';

@Component({
    selector: 'app-inventory-report',
    templateUrl: './inventory-report.component.html'
})
export class InventoryReportComponent extends BaseListComponent<InventoryReportViewModel> implements OnInit {
    @ViewChild(InventoryReportDetailComponent) inventoryReportDetailComponent: InventoryReportDetailComponent;
    fromDate: string = moment().hours(0).minutes(0).seconds(0).format('YYYY/MM/DD HH:mm');
    toDate: string = moment().format('YYYY/MM/DD HH:mm');
    warehouseId: string;

    totalOpeningStockQuantity = 0;
    totalOpeningStockValue = 0;
    totalReceivingValue = 0;
    totalReceivingQuantity = 0;
    totalDeliveringValue = 0;
    totalDeliveringQuantity = 0;
    totalClosingStockValue = 0;
    totalClosingStockQuantity = 0;

    constructor(
        private inventoryReportService: InventoryReportService,
        @Inject(PAGE_ID) public pageId: IPageId,
        @Inject(APP_CONFIG) public appConfig: IAppConfig) {
        super();
        this.pageSize = 20;
    }

    ngOnInit() {
        this.appService.setupPage(this.pageId.WAREHOUSE, this.pageId.INVENTORY_REPORT, 'Báo cáo nhập xuất tồn', 'Quản lý kho');
    }

    // onFromDateSelected(date: any) {
    //     this.fromDate = date.originalDate;
    // }
    //
    // onToDateSelected(date: any) {
    //     this.toDate = date.originalDate;
    // }

    onWarehouseSelected(warehouse: any) {
        this.warehouseId = warehouse.id;
        // this.search();
    }

    search(currentPage: number = 1) {
        this.currentPage = currentPage;
        this.listItems$ = this.inventoryReportService.search(this.keyword, this.warehouseId, this.fromDate, this.toDate, this.currentPage,
            this.pageSize)
            .pipe(map((result: SearchResultViewModel<InventoryReportViewModel>) => {
                this.totalRows = result.totalRows;
                result.items = result.items.map((item: InventoryReportViewModel) => {
                    item.closingStockQuantity = item.openingStockQuantity + item.receivingQuantity - item.deliveringQuantity;
                    item.closingStockValue = item.openingStockValue + item.receivingValue - item.deliveringValue;
                    return item;
                });
                if (result.items) {
                    this.totalOpeningStockQuantity = _.sumBy(result.items, 'openingStockQuantity');
                    this.totalOpeningStockValue = _.sumBy(result.items, 'openingStockValue');
                    this.totalReceivingQuantity = _.sumBy(result.items, 'receivingQuantity');
                    this.totalReceivingValue = _.sumBy(result.items, 'receivingValue');
                    this.totalDeliveringQuantity = _.sumBy(result.items, 'deliveringQuantity');
                    this.totalDeliveringValue = _.sumBy(result.items, 'deliveringValue');
                    this.totalClosingStockQuantity = _.sumBy(result.items, 'closingStockQuantity');
                    this.totalClosingStockValue = _.sumBy(result.items, 'closingStockValue');
                } else {
                    this.totalOpeningStockQuantity = 0;
                    this.totalOpeningStockValue = 0;
                    this.totalReceivingValue = 0;
                    this.totalReceivingQuantity = 0;
                    this.totalDeliveringValue = 0;
                    this.totalDeliveringQuantity = 0;
                    this.totalClosingStockValue = 0;
                    this.totalClosingStockQuantity = 0;
                }

                return result.items;
            }));
    }

    // resetFormSearch() {
    //     this.fromDate = moment().hours(0).minutes(0).seconds(0).format('YYYY/MM/DD HH:mm');
    //     this.toDate = moment().hours(0).minutes(0).seconds(0).format('YYYY/MM/DD HH:mm');
    //     this.warehouseId = null;
    //     this.search(1);
    // }

    detail(id: string) {
        this.inventoryReportDetailComponent.show(id, this.warehouseId, this.fromDate, this.toDate);
    }


}
