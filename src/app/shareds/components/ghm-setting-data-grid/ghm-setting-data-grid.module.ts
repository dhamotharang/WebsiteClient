import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GhmSettingDataGridComponent} from './ghm-setting-data-grid.component';
import {DxCheckBoxModule} from 'devextreme-angular';
import {FormsModule} from '@angular/forms';
import {NhDropdownModule} from '../nh-dropdown/nh-dropdown.module';

@NgModule({
    declarations: [GhmSettingDataGridComponent],
    imports: [
        CommonModule, FormsModule, DxCheckBoxModule, NhDropdownModule
    ],
    exports: [GhmSettingDataGridComponent]
})

export class GhmSettingDataGridModule {
}
