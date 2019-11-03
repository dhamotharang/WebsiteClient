import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CoreModule} from '../../core/core.module';
import {MatCheckboxModule, MatIconModule, MatRadioModule, MatTooltipModule} from '@angular/material';
import {NhSelectModule} from '../../shareds/components/nh-select/nh-select.module';
import {BrandComponent} from './brand.component';
import {BrandFormComponent} from './brand-form/brand-form.component';
import {NhDropdownModule} from '../../shareds/directives/nh-dropdown/nh-dropdown.module';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {NhSuggestionModule} from '../../shareds/components/nh-suggestion/nh-suggestion.module';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import {NhContextMenuModule} from '../../shareds/components/nh-context-menu/nh-context-menu.module';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {FormatNumberModule} from '../../shareds/pipe/format-number/format-number.module';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {BrandRoutingModule} from './brand-routing.module';
import { AgencyListComponent } from './agency/agency-list/agency-list.component';
import { AgencyFormComponent } from './agency/agency-form/agency-form.component';
import {DxCheckBoxModule, DxContextMenuModule, DxDataGridModule, DxTemplateModule} from 'devextreme-angular';
import {GhmSettingDataGridModule} from '../../shareds/components/ghm-setting-data-grid/ghm-setting-data-grid.module';
import {GhmSelectModule} from '../../shareds/components/ghm-select/ghm-select.module';
import {GhmInputModule} from '../../shareds/components/ghm-input/ghm-input.module';

@NgModule({
    imports: [
        CommonModule, BrandRoutingModule, FormsModule, ReactiveFormsModule, CoreModule, MatCheckboxModule, MatTooltipModule,
        NhSelectModule, NhDropdownModule, MatIconModule, NhModalModule, GhmPagingModule, NhDropdownModule,
        DatetimeFormatModule, NhSuggestionModule, GhmFileExplorerModule, NhContextMenuModule,
        MatRadioModule, FormatNumberModule,  DxDataGridModule,  DxContextMenuModule, DxTemplateModule,
        MatRadioModule, NhSuggestionModule, GhmSettingDataGridModule, GhmSelectModule, GhmInputModule, DxCheckBoxModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn blue cm-mgr-5',
            cancelButtonClass: 'btn',
            showCancelButton: true,
        })
    ],
    declarations: [BrandComponent, BrandFormComponent, AgencyListComponent, AgencyFormComponent],
    exports: []
})
export class BrandModule {
}