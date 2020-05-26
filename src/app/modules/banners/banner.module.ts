import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BannerComponent} from './banner.component';
import {BannerRoutingModule} from './banner-routing.module';
import {NhSelectModule} from '../../shareds/components/nh-select/nh-select.module';
import {DatetimeFormatModule} from '../../shareds/pipe/datetime-format/datetime-format.module';
import {MatCheckboxModule, MatTooltipModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NhDateModule} from '../../shareds/components/nh-datetime-picker/nh-date.module';
import {NhModalModule} from '../../shareds/components/nh-modal/nh-modal.module';
import {NHTreeModule} from '../../shareds/components/nh-tree/nh-tree.module';
import {GhmUserSuggestionModule} from '../../shareds/components/ghm-user-suggestion/ghm-user-suggestion.module';
import {GhmSelectPickerModule} from '../../shareds/components/ghm-select-picker/ghm-select-picker.module';
import {CoreModule} from '../../core/core.module';
import {GhmPagingModule} from '../../shareds/components/ghm-paging/ghm-paging.module';
import {SweetAlert2Module} from '@sweetalert2/ngx-sweetalert2';
import {BannerFormComponent} from './banner-form/banner-form.component';
import {BannerHistoryComponent} from './banner-history/banner-history.component';
import {BannerItemComponent} from './banner-items/banner-item.component';
import {GhmFileExplorerModule} from '../../shareds/components/ghm-file-explorer/ghm-file-explorer.module';
import {BannerItemFormComponent} from './banner-items/banner-item-form/banner-item-form.component';
import {GhmSelectModule} from '../../shareds/components/ghm-select/ghm-select.module';

@NgModule({
    imports: [CommonModule, BannerRoutingModule,  NhSelectModule, DatetimeFormatModule, GhmSelectModule,
        MatCheckboxModule, NhDateModule, NhDateModule, MatTooltipModule, GhmFileExplorerModule,
        NhModalModule, ReactiveFormsModule, FormsModule, MatTooltipModule, NHTreeModule, GhmUserSuggestionModule,
        GhmSelectPickerModule, CoreModule, GhmPagingModule, SweetAlert2Module.forRoot()],
    exports: [BannerComponent],
    declarations: [BannerComponent, BannerFormComponent, BannerHistoryComponent, BannerItemComponent, BannerItemFormComponent]
})

export class BannerModule {
}
