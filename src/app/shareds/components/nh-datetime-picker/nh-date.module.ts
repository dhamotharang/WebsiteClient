import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material';
import { NhDateComponent } from './nh-date.component';
import { NhTimeComponent } from './nh-time/nh-time.component';

@NgModule({
    imports: [CommonModule, FormsModule, MatInputModule],
    declarations: [NhDateComponent, NhTimeComponent],
    exports: [NhDateComponent, NhTimeComponent]
})

export class NhDateModule {
}
