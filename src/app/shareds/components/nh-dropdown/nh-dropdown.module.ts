import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhDropdownComponent } from './nh-dropdown/nh-dropdown.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [NhDropdownComponent],
    exports: [NhDropdownComponent]
})
export class NhDropdownModule {
}
