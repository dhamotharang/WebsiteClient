import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild } from '@angular/core';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { BaseListComponent } from '../../../../../base-list.component';
import { GoodsReceiptNoteService } from '../../goods-receipt-note/goods-receipt-note.service';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { map } from 'rxjs/operators';
import { DynamicComponentHostDirective } from '../../../../../core/directives/dynamic-component-host.directive';
import { GoodsReceiptNoteDetailComponent } from '../../goods-receipt-note/goods-receipt-note-detail/goods-receipt-note-detail.component';
import { WarehouseCardDetailItemViewModel, WarehouseCardDetailViewModel } from './warehouse-card-detail.viewmodel';
import { WarehouseCardItemViewModel } from '../warehouse-card/warehouse-card.viewmodel';
import { InventoryReportService } from '../inventory-report.service';
import { GoodsDeliveryNoteDetailComponent } from '../../goods-delivery-note/goods-delivery-note-detail/goods-delivery-note-detail.component';

@Component({
    selector: 'app-warehouse-card-detail',
    templateUrl: './warehouse-card-detail.component.html'
})
export class WarehouseCardDetailComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild('inventoryDetailModal') inventoryDetailModal: NhModalComponent;
    @ViewChild(DynamicComponentHostDirective) dynamicComponentHostDirective: DynamicComponentHostDirective;
    productId: string;
    fromDate: string;
    toDate: string;
    warehouseId: string;
    warehouseCard: WarehouseCardDetailViewModel;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private inventoryReportService: InventoryReportService) {
        super();
    }

    ngOnInit() {
    }

    show(id: string, warehouseId, fromDate: string, toDate: string) {
        this.productId = id;
        this.warehouseId = warehouseId;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.inventoryDetailModal.open();
        this.search(1);
    }

    search(currentPage: number = 1) {
        this.currentPage = currentPage;
        this.subscribers.getWarehousecard = this.inventoryReportService
            .searchWarehouseCardDetail(this.warehouseId, this.productId,
                this.fromDate, this.toDate, this.currentPage)
            .subscribe((warehouseCardDetailViewModel: WarehouseCardDetailViewModel) => {
                if (warehouseCardDetailViewModel) {
                    this.totalRows = warehouseCardDetailViewModel.totalItems;
                    this.warehouseCard = warehouseCardDetailViewModel;
                    // let openingStockQuantity = this.warehouseCard.openingStockQuantity;
                    // let openingStockValue = this.warehouseCard.openingStockQuantity;
                    // if (warehouseCardDetailViewModel.warehouseCardItems) {
                    //     warehouseCardDetailViewModel.warehouseCardItems.map((warehouseCardItem: WarehouseCardDetailItemViewModel) => {
                    //         openingStockQuantity = warehouseCardItem.isReceiving
                    //             ? openingStockQuantity + warehouseCardItem.quantity
                    //             : openingStockQuantity - warehouseCardItem.quantity;
                    //         openingStockValue = warehouseCardItem.isReceiving
                    //             ? openingStockValue + warehouseCardItem.value
                    //             : openingStockValue - warehouseCardItem.value;
                    //         warehouseCardItem.inventory = openingStockQuantity;
                    //         warehouseCardItem.inventoryValue = openingStockValue;
                    //     });
                    // }
                }
            });
    }

    // View goods receipt/delivery note.
    detail(id: string, isReceiving: boolean) {
        if (isReceiving) {
            this.loadDetailComponent(id);
        } else {
            this.loadGoodsDeliveryNoteDetailComponent(id);
        }
    }

    private loadDetailComponent(id: string) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GoodsReceiptNoteDetailComponent);
        const viewContainerRef = this.dynamicComponentHostDirective.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<GoodsReceiptNoteDetailComponent>componentRef.instance).getDetail(id);
    }

    private loadGoodsDeliveryNoteDetailComponent(id: string) {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GoodsDeliveryNoteDetailComponent);
        const viewContainerRef = this.dynamicComponentHostDirective.viewContainerRef;
        viewContainerRef.clear();
        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<GoodsDeliveryNoteDetailComponent>componentRef.instance).getDetail(id);
    }
}
