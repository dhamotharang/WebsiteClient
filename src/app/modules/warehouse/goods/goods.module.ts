import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsReceiptNoteComponent } from './goods-receipt-note/goods-receipt-note.component';
import { GoodsDeliveryNoteComponent } from './goods-delivery-note/goods-delivery-note.component';
import { GoodsRoutingModule } from './goods-routing.module';
import { GoodsReceiptNoteFormComponent } from './goods-receipt-note/goods-receipt-note-form/goods-receipt-note-form.component';
import { CoreModule } from '../../../core/core.module';
import { NhSuggestionModule } from '../../../shareds/components/nh-suggestion/nh-suggestion.module';
import { MatButtonModule, MatCheckboxModule, MatExpansionModule, MatIconModule, MatRadioModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NhModalModule } from '../../../shareds/components/nh-modal/nh-modal.module';
import { GhmPagingModule } from '../../../shareds/components/ghm-paging/ghm-paging.module';
import { NhImageViewerModule } from '../../../shareds/components/nh-image-viewer/nh-image-viewer.module';
import { NhWizardModule } from '../../../shareds/components/nh-wizard/nh-wizard.module';
import { NhTabModule } from '../../../shareds/components/nh-tab/nh-tab.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { NhDropdownModule } from '../../../shareds/components/nh-dropdown/nh-dropdown.module';
import { DatetimeFormatModule } from '../../../shareds/pipe/datetime-format/datetime-format.module';
import { NhContextMenuModule } from '../../../shareds/components/nh-context-menu/nh-context-menu.module';
import { NHTreeModule } from '../../../shareds/components/nh-tree/nh-tree.module';
import { GhmFileExplorerModule } from '../../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import { NhSelectModule } from '../../../shareds/components/nh-select/nh-select.module';
import { ProductModule } from '../product/product.module';
import { GoodsReceiptNoteService } from './goods-receipt-note/goods-receipt-note.service';
import { NhDateModule } from '../../../shareds/components/nh-datetime-picker/nh-date.module';
import { GoodsDeliveryNoteFormComponent } from './goods-delivery-note/goods-delivery-note-form/goods-delivery-note-form.component';
import { GoodsDeliveryNoteProductComponent } from './goods-delivery-note/goods-delivery-note-form/list-product/goods-delivery-note-product.component';
import { GhmUserSuggestionModule } from '../../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { WarehouseModule } from '../warehouse.module';
import { GoodsReceiptNoteFormProductComponent } from './goods-receipt-note/goods-receipt-note-form/goods-receipt-note-form-product/goods-receipt-note-form-product.component';
import { GoodsReceiptNoteFormProductFormComponent } from './goods-receipt-note/goods-receipt-note-form/goods-receipt-note-form-product/goods-receipt-note-form-product-form/goods-receipt-note-form-product-form.component';
import { LotSuggestionComponent } from './lot-suggestion/lot-suggestion.component';
import { DeliverSuggestionComponent } from './deliver-suggestion/deliver-suggestion.component';
import { FollowSuggestionComponent } from './goods-receipt-note/follow-suggestion/follow-suggestion.component';
import { GoodsReceiptNoteDetailComponent } from './goods-receipt-note/goods-receipt-note-detail/goods-receipt-note-detail.component';
import { FormatNumberModule } from '../../../shareds/pipe/format-number/format-number.module';
import { GoodsDeliveryNoteDetailComponent } from './goods-delivery-note/goods-delivery-note-detail/goods-delivery-note-detail.component';
import { FormatMoneyStringModule } from '../../../shareds/pipe/format-money-string/format-money-string.module';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryFormComponent } from './inventory/inventory-form/inventory-form.component';
import { InventoryProductComponent } from './inventory/inventory-form/inventory-product/inventory-product.component';
import { InventoryMemberComponent } from './inventory/inventory-form/inventory-member/inventory-member.component';
import { GhmAmountToWordModule } from '../../../shareds/pipe/ghm-amount-to-word/ghm-amount-to-word.module';
import { GhmMaskModule } from '../../../shareds/components/ghm-mask/ghm-mask.module';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { InventoryReportDetailComponent } from './inventory-report/inventory-report-detail/inventory-report-detail.component';
import { WarehouseCardComponent } from './inventory-report/warehouse-card/warehouse-card.component';
import { GoodsReceiptNotePrintComponent } from './goods-receipt-note/goods-receipt-note-print/goods-receipt-note-print.component';
import { GoodsReceiptNotePrintBarcodeComponent } from './goods-receipt-note/goods-receipt-note-print-barcode/goods-receipt-note-print-barcode.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { WarehouseCardDetailComponent } from './inventory-report/warehouse-card-detail/warehouse-card-detail.component';
import { GoodsDeliveryNotePrintComponent } from './goods-delivery-note/goods-delivery-note-print/goods-delivery-note-print.component';
import { OrganizationModule } from '../../hr/organization/organization.module';
import { ReceiverSuggestionComponent } from './receiver-suggestion/receiver-suggestion.component';
import { WarehouseManagerSuggestionComponent } from './warehouse-manager-suggestion/warehouse-manager-suggestion.component';
import { InventoryDetailComponent } from './inventory/inventory-detail/inventory-detail.component';

@NgModule({
    imports: [
        CommonModule,
        GoodsRoutingModule, ProductModule,
        FormsModule, ReactiveFormsModule, CoreModule, MatCheckboxModule, MatTooltipModule, NhDateModule, GhmUserSuggestionModule,
        NHTreeModule, NhSelectModule, NhDropdownModule, MatIconModule, NhModalModule, GhmPagingModule, NhDropdownModule,
        DatetimeFormatModule, NhWizardModule, NhTabModule, NhSuggestionModule, GhmFileExplorerModule, NhContextMenuModule,
        MatRadioModule, WarehouseModule, FormatNumberModule, DatetimeFormatModule, FormatMoneyStringModule, OrganizationModule,
        NhImageViewerModule, GhmAmountToWordModule, GhmMaskModule, NgxBarcodeModule, NhTabModule, MatExpansionModule, MatButtonModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            showCancelButton: true,
        })
    ],
    declarations: [GoodsReceiptNoteComponent, GoodsDeliveryNoteComponent, GoodsReceiptNoteFormComponent,
        GoodsDeliveryNoteFormComponent, GoodsDeliveryNoteProductComponent, GoodsDeliveryNoteDetailComponent,
        GoodsDeliveryNoteFormComponent, GoodsDeliveryNoteProductComponent, GoodsReceiptNoteFormProductComponent, LotSuggestionComponent,
        GoodsReceiptNoteFormProductFormComponent, FollowSuggestionComponent,
        DeliverSuggestionComponent, InventoryComponent, InventoryFormComponent, InventoryProductComponent, InventoryMemberComponent,
        GoodsReceiptNoteDetailComponent, InventoryReportComponent, InventoryReportDetailComponent, WarehouseCardComponent,
        GoodsReceiptNotePrintComponent, GoodsReceiptNotePrintBarcodeComponent, WarehouseCardDetailComponent,
        GoodsDeliveryNotePrintComponent, ReceiverSuggestionComponent, WarehouseManagerSuggestionComponent, InventoryDetailComponent],
    entryComponents: [GoodsReceiptNoteDetailComponent, GoodsDeliveryNoteDetailComponent],
    exports: [LotSuggestionComponent],
    providers: [GoodsReceiptNoteService, GoodsReceiptNoteService]
})
export class GoodsModule {
}
