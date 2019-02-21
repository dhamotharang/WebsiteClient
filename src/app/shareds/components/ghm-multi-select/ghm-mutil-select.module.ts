import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhmMultiSelectService } from './ghm-multi-select.service';
import { GhmMultiSelectComponent } from './ghm-multi-select.component';
import { NhModalModule } from '../nh-modal/nh-modal.module';
import { GhmPagingModule } from '../ghm-paging/ghm-paging.module';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../../core/core.module';

@NgModule({
    imports: [CommonModule, NhModalModule, GhmPagingModule, CoreModule, FormsModule],
    exports: [GhmMultiSelectComponent],
    declarations: [GhmMultiSelectComponent],
    providers: [GhmMultiSelectService],
})
export class GhmMutilSelectModule {
}
