import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhmSelectPickerComponent } from './ghm-select-picker.component';
import { GhmSelectPickerService } from './ghm-select-picker.service';

@NgModule({
    imports: [CommonModule],
    exports: [GhmSelectPickerComponent],
    declarations: [GhmSelectPickerComponent],
    providers: [GhmSelectPickerService],
})
export class GhmSelectPickerModule {
}
