import {Component, ComponentFactoryResolver, Inject, Input, OnInit, ViewChild} from '@angular/core';
import { NhModalComponent } from '../../../../../shareds/components/nh-modal/nh-modal.component';
import { BaseListComponent } from '../../../../../base-list.component';
import { GoodsReceiptNoteService } from '../../goods-receipt-note/goods-receipt-note.service';
import { SearchResultViewModel } from '../../../../../shareds/view-models/search-result.viewmodel';
import { map } from 'rxjs/operators';
import { WarehouseCardItemViewModel, WarehouseCardViewModel } from './warehouse-card.viewmodel';
import { DynamicComponentHostDirective } from '../../../../../core/directives/dynamic-component-host.directive';
import { GoodsReceiptNoteDetailComponent } from '../../goods-receipt-note/goods-receipt-note-detail/goods-receipt-note-detail.component';
import { InventoryReportService } from '../inventory-report.service';
import { GoodsDeliveryNoteDetailComponent } from '../../goods-delivery-note/goods-delivery-note-detail/goods-delivery-note-detail.component';
import {IPageId, PAGE_ID} from '../../../../../configs/page-id.config';
import {APP_CONFIG, IAppConfig} from '../../../../../configs/app.config';

@Component({
    selector: 'app-warehouse-card',
    templateUrl: './warehouse-card.component.html'
})
export class WarehouseCardComponent extends BaseListComponent<any> implements OnInit {
    @ViewChild('inventoryDetailModal') inventoryDetailModal: NhModalComponent;
    @ViewChild(DynamicComponentHostDirective) dynamicComponentHostDirective: DynamicComponentHostDirective;
    productId: string;
    fromDate: string;
    toDate: string;
    warehouseId: string;
    warehouseCard: WarehouseCardViewModel;

    constructor(@Inject(PAGE_ID) public pageId: IPageId,
                @Inject(APP_CONFIG) public appConfig: IAppConfig,
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

    search(currentPage: number) {
        this.currentPage = currentPage;
        this.subscribers.getWarehousecard = this.inventoryReportService
            .searchWarehouseCard(this.warehouseId, this.productId,
                this.fromDate, this.toDate, this.currentPage)
            .subscribe((warehouseCardViewModel: WarehouseCardViewModel) => {
                if (warehouseCardViewModel) {
                    this.totalRows = warehouseCardViewModel.totalItems;
                    this.warehouseCard = warehouseCardViewModel;
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
