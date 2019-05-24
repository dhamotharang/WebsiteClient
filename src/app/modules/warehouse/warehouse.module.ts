import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCheckboxModule, MatIconModule, MatRadioModule, MatTooltipModule } from '@angular/material';
import { CoreModule } from '../../core/core.module';
import { NhTabModule } from '../../shareds/components/nh-tab/nh-tab.module';
import { NhSuggestionModule } from '../../shareds/components/nh-suggestion/nh-suggestion.module';
import { NhContextMenuModule } from '../../shareds/components/nh-context-menu/nh-context-menu.module';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { WarehouseComponent } from './warehouse/warehouse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NhSelectModule } from '../../shareds/components/nh-select/nh-select.module';
import { NhDropdownModule } from '../../shareds/components/nh-dropdown/nh-dropdown.module';
import { NhModalModule } from '../../shareds/components/nh-modal/nh-modal.module';
import { GhmPagingModule } from '../../shareds/components/ghm-paging/ghm-paging.module';
import { NHTreeModule } from '../../shareds/components/nh-tree/nh-tree.module';
import { NhWizardModule } from '../../shareds/components/nh-wizard/nh-wizard.module';
import { DatetimeFormatModule } from '../../shareds/pipe/datetime-format/datetime-format.module';
import { GhmFileExplorerModule } from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import { WarehouseFormComponent } from './warehouse/warehouse-form/warehouse-form.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseManagerConfigComponent } from './warehouse/warehouse-form/warehouse-manager-config/warehouse-manager-config.component';
import { GhmUserSuggestionModule } from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import { WarehouseLimitComponent } from './warehouse/warehouse-form/warehouse-limit/warehouse-limit.component';
import { WarehouseSuggestionComponent } from './warehouse/warehouse-suggestion/warehouse-suggestion.component';
import { WarehouseDetailComponent } from './warehouse/warehouse-detail/warehouse-detail.component';
import { FormatNumberModule } from '../../shareds/pipe/format-number/format-number.module';
import { TinymceModule } from '../../shareds/components/tinymce/tinymce.module';
import { GhmMaskModule } from '../../shareds/components/ghm-mask/ghm-mask.module';
import { ProductModule } from './product/product.module';
import { WarehouseConfigComponent } from './warehouse/warehouse-form/warehouse-config/warehouse-config.component';
import {OAuthModule} from 'angular-oauth2-oidc';

@NgModule({
    imports: [CommonModule, WarehouseRoutingModule, FormsModule, ReactiveFormsModule, CoreModule, MatCheckboxModule, MatTooltipModule,
        NHTreeModule, NhSelectModule, NhDropdownModule, MatIconModule, NhModalModule, GhmPagingModule, NhDropdownModule,
        DatetimeFormatModule, NhWizardModule, NhTabModule, NhSuggestionModule, GhmFileExplorerModule, NhContextMenuModule,
        MatRadioModule, GhmUserSuggestionModule, NhSelectModule, FormatNumberModule, TinymceModule, GhmMaskModule, ProductModule,
        MatButtonModule,
        OAuthModule.forRoot(),
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            showCancelButton: true,
        })],
    declarations: [WarehouseComponent, WarehouseFormComponent, WarehouseManagerConfigComponent, WarehouseLimitComponent,
        WarehouseSuggestionComponent, WarehouseDetailComponent, WarehouseConfigComponent],
    exports: [WarehouseSuggestionComponent]
})

export class WarehouseModule {
}
