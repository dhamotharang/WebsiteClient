import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderFormComponent} from './order-form/order-form.component';
import {OrderListComponent} from './order-list/order-list.component';
import {RouterModule, Routes} from '@angular/router';
import {DxCheckBoxModule, DxContextMenuModule, DxDataGridModule, DxDateBoxModule, DxTemplateModule} from 'devextreme-angular';
import {GhmSettingDataGridModule} from '../../shareds/components/ghm-setting-data-grid/ghm-setting-data-grid.module';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {ProductSuggestionModule} from '../product/product/product-suggestion/product-suggestion.module';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {GhmMaskModule} from '../../shareds/components/ghm-mask/ghm-mask.module';
import {FormatNumberModule} from '../../shareds/pipe/format-number/format-number.module';
import {OrderService} from './service/order.service';
import {GhmInputModule} from '../../shareds/components/ghm-input/ghm-input.module';
import {GhmSelectModule} from '../../shareds/components/ghm-select/ghm-select.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {NhDateModule} from '../../shareds/components/nh-datetime-picker/nh-date.module';
import {CoreModule} from '../../core/core.module';
import {NhTabModule} from '../../shareds/components/nh-tab/nh-tab.module';

export const routes: Routes = [
    {
        path: '',
        component: OrderListComponent,
        resolve: {
            data: OrderService
        }
    }
];

@NgModule({
    imports: [
        CommonModule, [RouterModule.forChild(routes)], CoreModule, FormsModule, ReactiveFormsModule, NhDateModule,
        ProductSuggestionModule, GhmPagingModule, GhmSettingDataGridModule, NhModalModule, NhTabModule,
        DxDataGridModule, DxCheckBoxModule, DxContextMenuModule, DxTemplateModule, GhmSettingDataGridModule,
        DatetimeFormatModule, GhmMaskModule, FormatNumberModule, GhmInputModule, GhmSelectModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-primary cm-mgr-5',
            cancelButtonClass: 'btn',
            confirmButtonText: 'Đồng ý',
            showCancelButton: true,
            cancelButtonText: 'Hủy bỏ'
        })],
    declarations: [OrderFormComponent, OrderListComponent],
    providers: [OrderService]
})
export class OrderModule {
}
