import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NhSelectComponent } from './nh-select.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
    imports: [CommonModule, OverlayModule],
    declarations: [NhSelectComponent],
    exports: [NhSelectComponent]
})

export class NhSelectModule {
}
