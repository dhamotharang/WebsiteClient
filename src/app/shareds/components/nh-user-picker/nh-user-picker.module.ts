import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhUserPickerComponent } from './nh-user-picker.component';
import { NhUserPickerService } from './nh-user-picker.service';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../../../core/core.module';
import { GhmPagingModule } from '../ghm-paging/ghm-paging.module';
import { NHTreeModule } from '../nh-tree/nh-tree.module';

@NgModule({
    imports: [CommonModule, FormsModule, CoreModule, GhmPagingModule, NHTreeModule],
    exports: [NhUserPickerComponent],
    declarations: [NhUserPickerComponent],
    providers: [NhUserPickerService],
})
export class NhUserPickerModule {
}
