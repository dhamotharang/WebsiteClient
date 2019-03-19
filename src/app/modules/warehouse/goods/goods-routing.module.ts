import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsReceiptNoteComponent } from './goods-receipt-note/goods-receipt-note.component';
import { GoodsDeliveryNoteComponent } from './goods-delivery-note/goods-delivery-note.component';
import { GoodsDeliveryNoteService } from './goods-delivery-note/goods-delivery-note.service';
import { GoodsReceiptNoteService } from './goods-receipt-note/goods-receipt-note.service';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryService } from './inventory/service/inventory.service';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { InventoryReportService } from './inventory-report/inventory-report.service';
import { InventoryFormComponent } from './inventory/inventory-form/inventory-form.component';
import { InventoryDetailComponent } from './inventory/inventory-detail/inventory-detail.component';

export const goodsRoutes: Routes = [
    {
        path: '',
        component: GoodsReceiptNoteComponent,
        resolve: {
            data: GoodsReceiptNoteService
        }
    },
    {
        path: 'goods-receipt-notes',
        component: GoodsReceiptNoteComponent,
        resolve: {
            data: GoodsReceiptNoteService
        }
    },
    {
        path: 'goods-delivery-notes',
        component: GoodsDeliveryNoteComponent,
        resolve: {
            data: GoodsDeliveryNoteService
        }
    },
    {
        path: 'inventories',
        component: InventoryComponent,
        resolve: {
            data: InventoryService
        }
    },
    {
        path: 'inventories/add',
        component: InventoryFormComponent,
    },
    {
        path: 'inventories/edit/:id',
        component: InventoryFormComponent,
    },
    {
        path: 'inventories/:id',
        component: InventoryDetailComponent,
    },
    {
        path: 'inventory-report',
        component: InventoryReportComponent,
        resolve: {
            data: InventoryReportService
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(goodsRoutes)],
    exports: [RouterModule],
    providers: [GoodsReceiptNoteService, GoodsDeliveryNoteService, InventoryService, InventoryReportService]
})

export class GoodsRoutingModule {
}
